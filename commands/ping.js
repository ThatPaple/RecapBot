module.exports = {
	name: 'ping',
	description: 'Ping command',
	aliases: [],
	guildOnly: false,
	args: false,
	argList: [],
	usage: '',
	execute: async (message, args, client) => {
			const m = await message.channel.send("Ping?");
			m.edit(`Pong! System latency is ${m.createdTimestamp - message.createdTimestamp}ms.`);
	},
};