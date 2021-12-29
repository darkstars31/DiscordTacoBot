const db = require("./dao/dbContext");

db.serialize(function() {
	db.run(`
		CREATE TABLE IF NOT EXISTS tacos (
			id INTEGER PRIMARY KEY,
			userIdReceived BIGINT NOT NULL,
			userReceived TEXT NOT NULL,
			userIdSent BIGINT NOT NULL,
			userSent TEXT NOT NULL,
			guildId BIGINT NOT NULL,
			datetime TIMESTAMP DEFAULT CURRENT_TIMESTAMP
		);`);

	db.run(`
		CREATE TABLE IF NOT EXISTS violations (
			id INTEGER PRIMARY KEY,
			userId BIGINT NOT NULL,
			datetime TIMESTAMP DEFAULT CURRENT_TIMESTAMP
		);
	`);

	// db.run(`INSERT INTO tacos 
	// 	(userIdReceived, userReceived, userIdSent, userSent, guildId) 
	// 	VALUES
	// 	(777,'{ id: 777, username: "Timmy"}',888,'{ id: 888, username: "Cartman"}',37)`);
  
});
  
db.close();