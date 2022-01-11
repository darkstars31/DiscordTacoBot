import { captureSentTacos } from "./service/tacoProcessor.js";
import { helpCommand, topTacosCommand, myTacosCommand } from "./service/commandProcessor.js";
import { log } from "./utils/logger.js";

/* eslint-disable no-unused-vars */
export function eventInitialization( client ) {

	log.info("Events Initialized");

	client.on('messageCreate', async (msg) => {
        captureSentTacos( client, msg );
    });
    
    client.on('interactionCreate', async interaction => {
        if (!interaction.isCommand()) return;

        const { commandName } = interaction;

        switch( commandName ) {
            case "toptacos": topTacosCommand(interaction); break;
            case "mytacos": myTacosCommand(interaction); break;
            case "tacohelp": helpCommand(interaction); break;
            default:
                await interaction.reply("That command hasn't been setup on your server.");
        }
    });
}