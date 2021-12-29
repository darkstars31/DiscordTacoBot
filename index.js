const dotenv = require('dotenv');
const { Client, Intents } = require('discord.js');

const ContentHelper = require('./messageContentHelper.js');
const Dao = require('./dao/dao.js');


dotenv.config();
//const environment = process.env.environment;
const DAILY_TACO_LIMIT_PER_USER = 3;
const client = new Client({ intents: [Intents.FLAGS.GUILDS,Intents.FLAGS.GUILD_MESSAGES] });


// When the client is ready, run this code (only once)
client.once('ready', ( c ) => {
	console.log(`Ready! Logged in as ${c.user.tag}`);
});

client.on('messageCreate', async (msg) => {
	const { author, content } = msg;
	if( content.includes('@') && content.includes('🌮')){
		const numTacosSentByAuthorInLastDay = Dao.tacosSentInLastDay(author.id);
		const userIdList = ContentHelper.getUserIdsFromContent( msg );
		const usersList = [];

		if(userIdList.includes(author.id)) {
            Dao.saveViolation(author.id);
            Dao.getViolationsRowId( ( violationCount ) => {
                console.log(`User ${author.username} tried to give tacos to themselves, #${violationCount.id} silly users.`);
                author.send(`VIOLATION: You cannot give yourself tacos.\nThis incident will be reported to the authorities, your case number for this offense is #${violationCount.id}.`);
            });
		    return;
		}
		
		if( numTacosSentByAuthorInLastDay <= DAILY_TACO_LIMIT_PER_USER ) {
			for( const userId of userIdList ) {
				const remainingTacos = DAILY_TACO_LIMIT_PER_USER - numTacosSentByAuthorInLastDay;
				if (remainingTacos > 0){
					let user = await client.users.fetch( userId ).catch( e => console.error( e ));
					if ( user ) {
						usersList.push(user);
						console.log( `>> ${author.username}#${user.discriminator} gave a taco to ${user.username}#${user.discriminator}` );
						Dao.saveTaco( msg, user);
					}
					remainingTacos--;
				} else {
					author.send(`Aw crap, you exceeded the maximum taco limit today (${DAILY_TACO_LIMIT_PER_USER}).\n
                        New (fresh) tacos will be arriving shortly, thank you for patience.`);
				}
			}
		} else {
			author.send(`Aw crap, you exceeded the maximum taco limit today (${DAILY_TACO_LIMIT_PER_USER}).\n
                        New (fresh) tacos will be arriving shortly, thank you for patience.`);
		}
	}
});

client.on('interactionCreate', async interaction => {
    console.log( interaction );
	if (!interaction.isCommand()) return;

	const { commandName } = interaction;

	if (commandName === 'ping') {
		await interaction.reply('Pong!');
	} else if (commandName === 'server') {
		await interaction.reply('Server info.');
	} else if (commandName === 'user') {
		await interaction.reply('User info.');
	}
});

// Login to Discord with your client's token
// eslint-disable-next-line no-undef
client.login(process.env.DISCORD_TOKEN);