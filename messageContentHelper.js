const getUserIdsFromContent = ( msg ) => {
    const { content } = msg;
    userIds = content.split('@').filter( user => user.charAt(0) == '!');
    console.debug( `users:`,  userIds )
    return userIds;
}

exports.getUserIdsFromContent = getUserIdsFromContent;