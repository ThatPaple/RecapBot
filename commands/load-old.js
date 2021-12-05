const Discord = require('discord.js');
const { colors, permissionLevels } = require('../utils/config.json');
const { version, dependencies } = require('../package.json')

module.exports = {
	name: 'load-old',
	description: 'Loads old recap using message ID',
	aliases: [],
	guildOnly: false,
	args: false,
	argList: [],
	usage: '',
	execute: async (message, args, client) => {
		if (message.member.roles.cache.has(`${permissionLevels.testing}`)) {
			
		} else {
			message.reply("This command is still in developlent, you do not have required permission level to run this command.")
		}
	},
};