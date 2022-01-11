import { bold, italic, strikethrough, underscore, spoiler, quote, blockQuote } from '@discordjs/builders';
import { getGuildLeaderBoard, getTacosSentInLastDay, getTacoHistory } from "../dao/tacoDao.js";
import { log } from '../utils/logger.js';

export const topTacosCommand = async ( interaction ) => {
    const leaderboard = await getGuildLeaderBoard(interaction.guildId);
    const formattedLeaderboard = leaderboard.map( (leader, i) => `${i+1}. ${leader.username.substring(0,17).padEnd(20, ' ')} ${String(leader.count).padStart(16, ' ')}\n\t`);
    await interaction.reply(`
    The ${bold("Top 10")} Taco Masters of ${leaderboard.map( l => l.guildName)}
    ${bold("User")}                                     ${bold("Tacos")}
    ${formattedLeaderboard.join('')}
    `);
}

export const myTacosCommand = async ( interaction ) => {
    const myRecentTacoHistory = await getTacoHistory( interaction.user.id);
    const formattedHistory = myRecentTacoHistory.map( item => `${item.username} - ${item.datetime}\n\t`);
    log.debug( myRecentTacoHistory );
    await interaction.reply(`
        ${formattedHistory.join('')}
    `);
}

export const helpCommand = async ( interaction ) => {
    await interaction.reply(`${bold("TacoBot Help & About")}
            ############################
            ${bold("What is TacoBot?")}
            TacoBot is a gratitude sharing platform. Think Reddit silver or gold but instead give your friends tacos. TacoBot uses a fictional emoji currency (the taco emoji 🌮) that you can use to show your gratitude to other community members. The supply of tacos is limited to 4 tacos daily, so share wisely.
            
            ${bold("How do I send tacos?")}
            Sending tacos is easy. Just send a message in a text channel that includes those individual's names (ex. '@tacobot) and include the number of tacos (🌮) you wish to send them.

            ${bold("The Gameification of Gratitude")}
            Compete with your fellow community members, view your servers "/toptacos" to see who has the most tacos.

            ${bold("Commands")}
            toptacos - Displays the servers taco leaders
            mytacos - Displays my tacos
            tacohelp - Shows this help context window
            `);
}