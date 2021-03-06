import { getUserIdsFromContent, parseNumTacosFromMessage } from '../utils/messageParser.js';
import { saveTaco, getTacosSentInLastDay } from '../dao/tacoDao.js';
import { createUser } from '../dao/userDao.js';
import { saveViolation, getViolationsRowId } from '../dao/violationDao.js';
import { createGuild, getGuild } from "../dao/guildDao.js";
import { getCachedUser, putCachedUser } from './cache.js';
import { log } from '../utils/logger.js';

const DAILY_TACO_LIMIT_PER_USER = 99;

export async function captureSentTacos( client, message ) {
    const { author, content, guildId } = message;
        if( content.includes('@') && content.includes('🌮')){
            const userIdList = getUserIdsFromContent( message );
            const tacoCount = parseNumTacosFromMessage( message );
            const numTacosSentByAuthorInLastDay = (await getTacosSentInLastDay(author.id)).length;
            
            if( await selfGratificationViolation( author, userIdList)
            || outOfTacosViolation( author, numTacosSentByAuthorInLastDay )
            || moreTacosThanUserHasLeftViolation( author, tacoCount, numTacosSentByAuthorInLastDay)
            ) {
                return;
            }

            const authorFromCache = await getCachedUser( author.id );
            if( !authorFromCache ){
                putCachedUser( author );
                await createUser( author );
            }

            const guildFromDatabase = await getGuild( guildId );
            if (!guildFromDatabase){
                const guildFetchedFromDiscord = await client.guilds.fetch( guildId );
                await createGuild( guildFetchedFromDiscord );
            }

            const usersFromCache = userIdList.map( userId => getCachedUser( userId )).filter(Boolean);
            log.info('x', usersFromCache );
            const usersFetchedFromDiscord = await Promise.all( 
                userIdList.filter(userId => !usersFromCache.map( user => user.id ).includes(userId))
                .map( async userId => await client.users.fetch( userId )));
            
            usersFetchedFromDiscord.forEach( async user => {
                putCachedUser( user );
                await createUser( user );
            });
            
            const users = [...usersFromCache, ...usersFetchedFromDiscord.filter(Boolean)];
            
            [...Array(tacoCount)].map( () => {
                users.forEach(async user => {
                    await saveTaco( message, user.id );
                });
            });
            users.forEach( user => {
                client.users.cache.get(user.id).send(`You have received taco(s) from ${author.username}`);
                log.info( `>> ${author.username}#${author.discriminator} gave ${tacoCount} taco(s) to ${user.username}#${user.discriminator}` );
            });
        }
}

const selfGratificationViolation = async ( author, userIdList) => {
    if(userIdList.includes(author.id)){
        saveViolation(author.id);
        const violationCount = await getViolationsRowId();
        log.debug( violationCount);
        log.info(`User ${author.username} tried to give tacos to themselves, #${violationCount.id} silly users.`);
        author.send(`VIOLATION: You cannot give yourself tacos.\nThis incident will be reported to the authorities, your case number for this offense is #${violationCount.id}.`);
        return true;
    }
    return false;
}

const outOfTacosViolation = ( author, numTacosSentByAuthorInLastDay ) => {
    log.debug(`${author.username}#${author.discriminator} ${numTacosSentByAuthorInLastDay} == ${DAILY_TACO_LIMIT_PER_USER}`);
    if( numTacosSentByAuthorInLastDay == DAILY_TACO_LIMIT_PER_USER ){
        author.send(`Aww mang, you exceeded the maximum taco limit today (${DAILY_TACO_LIMIT_PER_USER}).
                 Fresh tacos will be arriving tomorrow, thank you for patience.`); 
        return true;
    }
    return false;
}

const moreTacosThanUserHasLeftViolation = ( author, tacoCount, numTacosSentByAuthorInLastDay) => {
    if ( tacoCount + numTacosSentByAuthorInLastDay > DAILY_TACO_LIMIT_PER_USER ){
        author.send(`You attempted to send more tacos (${tacoCount}) than you have left today. 
                    Remaining tacos: ${DAILY_TACO_LIMIT_PER_USER - numTacosSentByAuthorInLastDay}`); 
        return true;
    }
    return false;
}