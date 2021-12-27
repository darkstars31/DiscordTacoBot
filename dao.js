var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database(':memory:');

function tacosSentInLastDay ( userId ) {
    return db.all(`SELECT * from tacos 
        where userIdSent = ${userId} 
        AND datetime >= datetime('now','-1 day')`);
}

function saveTaco ( msg, userIdRec, userRec ) {
    const { author, content } = msg;
    return db.run(`INSERT INTO taco 
        (userIdRecieved, usernameRecieved, userIdSent, usernameSent, guild, guildId) 
        VALUES
        (${userIdRec},${userRec},${author.userId}, ${author.username})`)
}

exports.tacosSentInLastDay = tacosSentInLastDay;
exports.saveTaco = saveTaco;