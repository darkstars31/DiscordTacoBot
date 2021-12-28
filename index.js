const dotenv = require('dotenv');
const { Client, Intents } = require('discord.js');

const ContentHelper = require("./messageContentHelper.js");
const Dao = require("./dao.js");


dotenv.config();
const environment = process.env.environment;
const client = new Client({ intents: [Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MESSAGES] });


// When the client is ready, run this code (only once)
client.once('ready', ( c ) => {
	console.log(`Ready! Logged in as ${c.user.tag}`);
});

client.on('messageCreate', async (msg) => {
    const { guildId, channelId, author, mentions, content } = msg;
    console.log( msg );
    console.log( `${author.username}: ${content}` );
    if( content.includes('@') && content.includes('🌮')){
        userIdList = ContentHelper.getUserIdsFromContent( msg );
        const usersList = [];
        for( const userId of userIdList) {
            let user = await client.users.fetch( userId ).catch( e => console.error( e ));
            if ( user ) {
                usersList.push(user);
                //console.log( user );
                console.log( `Taco from ${author.username} to ${user.username}#${user.discriminator}` );
                Dao.saveTaco( msg, user);
            }
        }
    }
})

// Login to Discord with your client's token
client.login(process.env.DISCORD_TOKEN);