import { dbContext } from './dbContext.js';
import { log } from '../utils/logger.js';

export const getGuild = async ( id ) => {
    const sql =`SELECT * FROM guilds WHERE guildId = ?`;
	const db = await dbContext();
	return db.get(sql, [ id ], err => log.error( err ));
}

export const createGuild = async ( guild ) => {
    const sql =`INSERT INTO guilds (guildId, name, metadata) 
    VALUES ( ?, ?, ?)`;
	const db = await dbContext();
	return db.run(sql, [guild.id, guild.name,JSON.stringify(guild)], err => log.error( err ));
}