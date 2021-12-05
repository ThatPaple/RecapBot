const Discord = require('discord.js');
const { colors, permissionLevels } = require('../utils/config.json');
const { version, dependencies } = require('../package.json')

module.exports = {
	name: 'reload',
	description: 'Reloads the bot',
	aliases: [],
	guildOnly: false,
	args: false,
	argList: [],
	usage: '',
	execute: async (message, args, client) => {
		if (message.member.roles.cache.has(`${permissionLevels.testing}`)) {
			message.reply("This command is in testing. You do not have permission levels to run this command!")
		}
	},
};