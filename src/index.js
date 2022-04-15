const { SapphireClient } = require('@sapphire/framework');
const { token, prefix } = require('../config.json');
const client = new SapphireClient({
	intents: ['GUILDS', 'GUILD_MESSAGES'],
	defaultPrefix: [prefix, "r.", 'm.'],
	caseInsensitiveCommands: true,
	loadMessageCommandListeners: true,
    typing: false
});
client.login(token);
