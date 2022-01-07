import { dbContext } from './dbContext.js';

export async function getTacosSentInLastDay ( userId ) {
	const sql = `SELECT * from tacos 
    where senderId = ${userId} 
    AND datetime >= datetime('now','-1 day')`;

	const db = await dbContext();
	return db.all(sql, {}, err =>{if (err) { throw err; }} );
}

export async function getGuildLeaderBoard ( guildId, limit = 10) {
	const sql = `SELECT userReceived, COUNT(userReceived) 
    FROM tacos WHERE guildId = ${guildId} GROUP BY userReceived
	LIMIT ${limit}`;
	const db = await dbContext();
	return await db.all(sql, {}, err => {if (err) { throw err; }});
}

export async function saveTaco ( msg, userRec ) {
	const { guildId, author } = msg;
	const sql =`INSERT INTO tacos (senderId, recipientId, guildId) 
    VALUES ('${author.id}',${userRec.id},${guildId})`;
	const db = await dbContext();
	db.run(sql, {}, err => console.error( err ));
}