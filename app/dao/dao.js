import { dbContext } from './dbContext.js';

export async function getTacosSentInLastDay ( userId ) {
	const sql = `SELECT * from tacos 
    where senderId = ? 
    AND datetime >= datetime('now','-1 day')`;

	const db = await dbContext();
	return db.all(sql, [ userId ], err =>{if (err) { throw err; }} );
}

export async function getGuildLeaderBoard ( guildId, limit = 10) {
	const sql = `SELECT userReceived, COUNT(userReceived) 
    FROM tacos WHERE guildId = ? GROUP BY userReceived
	LIMIT ?`;
	const db = await dbContext();
	return await db.all(sql, [ guildId, limit ], err => {if (err) { throw err; }});
}

export async function saveTaco ( msg, recipientId ) {
	const { guildId, author } = msg;
	const sql =`INSERT INTO tacos (senderId, recipientId, guildId) 
    VALUES (?,?,?)`;
	const db = await dbContext();
	db.run(sql, [author.id, recipientId, guildId], err => console.error( err ));
}