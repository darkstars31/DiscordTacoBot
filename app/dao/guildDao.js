import { dbContext } from './dbContext.js';
import { log } from '../utils/logger.js';

const db = await dbContext();

export const getGuild = async ( id ) => {
    const sql =`SELECT * FROM guilds WHERE guildId = ?`;
	
	return db.get(sql, [ id ], err => log.error( err ));
}

export const createGuild = async ( guild ) => {
    const sql =`INSERT INTO guilds (guildId, name, metadata) 
    VALUES ( ?, ?, ?)`;

	return db.run(sql, [guild.id, guild.name,JSON.stringify(guild)], err => log.error( err ));
}