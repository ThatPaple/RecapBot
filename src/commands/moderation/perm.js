const { Command, container, ExtendedArgument } = require('@sapphire/framework');
const pool = require('../../handlers/mysqlConnector');
const { MessageEmbed } = require('discord.js');
const prettyMilliseconds = require('pretty-ms');
const modlogger = require('../../handlers/modlogHandler');
const { ApplicationCommandLimits } = require('@sapphire/discord.js-utilities');

class PermCommand extends Command {
	constructor(context, options) {
		super(context, {
			...options,
			name: 'perm',
			aliases: [],
			description: 'Permission management',
			//	preconditions: ['ModOnly'],
			flags: ['remove', 'add', 'recursive', 'clear'],
			subCommands: [],
			man: [
				{
					subCommands: [],
					flags: [
						{
							name: 'remove',
							description: 'Remove users permission',
							example: 'rc.perm --remove #channel @user <permission>'
						},
						{
							name: 'add',
							description: 'Grant user permission',
							example: 'rc.perm --add #channel @user <permission>'
						},
						{
							name: 'clear',
							description: 'Remove any channel overrides',
							example: 'rc.perm --clear #channel @user <permission>'
						},
						{
							name: 'recursive',
							description: 'Do specific action in every channel',
							example: 'rc.perm --remove --recursive @user <permission>'
						}
					]
				}
			]
		});
	}

	async messageRun(message, args) {
		const { client } = container;

		const isAddFlag = args.getFlags('add');
		const isRemoveFlag = args.getFlags('remove');
		const isClearFlag = args.getFlags('clear');
		const isRecursiveFlag = args.getFlags('recursive');

		if ((isAddFlag && isRemoveFlag) || (isAddFlag && isClearFlag) || (isRemoveFlag && isClearFlag))
			return message.reply(
				`You may not combine \`\`${isClearFlag ? 'Clear,' : []} ${isAddFlag ? 'Add,' : []} ${isRemoveFlag ? 'Remove,' : []}\`\` flags together!`
			);

		let permList = [
			'ADD_REACTIONS',
			'PRIORITY_SPEAKER',
			'STREAM',
			'VIEW_CHANNEL',
			'SEND_MESSAGES',
			'EMBED_LINKS',
			'ATTACH_FILES',
			'READ_MESSAGE_HISTORY',
			'USE_EXTERNAL_EMOJIS',
			'CONNECT',
			'SPEAK',
			'USE_VAD',
			'REQUEST_TO_SPEAK',
			'USE_PUBLIC_THREADS',
			'CREATE_PUBLIC_THREADS',
			'USE_PRIVATE_THREADS',
			'CREATE_PRIVATE_THREADS',
			'USE_EXTERNAL_STICKERS',
			'SEND_MESSAGES_IN_THREADS',
			'START_EMBEDDED_ACTIVITIES'
		];

		let channel = await args.pick('channel').catch(() => null);
		if (channel === null && isRecursiveFlag == false) return message.reply('Missing : Please mention a channel or channel ID');
		let member = await args.pick('member').catch(() => null);
		if (member === null) return message.reply('Missing : Please mention a user or user ID');
		let permission = await args.pick('string').catch(() => null);
		if (!isClearFlag && permission == null) return message.reply('Please specify a permission.');

		if (isClearFlag == false) {
			if (!permList.includes(permission.toUpperCase()))
				return message.reply(`Unknown permission.\nList of permissions here:\n\`\`\`${permList.toString().replaceAll(',', '\n')}\`\`\``);
		}

		if (isRecursiveFlag) {
			message.channel.send('Please wait, this may take a while.').then((statusMessage) => {
				let listOfAffectedChannels = [];
				client.channels.cache.forEach((channel) => {
					if (channel.type == 'GUILD_TEXT') {
						if (channel.permissionsFor(message.author.id).has(permission) != false) {
							if (isRemoveFlag) {
								if (permission === null) return message.reply('Missing : Please mention a permission');
								channel.permissionOverwrites
									.edit(member, {
										[permission.toUpperCase()]: false
									})
									.catch(console.error);
								listOfAffectedChannels.push(`<#${channel.id}>`);
							}
							if (isAddFlag) {
								if (permission === null) return message.reply('Missing : Please mention a permission');
								channel.permissionOverwrites
									.edit(member, {
										[permission.toUpperCase()]: true
									})
									.catch(console.error);
								listOfAffectedChannels.push(`<#${channel.id}>`);
							}
						}
						if (isClearFlag) {
							channel.permissionOverwrites.delete(member, 'Cleared channel overrides').catch(console.error);
							listOfAffectedChannels.push(`<#${channel.id}>`);
						}
					}
				});
				return statusMessage.edit(
					`${isAddFlag ? 'Added' : isClearFlag ? 'Cleared' : isRemoveFlag ? 'Removed' : 'Error'} ${
						isClearFlag ? 'permissions' : `\`\`${permission.toUpperCase()} permission\`\``
					} ${isAddFlag ? 'to' : 'from'} ${member} in :\n${listOfAffectedChannels.join(' | ')}`
				);
			});
		} else if (isRecursiveFlag != true) {
			if (channel.permissionsFor(message.author.id).has(permission) != false) {
				if (isAddFlag) {
					channel.permissionOverwrites
						.edit(member, {
							[permission.toUpperCase()]: true
						})
						.catch(console.error);
				}

				if (isClearFlag) {
					channel.permissionOverwrites.delete(member, 'Cleared channel overrides').catch(console.error);
				}

				if (isRemoveFlag) {
					if (permission === null) return message.reply('Missing : Please mention a permission');
					channel.permissionOverwrites
						.edit(member, {
							[permission.toUpperCase()]: false
						})
						.catch(console.error);
				}

				return message.reply(
					`${isAddFlag ? 'Added' : isClearFlag ? 'Cleared' : isRemoveFlag ? 'Removed' : 'Error'} ${
						isClearFlag ? 'permissions' : `\`\`${permission.toUpperCase()} permission\`\``
					} ${isAddFlag ? 'to' : 'from'} ${member} in ${channel}`
				);
			} else return message.reply(`You yourself do not have \`\`${permission}\`\` permission witin ${channel}`);
		}
	}
}

module.exports = {
	PermCommand
};
