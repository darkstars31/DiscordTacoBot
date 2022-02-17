import { dbContext } from './dbContext.js';

const db = await dbContext();

export const getUsers = async () => {
    return db.all(`SELECT * FROM users`);
}

export const getUser = async ( id ) => {
    return db.get(`SELECT * FROM users WHERE userId = ?`, id);
}

export const createUser = async ( user ) => {
    const sql = `INSERT INTO users
        ( userId, metadata, guildId) 
        VALUES (?,?,?)`;

    return db.run(sql, [user.id, JSON.stringify(user), null]);
}