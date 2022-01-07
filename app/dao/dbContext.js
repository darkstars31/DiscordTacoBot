import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

sqlite3.verbose();

export const dbContext = async () => { 
    const db = await open({
        filename: 'db/database.db',
        driver: sqlite3.Database,
    });
    db.get("PRAGMA foreign_keys = ON")
    return db;
};