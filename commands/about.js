const Discord = require('discord.js');
const { colors } = require('../utils/config.json');
const { version, dependencies } = require('../package.json')

module.exports = {
	name: 'about',
	description: 'Present bot info',
	aliases: [],
	guildOnly: false,
	args: false,
	argList: [],
	usage: '',
	execute: async (message, args, client) => {
		const aboutEmbed = new Discord.MessageEmbed()
			.setTitle('**About Me!**')
			.setDescription(`🧑 Created by thatpaple#9995
						   \n🤖 Version ${version}
						   \n📚 Discord JS : ${dependencies['discord.js']}`)
			.setColor(colors.default)
		return message.channel.send({ embeds: [aboutEmbed] });

	},
};