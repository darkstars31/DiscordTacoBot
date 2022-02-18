import { dbContext } from "./app/dao/dbContext.js";

( async () => {
	const db = await dbContext();
	db.getDatabaseInstance().serialize(function() {	
		db.run(`
			CREATE TABLE IF NOT EXISTS guilds (
			id INTEGER PRIMARY KEY,
			guildId TEXT NOT NULL,
			name TEXT NOT NULL,
			metadata TEXT NOT NULL,
			datetime TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
			UNIQUE( guildId )
			)
		`);
		db.run(`
			CREATE TABLE IF NOT EXISTS users (
				id INTEGER PRIMARY KEY,
				userId TEXT NOT NULL,
				metadata TEXT NOT NULL,
				guildId TEXT DEFAULT NULL,
				datetime TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
				FOREIGN KEY(guildId) REFERENCES guilds(guildId),
				UNIQUE( userId )
			);
		`);
		db.run(`
			CREATE TABLE IF NOT EXISTS violations (
				id INTEGER PRIMARY KEY,
				userId TEXT NOT NULL,
				datetime TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
				FOREIGN KEY(userId) REFERENCES users(userId)
			);
		`);
		db.run(`
			CREATE TABLE IF NOT EXISTS tacos (
				id INTEGER PRIMARY KEY,
				senderId TEXT NOT NULL,
				recipientId TEXT NOT NULL,
				guildId TEXT NOT NULL,
				datetime TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
				FOREIGN KEY(senderId) REFERENCES users(userId),
				FOREIGN KEY(recipientId) REFERENCES users(userId),
				FOREIGN KEY(guildId) REFERENCES guilds(guildId)
			);
		`);
});
	// db.run(`INSERT INTO tacos 
	// 	(userIdReceived, userReceived, userIdSent, userSent, guildId) 
	// 	VALUES
	// 	(777,'{ id: 777, username: "Timmy"}',888,'{ id: 888, username: "Cartman"}',37)`);
	db.close();
})();