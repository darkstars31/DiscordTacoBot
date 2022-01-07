import { dbContext } from './dbContext.js';

export const getUser = async ( id ) => {
    const db = await dbContext();
    return db.get(`SELECT * from users WHERE userId = ${id}`);
}

export const createUser = async ( user ) => {
    const sql = `INSERT INTO user 
        ( userId, username, tag, metadata, guildId) 
        VALUES 
        (${user.id}, '${user.username}', '${user.tag}', '${JSON.stringify(user)}')`;

    const db = await dbContext();
    return db.run(`SELECT * from users WHERE userId = ${id}`);
}