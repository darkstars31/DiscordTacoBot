var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database(':memory:');

db.serialize(function() {
    db.run(`
        CREATE TABLE tacos (
            id INTEGER PRIMARY KEY,
            userIdRecieved INTEGER NOT NULL,
            usernameRecieved TEXT NOT NULL,
            userIdSent INTEGER NOT NULL,
            usernameSent TEXT NOT NULL,
            guild TEXT NOT NULL,
            guildId INTEGER NOT NULL,
            datetime TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );`);
  
  });
  
  db.close();