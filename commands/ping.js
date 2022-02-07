const { colors, permissionLevels } = require('../utils/config.json');
const db = require('../handler/databaseHandler.js');
const { MessageEmbed } = require('discord.js')
const pool = require('../handler/mysqlConnector')
const prettyMilliseconds = require('pretty-ms');

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
			message.channel.send(':satellite::curly_loop::curly_loop::curly_loop::robot:').then(result_message => {
				pool.getConnection(function (err, connection) {
					connection.ping(function (err) {
						connection.release();
						let connStat = "none"
						if (err) {
							connStat = "Non-operational"
						} else {
							connStat = "Operational"
						}
						const ping = result_message.createdTimestamp - message.createdTimestamp;
						result_message.delete()
						const latencies = new MessageEmbed()
							.setTitle(`${client.user.username} Connections`)
							.setColor('BLURPLE')
							.addField(`Ping`, `\`${ping} ms\``)
							.addField(`API Latency`, `\`${Math.round(client.ws.ping)} ms\``)
							.addField(`Database`, `\`${connStat}\``)
							.addField(`Uptime`, `\`${prettyMilliseconds(client.uptime)}\``)
							.setTimestamp()
						message.channel.send({ embeds: [latencies] });
					});
				})
			})
		}
	},
};