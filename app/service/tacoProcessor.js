import { getUserIdsFromContent } from '../utils/messageParser.js';
import { saveTaco, getTacosSentInLastDay } from '../dao/dao.js';
import { saveViolation, getViolationsRowId } from '../dao/violationDao.js';
import { log } from '../utils/logger.js';

const DAILY_TACO_LIMIT_PER_USER = 3;

export async function captureSentTacos( client, message ) {
    const { author, content } = message;
        if( content.includes('@') && content.includes('🌮')){
            const userIdList = getUserIdsFromContent( message );
    
            // if( await selfGratificationViolation( userIdList, author)) {
            //     return;
            // }

            const numTacosSentByAuthorInLastDay = (await getTacosSentInLastDay(author.id)).length;

            log.info( numTacosSentByAuthorInLastDay, ' <= ', DAILY_TACO_LIMIT_PER_USER)

            const users = await Promise.all( userIdList.map( async userId => await client.users.fetch( userId )));
            if( users ) {
                log.debug( users );
            }

            if( numTacosSentByAuthorInLastDay <= DAILY_TACO_LIMIT_PER_USER ) {
                for( const userId of userIdList ) {
                        let user = await client.users.fetch( userId ).catch( e => console.error( e ));
                        const usersList = [];
                        if ( user ) {
                            usersList.push(user);
                            saveTaco( message, user);
                            log.info( `>> ${author.username}#${user.discriminator} gave a taco to ${user.username}#${user.discriminator}` );
                        }
                    // } else {
                    //     author.send(`Aw crap, you exceeded the maximum taco limit today (${DAILY_TACO_LIMIT_PER_USER}).\n
                    //         New (fresh) tacos will be arriving shortly, thank you for patience.`);
                    //  }
                }
            } else {
                author.send(`Aww crap, you exceeded the maximum taco limit today (${DAILY_TACO_LIMIT_PER_USER}).\n
                            New (fresh) tacos will be arriving shortly, thank you for patience.`);
            }
        }
}

const selfGratificationViolation = async ( userIdList, author) => {
    if(userIdList.includes(author.id)){
        saveViolation(author.id);
        const violationCount = await getViolationsRowId();
        log.info(`User ${author.username} tried to give tacos to themselves, #${violationCount.id} silly users.`);
        author.send(`VIOLATION: You cannot give yourself tacos.\nThis incident will be reported to the authorities, your case number for this offense is #${violationCount.id}.`);
        return true;
    }
    return false;
}