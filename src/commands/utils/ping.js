const { Command, container, ExtendedArgument } = require('@sapphire/framework');
const pool = require('../../handlers/mysqlConnector');
const { MessageEmbed } = require('discord.js');
const prettyMilliseconds = require('pretty-ms');
const modlogger = require('../../handlers/modlogHandler');
const { ApplicationCommandLimits } = require('@sapphire/discord.js-utilities');

class PingCommand extends Command {
	constructor(context, options) {
		super(context, {
			...options,
			name: 'ping',
			aliases: [],
			description: 'Checks connections',
			preconditions: ['ModOnly'],
			flags: ['api', 'ping', 'database', 'uptime'],
			subCommands: [],
			man: [
				{
					subCommands: [],
					flags: [
						{
							name: 'api',
							description: 'Show only API connectivity',
							example: 'rc.ping --api'
						},
						{
							name: 'ping',
							description: 'Show only ping',
							example: 'rc.ping --ping'
						},
						{
							name: 'database',
							description: 'Show only database connectivity',
							example: 'rc.ping --database'
						},
						{
							name: 'uptime',
							description: 'Show only uptime',
							example: 'rc.ping --uptime'
						}
					]
				}
			]
		});
	}

	async messageRun(message, args) {
		const { client } = container;

		const isApiFlag = args.getFlags('api');
		const isPingFlag = args.getFlags('ping');
		const isDatabaseFlag = args.getFlags('database');
		const isUptimeFlag = args.getFlags('uptime');

		message.channel.send(':satellite::curly_loop::curly_loop::curly_loop::robot:').then((result_message) => {
			pool.getConnection(function (err, connection) {
				connection.ping(function (err) {
					connection.release();
					let connStat = err ? 'Non-operational' : 'Operational';

					const ping = result_message.createdTimestamp - message.createdTimestamp;
					result_message.delete();
					const pingEmbed = new MessageEmbed();
					pingEmbed.setTitle(`${client.user.username} Connections`);
					pingEmbed.setColor('BLURPLE');
					if (isApiFlag) pingEmbed.addField(`API Latency`, `\`${Math.round(client.ws.ping)} ms\``);
					if (isDatabaseFlag) pingEmbed.addField(`Database`, `\`${connStat}\``); 
					if (isPingFlag) pingEmbed.addField(`Ping`, `\`${ping} ms\``);
					if (isUptimeFlag) pingEmbed.addField(`Uptime`, `\`${prettyMilliseconds(client.uptime)}\``);
					if (!isApiFlag && !isDatabaseFlag && !isPingFlag && !isUptimeFlag) {
						pingEmbed.addField(`Ping`, `\`${ping} ms\``);
						pingEmbed.addField(`API Latency`, `\`${Math.round(client.ws.ping)} ms\``);
						pingEmbed.addField(`Database`, `\`${connStat}\``);
						pingEmbed.addField(`Uptime`, `\`${prettyMilliseconds(client.uptime)}\``);
					}
					pingEmbed.setTimestamp();
					return message.channel.send({ embeds: [pingEmbed] });
				});
			});
		});
	}
}

module.exports = {
	PingCommand
};
