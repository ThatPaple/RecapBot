const { colors, permissionLevels } = require('../utils/config.json');

module.exports = {
	name: 'ping',
	description: 'Ping command',
	aliases: [],
	guildOnly: false,
	args: false,
	argList: [],
	usage: '',
	execute: async (message, args, client) => {
		if (message.member.roles.cache.has(`${permissionLevels.moderator}`) || message.member.roles.cache.has(`${permissionLevels.testing}`)) {
			const m = await message.channel.send(":satellite::curly_loop::curly_loop::curly_loop::robot:");
			m.edit(`Pong! System latency is ${m.createdTimestamp - message.createdTimestamp}ms.`);
		}
	},
};