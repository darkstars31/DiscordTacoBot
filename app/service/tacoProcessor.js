import { getUserIdsFromContent } from '../utils/messageParser.js';
import { saveTaco, getTacosSentInLastDay } from '../dao/dao.js';
import { createUser, getUser } from '../dao/userDao.js';
import { saveViolation, getViolationsRowId } from '../dao/violationDao.js';
import { createGuild, getGuild } from "../dao/guildDao.js";
import { log } from '../utils/logger.js';

const DAILY_TACO_LIMIT_PER_USER = 3;

export async function captureSentTacos( client, message ) {
    const { author, content, guildId } = message;
        if( content.includes('@') && content.includes('🌮')){
            const userIdList = getUserIdsFromContent( message );
    
            // if( await selfGratificationViolation( userIdList, author)) {
            //     return;
            // }
            //log.debug('message.mentions', message.mentions);
            const guildFromDatabase = await getGuild( guildId );
            if (!guildFromDatabase?.guildId === guildId){
                const guildFetchedFromDiscord = await client.guilds.fetch( guildId );
                await createGuild( guildFetchedFromDiscord );
            }

            const numTacosSentByAuthorInLastDay = (await getTacosSentInLastDay(author.id)).length;

            log.info( numTacosSentByAuthorInLastDay, ' <= ', DAILY_TACO_LIMIT_PER_USER)
            const usersFromDatabase = await Promise.all( userIdList.map( async userId => await getUser( userId )));
            log.debug('Users from DB:', usersFromDatabase.map( u => u?.userId));
            const usersFetchedFromDiscord = await Promise.all( 
                userIdList.filter(userId => !usersFromDatabase.filter(Boolean).map( user => user.userId ).includes(userId))
                .map( async userId => await client.users.fetch( userId )));
            
            usersFetchedFromDiscord.forEach( async user => await createUser( user ));
            
            const users = [...usersFromDatabase.filter(Boolean), ...usersFetchedFromDiscord.filter(Boolean)];
            log.debug( users );

            users.forEach( user => {
                saveTaco( message, user);
                log.info( `>> ${author.username}#${user.discriminator} gave a taco to ${user.username}#${user.discriminator}` );
            });
   
                // author.send(`Aww crap, you exceeded the maximum taco limit today (${DAILY_TACO_LIMIT_PER_USER}).\n
                //             New (fresh) tacos will be arriving shortly, thank you for patience.`);   
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