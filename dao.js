var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('database.db');

function tacosSentInLastDay ( userId ) {
    const sql = `SELECT * from tacos 
    where userIdSent = ${userId} 
    AND datetime >= datetime('now','-1 day')`;

    db.all(sql, {}, (err, rows) =>{
        if (err) { throw err; }

        rows.forEach((row) => {
            console.log(row);
        });
        console.log('Count:', rows.length);
        return rows.length;
    } );
}

function saveTaco ( msg, userRec ) {
    const { guildId, author, content } = msg;
    const userReceiveString = JSON.stringify(userRec);
    const authorString = JSON.stringify(author);
    console.log(userReceiveString);
    const sql =`INSERT INTO tacos
    (userIdReceived, userReceived, userIdSent, userSent, guildId) 
    VALUES (${userRec.id},'${userReceiveString}',${author.id},'${authorString}',${guildId})`;

    db.run(sql, {}, err => console.error( err ));
}

exports.tacosSentInLastDay = tacosSentInLastDay;
exports.saveTaco = saveTaco;