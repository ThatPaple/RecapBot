const { SubCommandPluginCommand } = require('@sapphire/plugin-subcommands');
const db = require('../../handlers/databaseHandler');
const { MessageEmbed, MessageFlags } = require('discord.js');
const pool = require('../../handlers/mysqlConnector');

class RecapCommand extends SubCommandPluginCommand {
	constructor(context, options) {
		super(context, {
			...options,
			name: 'recap',
			aliases: ['r'],
			description: 'Recap functionality',
			preconditions: ['TestingOnly'],
			flags: ['confirm'],
			subCommands: ['add', 'delete', 'edit', 'post', 'recall', 'swap', 'view', 'search'],
			man: [
				{
					subCommands: [
						{
							name: 'add',
							description: "Add an entry to today's recap",
							example: 'add <entry>'
						},
						{
							name: 'delete',
							description: 'Delete an entry from recap',
							example: 'delete <ID>'
						},
						{
							name: 'edit',
							description: "Add an entry to today's recap",
							example: 'edit <ID> ["link"] <new entry / link>'
						},
						{
							name: 'post',
							description: "Add an entry to today's recap",
							example: ''
						}
					],
					flags: [
						{
							name: 'confirm',
							description: 'Some commands may require the confirm flag. If that is the case, the bot will let you know.',
							example: ''
						}
					]
				}
			]
		});
	}

	// let arg = await args.pick('string').catch(() => null);
	//	const isFlagNameFlag = args.getFlags('FLAG HERE');

	/*
	* * Completion board :  
	 ? Finished add(), post(), view(), recall(), swap(), delete(), search();
	 TODO 'edit'
	 TODO Add missing items into manpage 
	 ! Test view and post. Ideally on an arr instead of prod.
	*/

	async add(message, args) {
		var urlRegex =
			/(?:(?:https?|ftp|file):\/\/|www\.|ftp\.)(?:\([-A-Z0-9+&@#\/%=~_|$?!:,.]*\)|[-A-Z0-9+&@#\/%=~_|$?!:,.])*(?:\([-A-Z0-9+&@#\/%=~_|$?!:,.]*\)|[A-Z0-9+&@#\/%=~_|$])/gi;
		// https://regexr.com/

		let input = await args.rest('string').catch(() => null);
		if (input === null) return message.reply('No input provided.');

		if (message.type == 'REPLY') {
			const msg = await message.channel.messages.fetch(message.reference.messageId);
			db.addRecap(input, `> <${msg.url}>`, 0, message);
		} else {
			var links = input.match(urlRegex);
			var recap = input.replaceAll(urlRegex, '');
			var parsedLinks = '';

			if (links != null) {
				for (let index = 0; index < links.length; index++) {
					parsedLinks = parsedLinks + '> ' + '<' + links[index] + '>' + '\n';
				}
			}

			db.addRecap(recap, parsedLinks, 0, message);
		}
	}

	async delete(message, args) {
		let input = await args.rest('number').catch(() => null);
		if (input === null) return message.reply('You need to provide an ID');
		db.deleteRecap(Number(input), message);
	}

	async edit(message, args) {
		// old syntax  > rc.edit [ID] <link> [new entry OR link]

		let inputID = await args.pick('number').catch(() => null);
		if (inputID === null) return message.reply('You need to provide ID.');
		let edit = await args.rest('string').catch(() => null);

		var urlRegex =
			/(?:(?:https?|ftp|file):\/\/|www\.|ftp\.)(?:\([-A-Z0-9+&@#\/%=~_|$?!:,.]*\)|[-A-Z0-9+&@#\/%=~_|$?!:,.])*(?:\([-A-Z0-9+&@#\/%=~_|$?!:,.]*\)|[A-Z0-9+&@#\/%=~_|$])/gi;
		// https://regexr.com/

		var links = edit.match(urlRegex);
		var recap = edit.replaceAll(urlRegex, '');
		var parsedLinks = '';

		if (links != null) {
			for (let index = 0; index < links.length; index++) {
				parsedLinks = parsedLinks + '> ' + '<' + links[index] + '>' + '\n';
			}
		}

		if (links != null) {
			db.editRecap(Number(inputID), true, parsedLinks, message);
		}

		if (recap.length > 0) {
			db.editRecap(Number(inputID), false, recap, message);
		}

		return;
	}

	async post(message, args) {
		db.postRecap(message);
	}

	async recall(message, args) {
		let input = await args.rest('number').catch(() => null);
		if (input == null) return message.reply('ID has to be provided!');
		db.recallRecap(Number(input), message);
	}

	async swap(message, args) {
		let first = await args.pick('number').catch(() => null);
		if (first == null) return message.reply('ID has to be provided!');

		let second = await args.pick('number').catch(() => null);
		if (second == null) return message.reply('ID has to be provided!');

		db.swapRecap(first, second, message);
	}

	async view(message, args) {
		let input = await args.rest('string').catch(() => null);
		if (input == null) db.viewRecap('today', 'none', message); // View today's recap
		else if (input === 'all') {
			message.reply('This feature is deprecated, please use ``search`` instead if you are searching for anything specific!');
		}
	}

	async search(message, args) {
		let searchTerm = await args.pick('string').catch(() => null);
		let isConfirmFlag = args.getFlags('confirm');
		if (searchTerm === null) return message.reply('You need to provide a search term!');

		db.databaseSearch(searchTerm, isConfirmFlag, message);
	}
}

module.exports = {
	RecapCommand
};
