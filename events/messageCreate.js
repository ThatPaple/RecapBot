const { prefix, permissionLevels } = require('../utils/config.json');
const fs = require('fs')

module.exports = {
	event: 'messageCreate',
	run: (message, client) => {

		let ping = message.mentions.members.first();
		const dondabase = ["https://open.spotify.com/track/7eSSmgq26BXr7xay3WKjfi?si=dc65b0822a064283",
			"https://open.spotify.com/track/6d8HN8MqqbqrEUI2bvx0aG?si=2d9ade3808e948ed",
			"https://open.spotify.com/track/5JaSg0AYyAMMLjyGGDrrCm?si=7a3830141fac46d1",
			"https://open.spotify.com/track/5JaSg0AYyAMMLjyGGDrrCm?si=9175458d28724121",
			"https://open.spotify.com/track/6LNoArVBBVZzUTUiAX2aKO?si=7ad522973a9e4f8a",
			"https://open.spotify.com/track/0WSEq9Ko4kFPt8yo3ICd6T?si=6fd1ffc088914d35",
			"https://open.spotify.com/track/35acXjupfWHgtchiS6yAjC?si=1f1115bc9328453d",
			"https://open.spotify.com/track/5LuXsO34x6KVlL8OWsxRqk?si=75210db659424c53",
			"https://open.spotify.com/track/1jgcODbfAL3tV7tikF6n1j?si=af66e22724604c97",
			"https://open.spotify.com/track/0JuSGEldfovcc8IS9va1wa?si=83ffaabf1eac40a7",
			"https://open.spotify.com/track/68RhNM8ehkarnEKnCkqlsp?si=cd4a4f3988e842f0",
			"https://open.spotify.com/track/45N9i9QraLWD6GW7xBqxnx?si=7aed99bbe9414fb6",
			"https://open.spotify.com/track/2Y40huo5ewaKYxsFintYtF?si=70fac979b3a343c1",
			"https://open.spotify.com/track/4jkwu5KQbXXrbAZzVmt5fE?si=27ec4edc62094f7a",
			"https://open.spotify.com/track/7EagormFign5ag6f16ua3I?si=df43934d032846c3",
			"https://open.spotify.com/track/1LwdWIbfuqlOo8vlHxkyna?si=bcc93390f4134816",
			"https://open.spotify.com/track/4OfnDoi5VOPsXtwnofq6aL?si=d2b37adecae64ba1",
			"https://open.spotify.com/track/5Iq6pIudd4KfuxZqf8872b?si=dc051fe2113c4308",
			"https://open.spotify.com/track/5aqUqSq0SqGBAqEn27PEzc?si=ccd5582186d84119",
			"https://open.spotify.com/track/5xvXeuxISyXJDRbZZf4uzd?si=9f5111bbf89840ac",
			"https://open.spotify.com/track/3hd6zLhnTlbJ8PupYt3cAI?si=de3f236210ea406e",
			"https://open.spotify.com/track/2H8jWuNmluerTEsuh8Gu6y?si=1ac7da70f0da4557",
			"https://open.spotify.com/track/5ad5uryyzVWs95bK3myGkw?si=3dd3c5f5fcfd43f1",
			"<https://youtu.be/a-xWhG4UU_Y>",
			"https://open.spotify.com/track/2auYgZ1GcTkWj2bOaE2Wwm?si=4441937f83604fb6",
			"https://open.spotify.com/track/360VkSTITvF55weIKoaNTw?si=a593b08f3f534d3e",
			"https://open.spotify.com/track/1eQBEelI2NCy7AUTerX0KS?si=9d5e4b62116f4c61",
			"https://open.spotify.com/track/4KW1lqgSr8TKrvBII0Brf8?si=d7d509c3c0e24223",
			"https://open.spotify.com/track/1Wsbr1d2BouNGk2q92mIj7?si=068eaaf9251642fd",
			"https://open.spotify.com/track/19a3JfW8BQwqHWUMbcqSx8?si=3a3fbd00a8c04191",
			"https://open.spotify.com/track/49fT6owWuknekShh9utsjv?si=9bb89fb0c104440a",
			"https://open.spotify.com/track/36o4taPyOdnOMf01ERmn9a?si=e781379f04174855",
			"https://open.spotify.com/track/4qYLPta5HZ36idWiXtqh7B?si=ba02989a03184d02",
			"https://open.spotify.com/track/6wfzokDylbrJzrJcpnBkcy?si=ef8d587b849f4b0b",
			"https://open.spotify.com/track/5CGS4UovzA7ftCJkLVXQju?si=f44bf95e1b0741b7",
			"https://open.spotify.com/track/3nAq2hCr1oWsIU54tS98pL?si=48a2f1cfa79d403c",
			"https://open.spotify.com/track/30Zcjs7pgEkmJA1lEbGSWT?si=8f8658007b9d47f1",
			"https://open.spotify.com/track/66Q3fAmSX5eHamgbKa9alP?si=4f982f0e19eb4499",
			"https://open.spotify.com/track/432hUIl3ISDeytYW5XBQ5h?si=4009f13397614c87",
			"https://open.spotify.com/track/20r94xA0bsYNLtYSiOE6r3?si=f4bd5104cb8043e0",
			"https://open.spotify.com/track/1ZnA4VYOlYIShuGt60LmCs?si=c7bf86ea368d40c9",
			"https://open.spotify.com/track/2CHmgtK8OCL28WtIK96u4N?si=93b2a045b17e450f",
			"https://open.spotify.com/track/0zLClc0emc6qUeV1p5nc99?si=8a3a1c7705374872",
			"https://open.spotify.com/track/3MnbXlC1N7GdS9M8HzA6no?si=5d80a5736eba42c4",
			"https://open.spotify.com/track/3cCxoOgfi6hgt8MNteuiiD?si=570cebdb6d064c66",
			"https://open.spotify.com/track/1o0kWPueYo94LIjPYOE5Nf?si=ef18bb191d78494e",
			"https://open.spotify.com/track/7yNK27ZTpHew0c55VvIJgm?si=dd22131c632945fc",
			"https://open.spotify.com/track/23SZWX2IaDnxmhFsSLvkG2?si=f41bd15daaab4915",
			"https://open.spotify.com/track/2gZUPNdnz5Y45eiGxpHGSc?si=330d6491a87149a6",
			"https://open.spotify.com/track/4D6TpthzUVNTjWQqfBW5Kb?si=960f95df393742a9",
			"https://open.spotify.com/track/22L7bfCiAkJo5xGSQgmiIO?si=526ad0026a7048a0",
			"https://open.spotify.com/track/1ZHYJ2Wwgxes4m8Ba88PeK?si=c434bbf1b8c941b6",
			"https://open.spotify.com/track/6K07Ahf6V7CAQn0ikrOztl?si=644b712981b9415d",
			"https://open.spotify.com/track/1UGD3lW3tDmgZfAVDh6w7r?si=794e0a12f9f143a2",
			"https://open.spotify.com/track/3DK6m7It6Pw857FcQftMds?si=9d8cda7544914bdb",
			"https://open.spotify.com/track/3rCNmRonlHN1TXQLcG3dSk?si=cf72ec4285244903",
			"https://open.spotify.com/track/4EndPA8b6FDWYp1RgsnLEB?si=1726f372aa604b71",
			"https://open.spotify.com/track/2Im64pIz6m0EJKdUe6eZ8r?si=0749483914574584",
			"https://open.spotify.com/track/4e5IPJxSGVWPsaxQzdRseN?si=56ba83405d734ee4"]
		// START OF EASTER EGGS

		if (!message.channel.isThread() && message.type != "REPLY") {



			if (message.toString() == "rc.car" && (message.member.roles.cache.has(`${permissionLevels.moderator}`) || message.member.roles.cache.has(`${permissionLevels.testing}`))) {
				if (((Math.floor(Math.random() * 2) / 1) == 1)) {
					message.reply(":blue_car:")
				} else message.reply(" :race_car:")
			}

			if (message.mentions.has(client.user) && message.author.id == "321140713523773462") {
				let rand = dondabase[Math.floor(Math.random() * dondabase.length)]
				message.reply(rand)
			}

			if (message.mentions.has(client.user) && message.author.id == "365530349695926302") {
				message.reply("Bro.. Numbers.. am I right? - Mikey, Nov 19, 2021")
			}

			if (message.mentions.has(client.user) && message.author.id == "630473266166890517") {
				message.reply("Bot broke pls fix.")
			}

			if (message.mentions.has(client.user) && message.author.id == "413481857364000769") {
				message.reply(":penguin:")
			}
			if (message.mentions.has(client.user) && message.author.id == "542876387925688322") {
				message.reply("<https://youtu.be/WPkMUU9tUqk>")
			}
		}
		// END OF EASTER EGGS

		if (!message.content.startsWith(prefix) || message.author.bot) return;

		const args = message.content.slice(prefix.length).split(/ +/);
		const commandName = args.shift().toLowerCase();
		const command =
			client.commands.get(commandName) ||
			client.commands.find(
				(cmd) => cmd.aliases && cmd.aliases.includes(commandName),
			);
		if (!command) return;
		if (command.guildOnly && message.channel.type !== 'text') {
			return message.reply('I can\'t execute that command inside DMs!');
		}

		if (command.args && !args.length) {
			let reply = `You didn't provide any arguments, ${message.author}!`;
			if (command.usage) {
				reply += `\nThe proper usage would be: \`${prefix}${command.name} ${command.usage}\``;
			}
			return message.channel.send(reply);
		}
		try {
			command.execute(message, args, client);
		}
		catch (error) {
			console.error(error);
			message.reply('There was an error trying to execute that command!');
		}
	},
};