const { Command, container, ExtendedArgument } = require('@sapphire/framework');
const { MessageEmbed } = require('discord.js');

class manualCommand extends Command {
	constructor(context, options) {
		super(context, {
			...options,
			name: 'manual',
			aliases: ['rtfm'],
			preconditions: ['ModOnly'],
			description: 'rtfm!',
			flags: [],
			subCommands: [],
			man: [
				{
					subCommands: [],
					flags: []
				}
			]
		});
	}

	async messageRun(message, args) {
		const { client } = container;
		const manualEmbed = new MessageEmbed();
		manualEmbed.setTitle(`${client.user.username} Manual`);
		manualEmbed.setColor('RED');
		manualEmbed.addField(`Prefixes`, `Accepted prefixes are : \`\`@${client.user.username}  | ${client.options.defaultPrefix.join('  | ')}\`\``);
		manualEmbed.addField(
			`Subcommands`,
			`Subcommands are keywords that invoke a new set of options and features. 
            For example, the recap command has a long series of subcommands, like add and search. 
            Each can have its own options and implementations.
        `
		);
		manualEmbed.addField(`Flags`, `Flags are used to modify the behavior of a command, or add options to a command.`);
		manualEmbed.addField(
			`Help menu`,
			`To view help, you'd run \`\`rc.help\`\`. You may also request specific help page for a command with \`\`rc.help {command name}\`\`.`
		);
		manualEmbed.addField(
			`How to use flags?`,
			`Flags can be used at the beginning of the command, but are accepted at the end of the command too. 
            The moment you use a \`\`--\`\`, the bot will search for an applicable flag. 
            Every command has its own specific flags, although it is not necessary for a command to have a flag! 
            To view list of available flags for a specifc command, run the help command.
            \nAn example of flag usage would be \`\`rc.ping --database\`\``
		);
		manualEmbed.addField(
			`How to use subcommands?`,
			`As said above, subcommands are keywords that invoke a new set of options and features. 
            The recap command uses subcommands to handle functionality. If you run \`\`rc.recap\`\` the bot won't respond, 
            but the recap command does exist. As such, you do have to apply a subcommand such as \`\`search\`\` or \`\`add\`\`. 
            To view a list of available sub commands for a specifc command, run the help command.
            \nAn example of a subcommand usage would be \`\`rc.recap add\`\``
		);
		manualEmbed.addField(
			`A command is not responding?`,
			`It is possible that the bot either crashed, threw an error, or the comamnd is built upon subcommands.`
		);
		manualEmbed.addField(
			`Why is the bot telling me I do not have permissions to use a command?`,
			`Please ask me or Martin to double-check. 
        Chances are that the command is not meant to be run outside of a test server, or by mods outside of the bot management role.`
		);
		manualEmbed.setTimestamp();
		return message.channel.send({ embeds: [manualEmbed] });
	}
}

module.exports = {
	manualCommand
};
