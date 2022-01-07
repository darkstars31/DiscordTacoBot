import { dbContext } from './dbContext.js';

export async function getTacosSentInLastDay ( userId ) {
	const sql = `SELECT * from tacos 
    where senderId = ${userId} 
    AND datetime >= datetime('now','-1 day')`;

	const db = await dbContext();
	return db.all(sql, {}, (err, rows) =>{
		if (err) { throw err; }
		return rows.length;
	} );
}

export async function getGuildLeaderBoard ( guildId, limit = 10) {
	const sql = `SELECT userReceived, COUNT(userReceived) 
    FROM tacos WHERE guildId = ${guildId} GROUP BY userReceived
	LIMIT ${limit}`;
	const db = await dbContext();
	return await db.all(sql, {}, (err, rows) => {
		if (err) { throw err; }
		return rows;
	});
}

export function getSelfTacoViolations ( userId ) {
	const sql = `SELECT COUNT(userId)
	FROM violations WHERE userId = ${userId}`;
	db.all(sql, {}, (err, rows) => {
		if (err) { throw err; }
		return rows;
	});
}

export async function getViolationsRowId ( callback ) {
	const sql = 'SELECT id FROM violations ORDER BY id DESC LIMIT 1';
	db.get(sql, {}, (err, row) => {
		if (err) { throw err; }
		callback( row );
	});
}

export function saveViolation ( userId ) {
	const sql = `INSERT INTO violations ( userId )
	VALUES ( ${userId} )`;
	db.run(sql, {}, err => console.error( err ));
}

export async function saveTaco ( msg, userRec ) {
	const { guildId, author } = msg;
	const sql =`INSERT INTO tacos (senderId, recipientId, guildId) 
    VALUES ('${author.id}',${userRec.id},${guildId})`;
	const db = await dbContext();
	db.run(sql, {}, err => console.error( err ));
}