import { getUserIdsFromContent } from '../utils/messageParser.js';
import { saveTaco, saveViolation, getTacosSentInLastDay, getViolationsRowId } from '../dao/dao.js';
import { log } from '../utils/logger.js';

const DAILY_TACO_LIMIT_PER_USER = 3;

export async function captureSentTacos( client, message ) {
    const { author, content } = message;
        if( content.includes('@') && content.includes('🌮')){
            const numTacosSentByAuthorInLastDay = await (await getTacosSentInLastDay(author.id)).length;
            const userIdList = getUserIdsFromContent( message );
            const usersList = [];
    
            // if(userIdList.includes(author.id)) {
            //     Dao.saveViolation(author.id);
            //     Dao.getViolationsRowId( ( violationCount ) => {
            //         log.info(`User ${author.username} tried to give tacos to themselves, #${violationCount.id} silly users.`);
            //         author.send(`VIOLATION: You cannot give yourself tacos.\nThis incident will be reported to the authorities, your case number for this offense is #${violationCount.id}.`);
            //     });
            //     return;
            // }
            log.info( numTacosSentByAuthorInLastDay, ' <= ', DAILY_TACO_LIMIT_PER_USER)
            if( numTacosSentByAuthorInLastDay <= DAILY_TACO_LIMIT_PER_USER ) {
                for( const userId of userIdList ) {
                    let remainingTacos = DAILY_TACO_LIMIT_PER_USER - numTacosSentByAuthorInLastDay;
                    if (remainingTacos > 0){
                        let user = await client.users.fetch( userId ).catch( e => console.error( e ));
                        if ( user ) {
                            usersList.push(user);
                            console.log( `>> ${author.username}#${user.discriminator} gave a taco to ${user.username}#${user.discriminator}` );
                            saveTaco( message, user);
                        }
                        remainingTacos--;
                    } else {
                        author.send(`Aw crap, you exceeded the maximum taco limit today (${DAILY_TACO_LIMIT_PER_USER}).\n
                            New (fresh) tacos will be arriving shortly, thank you for patience.`);
                    }
                }
            } else {
                author.send(`Aww crap, you exceeded the maximum taco limit today (${DAILY_TACO_LIMIT_PER_USER}).\n
                            New (fresh) tacos will be arriving shortly, thank you for patience.`);
            }
        }
}