import { dbContext } from './dbContext.js';

export async function getTacosSentInLastDay ( userId ) {
	const sql = `SELECT * from tacos 
    where senderId = ? 
    AND datetime >= datetime('now','-1 day')`;

	const db = await dbContext();
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