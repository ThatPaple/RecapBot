const { Command, container } = require('@sapphire/framework');
const pool = require('../../handlers/mysqlConnector');
const { MessageEmbed } = require('discord.js');
const prettyMilliseconds = require('pretty-ms');
const modlogger = require('../../handlers/modlogHandler');

class HelpCommand extends Command {
	constructor(context, options) {
		super(context, {
			...options,
			name: 'help',
			aliases: [],
			preconditions: ['ModOnly'],
			description: 'Help page!',
			flags: ['flags', 'subcommands'],
			subCommands: [],
			man: [
				{
					subCommands: [],
					flags: [
						{
							name: 'flags',
							description: 'Presents flag manual of a specific command',
							example: 'rc.help recap --flags'
						},
						{
							name: 'subcommands',
							description: 'Presents subcommands manual of a specific command',
							example: 'rc.help recap --subcommands'
						}
					]
				}
			]
		});
	}

	async messageRun(message, args) {
		const { client } = this.container;
		const isFlagsFlag = args.getFlags('flags');
		const isSubcommandsFlag = args.getFlags('subcommands');

		let commandsList = [...this.container.stores.get('commands').keys()];

		let comm = await args.pick('string').catch(() => null);

		if (commandsList.includes(comm)) {
			let commandDetails = this.container.stores.get('commands').get(comm);
			let commandOptions = this.container.stores.get('commands').get(comm).options;

			let commandsEmbed = new MessageEmbed();
			commandsEmbed.setTitle(`${container.stores.get('commands').get(comm).name} -  Help Page`);
			commandsEmbed.setColor('BLURPLE');
			commandsEmbed.addFields(
				{ name: 'Name :', value: `${commandDetails.name}`, inline: true },
				{ name: 'Category :', value: `${commandDetails.category}`, inline: true },
				{ name: 'Description :', value: `${commandDetails.description}`, inline: true },
				{ name: 'Aliases :', value: `${commandDetails.aliases.length > 0 ? commandDetails.aliases.toString() : 'None'}`, inline: true },
				{
					name: 'Flags :',
					value: `${commandOptions.flags.length > 0 ? commandOptions.flags.toString().replaceAll(',', '\n') : 'None'}`,
					inline: true
				},
				{
					name: 'Subcommands :',
					value: `${commandOptions.subCommands.length > 0 ? commandOptions.subCommands.toString().replaceAll(',', '\n') : 'None'}`,
					inline: true
				}
			);

			if (isSubcommandsFlag) {
				if (commandOptions.man[0]['subCommands'].length > 0) {
					commandsEmbed.addField(`\u200B`, `----------> Subcommands <----------`);

					for (let index = 0; index < commandOptions.man[0]['subCommands'].length; index++) {
						commandsEmbed.addFields(
							{
								name: 'Name :',
								value: `${
									commandOptions.man[0]['subCommands'][index]['name'] ? commandOptions.man[0]['subCommands'][index]['name'] : 'None'
								}`,
								inline: true
							},
							{
								name: 'Description :',
								value: `${
									commandOptions.man[0]['subCommands'][index]['description']
										? commandOptions.man[0]['subCommands'][index]['description']
										: 'None'
								}`,
								inline: true
							},
							{
								name: 'Example :',
								value: `${
									commandOptions.man[0]['subCommands'][index]['example']
										? commandOptions.man[0]['subCommands'][index]['example']
										: 'None'
								}`,
								inline: true
							}
						);
					}
				}
				//else return message.reply(`${commandDetails.name} does not have any subcommands.`);
			}

			if (isFlagsFlag) {
				if (commandOptions.man[0]['flags'].length > 0) {
					commandsEmbed.addField(`\u200B`, `----------> Flags <----------`);
					for (let index = 0; index < commandOptions.man[0]['flags'].length; index++) {
						commandsEmbed.addFields(
							{
								name: 'Name :',
								value: `${commandOptions.man[0]['flags'][index]['name'] ? commandOptions.man[0]['flags'][index]['name'] : 'None'}`,
								inline: true
							},
							{
								name: 'Description :',
								value: `${
									commandOptions.man[0]['flags'][index]['description']
										? commandOptions.man[0]['flags'][index]['description']
										: 'None'
								}`,
								inline: true
							},
							{
								name: 'Example :',
								value: `${
									commandOptions.man[0]['flags'][index]['example'] ? commandOptions.man[0]['flags'][index]['example'] : 'None'
								}`,
								inline: true
							}
						);
					}
				}
				//else return message.reply(`${commandDetails.name} does not have any flags.`)
			}

			commandsEmbed.setFooter({ text: 'To view detailed manual on flags/subcommands, use the --flags / --subcommands flags.' });
			commandsEmbed.setTimestamp();
			return message.channel.send({ embeds: [commandsEmbed] });
		} else {
			const availableEmbed = new MessageEmbed()
				.setTitle(`${client.user.username} Help Page`)
				.setColor('BLURPLE')
				.addField(`Available commands :`, `\`\`${commandsList.join(' | ')}\`\``)
				.setFooter({ text: `To view specific command help page, run : rc.help <command>` })
				.setTimestamp();
			return message.channel.send({ embeds: [availableEmbed] });
		}
	}
}

module.exports = {
	HelpCommand
};
