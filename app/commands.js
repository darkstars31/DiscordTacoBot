const dotenv = require('dotenv');
dotenv.config();
const { SlashCommandBuilder } = require('@discordjs/builders');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');

// eslint-disable-next-line no-loss-of-precision
const clientId = "923795803422752809";
const guildId = "87222941170831360";

const commands = [
	new SlashCommandBuilder().setName('toptacos').setDescription('Displays the TacoBot Top 10 for your server.'),
	new SlashCommandBuilder().setName('mytacos').setDescription('Displays your tacos received from your server.'),
	new SlashCommandBuilder().setName('tacohelp').setDescription('Shows the TacoBot help.'),

].map(command => command.toJSON());

const rest = new REST({ version: '9' }).setToken(process.env.DISCORD_TOKEN);

rest.put(Routes.applicationGuildCommands(clientId, guildId), { body: commands })
	.then(() => console.log('Successfully registered application commands.'))
	.catch(console.error);
