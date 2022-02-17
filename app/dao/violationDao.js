import { dbContext } from './dbContext.js';
const db = await dbContext();

export async function getViolationsRowId () {
	const sql = `SELECT id 
                FROM violations
                ORDER BY id DESC LIMIT 1`;

	return db.get(sql);
}

export async function getSelfTacoViolations ( userId ) {
	const sql = `SELECT COUNT(userId)
	            FROM violations 
                WHERE userId = ${userId}`;

	return db.all(sql, {}, (err) => {if (err) { throw err; }});
}

export async function saveViolation ( userId ) {
	const sql = `INSERT INTO violations ( userId )
	            VALUES ( ? )`;
				
	return db.run(sql, [ userId ], err => console.error( err ));
}