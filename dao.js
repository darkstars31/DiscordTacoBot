var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('database.db');

function tacosSentInLastDay ( userId ) {
    return db.all(`SELECT * from tacos 
        where userIdSent = ${userId} 
        AND datetime >= datetime('now','-1 day')`);
}

function saveTaco ( msg, userRec ) {
    const { guildId, author, content } = msg;
    const sql =`INSERT INTO tacos
    (userIdReceived, userReceived, userIdSent, userSent, guildId) 
    VALUES (${userRec.id},${JSON.stringify(userRec)},${author.userId},${JSON.stringify(author)},${guildId})`;
    
    console.log( JSON.stringify(userRec));
    
    db.run(sql, null, err => console.error( err ));
}

exports.tacosSentInLastDay = tacosSentInLastDay;
exports.saveTaco = saveTaco;