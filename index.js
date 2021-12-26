const dotenv = require('dotenv');
const { Client, Intents } = require('discord.js');

dotenv.config();

const client = new Client({ intents: [Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MESSAGES] });


// When the client is ready, run this code (only once)
client.once('ready', ( c ) => {
	console.log(`Ready! Logged in as ${c.user.tag}`);
});

client.on('messageCreate', async (msg) => {
    console.log( `${msg.author.username}: ${msg.content}` );
    if( msg.content.includes('@') && msg.content.includes('🌮')){
        userIds = msg.content.split('@').filter( user => user.charAt(0) == '!');
        console.log( "Found a Taco" );
        console.log( userIds );
        for( let userId in userIds) {
            let user = await client.user.fetch( userId );
            console.log(user.id, user.username, user.discriminator);
        }
    }
})

// Login to Discord with your client's token
client.login(process.env.DISCORD_TOKEN);