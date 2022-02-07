const Discord = require('discord.js');
const { colors, modlogChannelID, permissionLevels } = require('../utils/config.json');
const db = require('../handler/databaseHandler.js');

module.exports = {
	name: 'add',
	description: 'Add inquiry into todays recap.',
	aliases: [],
	guildOnly: false,
	args: false,
	argList: [],
	usage: '[input] [link]',
	execute: async (message, args, client) => {
		if (message.member.roles.cache.has(`${permissionLevels.moderator}`) || message.member.roles.cache.has(`${permissionLevels.testing}`)) {
			var link = "";
			var temp = "";
			if (message.type == "REPLY" && args.length > 0) {
				const msg = await message.channel.messages.fetch(message.reference.messageId)
				link = link + "> " + "<" + msg.url + ">" + "\n";
				for (i = 0; i <= args.length - 1; i++) {
					temp = temp + args[i] + " ";
				}
				db.addRecap(temp, link, 0, message)
			} else {
				for (i = 0; i <= args.length - 1; i++) {
					if (args[i].includes("https://") || args[i].includes("http://")) {
						link = link + "> " + "<" + args[i] + ">" + "\n";
					} else {
						temp = temp + args[i] + " ";
					}
				}
				db.addRecap(temp, link, 0, message)
			}
		
		}
	}
};