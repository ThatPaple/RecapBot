// TODO : CLEAN UP

const Discord = require('discord.js');
const fs = require('fs');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const currentRecap = "data/currentRecap.csv";
const { colors, modlogChannelID, permissionLevels } = require('../utils/config.json');

module.exports = {
	name: 'add',
	description: 'Add inquiry into todays recap.',
	aliases: [],
	guildOnly: false,
	args: false,
	argList: [],
	usage: '[input] [link]',
	execute: async (message, args, client) => {
		if (message.member.roles.cache.has(`${permissionLevels.moderator}`) || message.member.roles.cache.has(`${permissionLevels.testing}`)) {
			var id = 0;

			try {
				const data = fs.readFileSync('data/id', 'utf8')
				id = data
			} catch (err) {
				console.error(err)
			}

			fs.writeFile('data/id', `${Number(id) + 1}`, err => {
				if (err) {
					console.error(err)
					return
				}
			})

			var link = "";
			var temp = "⁃ ";
			if (message.type == "REPLY" && args.length > 0) {
				const msg = await message.channel.messages.fetch(message.reference.messageId)
				link = link + "> " + "<" + msg.url + ">" + "\n";
				for (i = 0; i <= args.length - 1; i++) {
					temp = temp + args[i] + " ";
				}

			} else {
				for (i = 0; i <= args.length - 1; i++) {
					if (args[i].includes("https://") || args[i].includes("http://")) {
						link = link + "> " + "<" + args[i] + ">" + "\n";
					} else {
						temp = temp + args[i] + " ";
					}
				}
			}
			appendData(message, id, temp, link, 0, modlogChannelID);
		}
	}
};

function appendData(message, id, recap, link, posted, modlogChannelID) {
	const { Util } = require('discord.js');
	const csvWriter = createCsvWriter({
		append: true,
		path: `${currentRecap}`,
		header: [
			{ id: 'id', title: 'ID' },
			{ id: 'recap', title: 'Recap' },
			{ id: 'links', title: 'Links' },
			{ id: 'posted', title: 'Posted?' }
		]
	});

	const data = [
		{
			id: `${id}`,
			recap: `${recap}`,
			links: `${link}`,
			posted: `${posted}`
		}
	];


	const chunks = Util.splitMessage(recap);
	async function post() {
		return await chunks.forEach((chunk, i) => message.guild.channels.cache.get(`${modlogChannelID}`).send(`Added : \n \`\`\`${chunk}\`\`\`\n into todays recap storage.`));
	};

	csvWriter
		.writeRecords(data)
		.then(() => post())
	message.react("👍")
}