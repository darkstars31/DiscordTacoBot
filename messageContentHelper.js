const getUserIdsFromContent = ( msg ) => {
    const { content } = msg;
    const regex = /(?<=\<)(.*?)(?=\>)/
    userIds = content.split(regex).filter( user => user.charAt(0) == '@');
    console.debug( `User Id List:`,  userIds )
    return userIds.map( userId => userId.substring(2));
}

exports.getUserIdsFromContent = getUserIdsFromContent;