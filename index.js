const dotenv = require('dotenv');
const { Client, Intents } = require('discord.js');
const sqlite3 = require('sqlite3').verbose();

const ContentHelper = require("./messageContentHelper.js");

var db = new sqlite3.Database(':memory:');
dotenv.config();

const client = new Client({ intents: [Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MESSAGES] });


// When the client is ready, run this code (only once)
client.once('ready', ( c ) => {
	console.log(`Ready! Logged in as ${c.user.tag}`);
});

client.on('messageCreate', async (msg) => {
    const { author, content } = msg;
    console.log( `${author.username}: ${content}` );
    if( content.includes('@') && content.includes('🌮')){
        userIds = ContentHelper.getUserIdsFromContent( msg );
        console.log(userIds);
        for( let userId in userIds) {
            let user = await client.user.fetch( userId );
            console.log( user );
            console.log( `Taco from ${author.username} to ${user.username}#${user.discriminator}` );
        }
    }
})

// Login to Discord with your client's token
client.login(process.env.DISCORD_TOKEN);