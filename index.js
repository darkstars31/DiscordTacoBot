import dotenv from 'dotenv';
import { Client, Intents } from 'discord.js';
import { eventInitialization } from './app/events.js';
import { log } from './app/utils/logger.js';


dotenv.config();
const client = new Client({ intents: [Intents.FLAGS.GUILDS,Intents.FLAGS.GUILD_MESSAGES] });

// When the client is ready, run this code (only once)
client.once('ready', ( c ) => {
	log.info(`Ready! Logged in as ${c.user.tag}`);
	eventInitialization( client );
});

// Login to Discord with your client's token
// eslint-disable-next-line no-undef
client.login(process.env.DISCORD_TOKEN);