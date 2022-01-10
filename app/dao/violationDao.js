import { dbContext } from './dbContext.js';

export async function getViolationsRowId () {
	const sql = `SELECT id 
                FROM violations
                ORDER BY id DESC LIMIT 1`;
	const db = await dbContext();
	return db.get(sql);
}

export async function getSelfTacoViolations ( userId ) {
	const sql = `SELECT COUNT(userId)
	            FROM violations 
                WHERE userId = ${userId}`;
	const db = await dbContext();
	return db.all(sql, {}, (err) => {if (err) { throw err; }});
}

export async function saveViolation ( userId ) {
	const sql = `INSERT INTO violations ( userId )
	            VALUES ( ? )`;
	const db = await dbContext();
	return db.run(sql, [ userId ], err => console.error( err ));
}