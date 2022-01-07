import { captureSentTacos } from "./service/tacoProcessor.js";
import { log } from "./utils/logger.js";

/* eslint-disable no-unused-vars */
export function eventInitialization( client ) {

	log.info("Events Initialized");

	client.on('messageCreate', async (msg) => {
        captureSentTacos( client, msg );
    });
    
    client.on('interactionCreate', async interaction => {
        console.log( interaction );
        if (!interaction.isCommand()) return;
    
        const { commandName } = interaction;
    
        if (commandName === 'toptacos') {
            const leaderboard = await Dao.getGuildLeaderBoard(interaction.guildId);
            console.log(leaderboard);
            await interaction.reply('Pong!');
        } else if (commandName === 'mytacos') {
            await interaction.reply('Server info.');
        }
    });
}