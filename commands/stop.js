const Discord = require('discord.js');
const { colors, permissionLevels } = require('../utils/config.json');
const { version, dependencies } = require('../package.json');

module.exports = {
	name: 'stop',
	description: 'Stops the bot',
	aliases: [],
	guildOnly: false,
	args: false,
	argList: [],
	usage: '',
	execute: async (message, args, client) => {
		if (message.member.roles.cache.has(`${permissionLevels.testing}`) || message.member.roles.cache.has(`${permissionLevels.owner}`) || message.member.roles.cache.has(`${permissionLevels.botManagement}`)) {
			client.destroy();
		}
	},
};