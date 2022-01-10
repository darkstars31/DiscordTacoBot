import { getUserIdsFromContent, parseNumTacosFromMessage } from '../utils/messageParser.js';
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
            const tacoCount = parseNumTacosFromMessage( message );
            const numTacosSentByAuthorInLastDay = (await getTacosSentInLastDay(author.id)).length;

            const authorFromDatabase = await getUser( author.id );
            if( !authorFromDatabase ){
                await createUser( author );
            }
    
            if( await selfGratificationViolation( author, userIdList)
            || outOfTacosViolation( author, numTacosSentByAuthorInLastDay )
            || moreTacosThanUserHasLeftViolation( author, tacoCount, numTacosSentByAuthorInLastDay) ) {
                return;
            }

            //log.debug('message.mentions', message.mentions);
            const guildFromDatabase = await getGuild( guildId );
            if (!guildFromDatabase){
                const guildFetchedFromDiscord = await client.guilds.fetch( guildId );
                await createGuild( guildFetchedFromDiscord );
            }

            const usersFromDatabase = await Promise.all( userIdList.map( async userId => await getUser( userId )));
            const usersFetchedFromDiscord = await Promise.all( 
                userIdList.filter(userId => !usersFromDatabase.filter(Boolean).map( user => user.userId ).includes(userId))
                .map( async userId => await client.users.fetch( userId )));
            
            usersFetchedFromDiscord.forEach( async user => await createUser( user ));
            
            const users = [...usersFromDatabase.filter(Boolean), ...usersFetchedFromDiscord.filter(Boolean)];
            
            [...Array(tacoCount)].map( () => {
                users.forEach(async user => {
                    await saveTaco( message, user?.userId || user.id );
                });
            });
            users.forEach( user => {
                log.info( `>> ${author.username}#${author.discriminator} gave ${tacoCount} taco(s) to ${user.username}#${user.discriminator}` );
            });
        }
}

const selfGratificationViolation = async ( author, userIdList) => {
    if(userIdList.includes(author.id)){
        saveViolation(author.id);
        const violationCount = await getViolationsRowId();
        log.info(`User ${author.username} tried to give tacos to themselves, #${violationCount.id} silly users.`);
        author.send(`VIOLATION: You cannot give yourself tacos.\nThis incident will be reported to the authorities, your case number for this offense is #${violationCount.id}.`);
        return true;
    }
    return false;
}

const outOfTacosViolation = async ( author, numTacosSentByAuthorInLastDay ) => {
    log.info(`${author.username}#${author.discriminator} ${numTacosSentByAuthorInLastDay} <= ${DAILY_TACO_LIMIT_PER_USER}`);
    if( numTacosSentByAuthorInLastDay <= DAILY_TACO_LIMIT_PER_USER ){
        return false;
    }
    author.send(`Aww mang, you exceeded the maximum taco limit today (${DAILY_TACO_LIMIT_PER_USER}).
                 Fresh tacos will be arriving tomorrow, thank you for patience.`); 
    return true;
}

const moreTacosThanUserHasLeftViolation = async ( author, tacoCount, numTacosSentByAuthorInLastDay) => {
    if ( tacoCount + numTacosSentByAuthorInLastDay > DAILY_TACO_LIMIT_PER_USER ){
        author.send(`You attempted to send more tacos (${tacoCount}) than you have left today. 
                    Remaining tacos: ${DAILY_TACO_LIMIT_PER_USER - numTacosSentByAuthorInLastDay}`); 
        return true;
    }
    return false;
}