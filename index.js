const dotenv = require('dotenv');
const { Client, Intents } = require('discord.js');

const ContentHelper = require("./messageContentHelper.js");
const Dao = require("./dao.js");


dotenv.config();
const environment = process.env.environment;
const DAILY_TACO_LIMIT_PER_USER = 3;
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
        // if(userIdList.includes(author.id)) {
        //     console.log(`User ${author.username} tried to give tacos to themselves, silly user.`);
        //     author.send("VIOLATION: You cannot give yourself tacos.\nThis incident will be reported, your case number for this offense is #93247234");
        //     return;
        // }
        const usersList = [];
        const numTacosSentByAuthorInLastDay = Dao.tacosSentInLastDay(author.id);
        if( numTacosSentByAuthorInLastDay <= DAILY_TACO_LIMIT_PER_USER ) {
            for( const userId of userIdList) {
                let user = await client.users.fetch( userId ).catch( e => console.error( e ));
                if ( user ) {
                    usersList.push(user);
                    console.log( `Taco from ${author.username} to ${user.username}#${user.discriminator}` );
                    Dao.saveTaco( msg, user);
                }
            }
        } else {
            author.send(`Aw crap, you exceeded the maximum taco limit today (${DAILY_TACO_LIMIT_PER_USER}).\n
                        New (fresh) tacos will be arriving shortly, thank you for patience.`);
        }
    }
})

// Login to Discord with your client's token
client.login(process.env.DISCORD_TOKEN);