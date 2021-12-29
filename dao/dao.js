const { openDb } = require('./dbContext.js');


async function getTacosSentInLastDay ( userId ) {
	const sql = `SELECT * from tacos 
    where userIdSent = ${userId} 
    AND datetime >= datetime('now','-1 day')`;

	const db = await openDb();
	return db.all(sql, {}, (err, rows) =>{
		if (err) { throw err; }
		return rows.length;
	} );
}

async function getGuildLeaderBoard ( guildId, limit = 10) {
	const sql = `SELECT userReceived, COUNT(userReceived) 
    FROM tacos WHERE guildId = ${guildId} GROUP BY userReceived
	LIMIT ${limit}`;
	const db = await openDb();
	return await db.all(sql, {}, (err, rows) => {
		if (err) { throw err; }
		return rows;
	});
}

function getSelfTacoViolations ( userId ) {
	const sql = `SELECT COUNT(userId)
	FROM violations WHERE userId = ${userId}`;
	db.all(sql, {}, (err, rows) => {
		if (err) { throw err; }
		return rows;
	});
}

async function getViolationsRowId ( callback ) {
	const sql = 'SELECT id FROM violations ORDER BY id DESC LIMIT 1';
	db.get(sql, {}, (err, row) => {
		if (err) { throw err; }
		callback( row );
	});
}

function saveViolation ( userId ) {
	const sql = `INSERT INTO violations ( userId )
	VALUES ( ${userId} )`;
	db.run(sql, {}, err => console.error( err ));
}

async function saveTaco ( msg, userRec ) {
	const { guildId, author } = msg;
	const userReceiveString = JSON.stringify(userRec);
	const authorString = JSON.stringify(author);
	const sql =`INSERT INTO tacos (userIdReceived, userReceived, userIdSent, userSent, guildId) 
    VALUES (${userRec.id},'${userReceiveString}',${author.id},'${authorString}',${guildId})`;
	const db = await openDb();
	db.run(sql, {}, err => console.error( err ));
}

exports.getTacosSentInLastDay = getTacosSentInLastDay;
exports.getGuildLeaderBoard = getGuildLeaderBoard;
exports.getSelfTacoViolations = getSelfTacoViolations;
exports.getViolationsRowId = getViolationsRowId;
exports.saveViolation = saveViolation;
exports.saveTaco = saveTaco;