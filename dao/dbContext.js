var sqlite3 = require('sqlite3').verbose();
const { open } = require('sqlite');

async function openDb() { 
    return await open({
        filename: 'db/database.db',
        driver: sqlite3.Database,
    }); //new sqlite3.Database('db/database.db');
}

exports.openDb = openDb;