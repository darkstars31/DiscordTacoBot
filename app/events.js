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
        console.log( interaction );
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
            await interaction.reply(`TacoBot Help
            ############################
            What is TacoBot?
            TacoBot is a gratitude sharing platform. Think Reddit silver or gold but instead give your friends tacos. TacoBot uses a fictional emoji currency (the taco emoji 🌮 - :taco:) that you can use to show your gratitude to other community members. The supply of tacos is limited to 4 tacos daily, so share wisely.
            
            How do I send tacos?
            Sending tacos is easy. Just send a message in a text channel that includes those individual's names (ex. '@tacobot) and include the number of tacos (🌮) you wish to send them.

            The Gameification of Gratitude
            Compete with your fellow community members, view your servers "/toptacos" to see who has the most tacos.

            Commands
            toptacos - Displays the servers taco leaders
            mytacos - Displays my tacos
            tacohelp - Shows this help context window
            `);
        }
    });
}