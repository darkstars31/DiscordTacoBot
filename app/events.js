import { captureSentTacos } from "./service/tacoProcessor.js";
import { getGuildLeaderBoard } from "./dao/tacoDao.js";
import { log } from "./utils/logger.js";

/* eslint-disable no-unused-vars */
export function eventInitialization( client ) {

	log.info("Events Initialized");

	client.on('messageCreate', async (msg) => {
        captureSentTacos( client, msg );
    });
    
    client.on('interactionCreate', async interaction => {
        //console.log( interaction );
        if (!interaction.isCommand()) return;
    
        const { commandName } = interaction;
    
        if (commandName === 'toptacos') {
            const leaderboard = await getGuildLeaderBoard(interaction.guildId);
            await interaction.reply(`The Top 10 Taco Masters of ${leaderboard.map( l => l.guildName)}
            User                            Tacos
            ${leaderboard.map( leader => `${leader.username.substring(0,13).padEnd(16, ' ')} ${String(leader.count).padStart(16, ' ')}\n\t\t\t`)}`);
        } else if (commandName === 'mytacos') {
            await interaction.reply('Server info.');
        } else if (commandName === 'tacohelp') {

        }
    });
}