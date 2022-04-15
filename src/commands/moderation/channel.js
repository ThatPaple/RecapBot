const { Command, container, ExtendedArgument } = require('@sapphire/framework');

class ChannelCommand extends Command {
	constructor(context, options) {
		super(context, {
			...options,
			name: 'channel',
			aliases: [],
			description: 'Channel management',
			preconditions: ['ModOnly'],
			flags: ['name', 'topic', 'set', 'remove'],
			subCommands: [],
			man: [
				{
					subCommands: [],
					flags: [
						{
							name: 'name',
							description: 'Target channel name',
							example: ''
						},
						{
							name: 'topic',
							description: 'Target topic',
							example: ''
						},
						{
							name: 'set',
							description: 'Set specified channel feature',
							example: 'channel --topic --set Welcom to chaos'
						},
						{
							name: 'remove',
							description: 'Remove any channel overrides',
							example: 'rc.perm --clear #channel @user <permission>'
						}
					]
				}
			]
		});
	}

	async messageRun(message, args) {
		const { client } = container;

		const isNameFlag = args.getFlags('name');
		const isTopicFlag = args.getFlags('topic');
		const isSetFlag = args.getFlags('set');
		const isRemoveFlag = args.getFlags('remove');

        if(isSetFlag && isRemoveFlag) return message.reply(`You cannot set and remove \`\`${isNameFlag ? 'name' : []}\`\` \`\`${isTopicFlag ? 'topic' : []}\`\``)

		let channel = await args.pick('channel').catch(() => null);
		    if (channel == null) return message.reply('ID has to be provided!');

		let change = await args.pick('string').catch(() => null);

		if (isSetFlag) {
			if (change == null)
				return message.reply(`New \`\`${isNameFlag ? 'name' : []}\`\` \`\`${isTopicFlag ? 'topic' : []}\`\` must be defined!`);

			if (isNameFlag) channel.setName(change);
			if (isTopicFlag) channel.setTopic(change);
		}

		if (isRemoveFlag) {
			if (isNameFlag) channel.setName('channel');
			if (isTopicFlag) channel.setTopic('');
		}
	}
}

module.exports = {
	ChannelCommand
};
