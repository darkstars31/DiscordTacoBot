import { dbContext } from './dbContext.js';

export const getUser = async ( id ) => {
    const db = await dbContext();
    return db.get(`SELECT * from users WHERE userId = ?`, id);
}

export const createUser = async ( user ) => {
    const sql = `INSERT INTO users
        ( userId, username, discriminator, metadata, guildId) 
        VALUES (?,?,?,?,?)`;

    const db = await dbContext();
    return db.run(sql, [user.id,user.username,user.discriminator,JSON.stringify(user), null]);
}