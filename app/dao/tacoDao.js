import { dbContext } from './dbContext.js';

const db = await dbContext();

export async function getTacosSentInLastDay ( userId ) {
	const sql = `SELECT * FROM tacos 
    WHERE senderId = ? 
    AND datetime >= datetime('now','-1 day')`;

	return db.all(sql, [ userId ], err =>{if (err) { throw err; }} );
}

export async function getTacoHistory ( userId ) {
	const sql = `SELECT tacos.senderId, users.username, tacos.datetime
	FROM tacos
	JOIN users on users.userId = tacos.senderId
    where tacos.recipientId = ? 
    AND tacos.datetime >= datetime('now','-1 month')`;

	return db.all(sql, [ userId ], err =>{if (err) { throw err; }} );
}

export async function getGuildLeaderBoard ( guildId, limit = 10) {
	const sql = `SELECT recipientId, users.username, guilds.name as guildName, COUNT() as 'count'
    FROM tacos
	JOIN users on recipientId = users.userId
	JOIN guilds on guilds.guildId = tacos.guildId
	WHERE tacos.guildId = ? GROUP BY recipientId
	ORDER BY count DESC
	LIMIT ?`;

	return await db.all(sql, [ guildId, limit ], err => {if (err) { throw err; }});
}

export async function saveTaco ( msg, recipientId ) {
	const { guildId, author } = msg;
	const sql =`INSERT INTO tacos (senderId, recipientId, guildId) 
    VALUES (?,?,?)`;

	db.run(sql, [author.id, recipientId, guildId], err => console.error( err ));
}