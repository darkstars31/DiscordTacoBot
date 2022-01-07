import { log } from './logger.js';

export const getUserIdsFromContent = ( msg ) => {
    const { content } = msg;
    const regex = /(?<=\<)(.*?)(?=\>)/
    const userIds = content.split(regex).filter( user => user.charAt(0) == '@');
    log.info( `User Id List:`,  userIds )
    return userIds.map( userId => userId.substring(2));
}