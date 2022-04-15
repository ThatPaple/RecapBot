const { Command, container, ExtendedArgument } = require('@sapphire/framework');
const { MessageEmbed } = require('discord.js');
const { OneYearRole }  = require('../../../config.json'); 
const MS = 1000 * 60 * 60 * 24;

class EligibleCommand extends Command {
	constructor(context, options) {
		super(context, {
			...options,
			name: 'eligible',
			aliases: ['e'],
			description: 'Checks eligibility for special roles',
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
		let role = message.member.guild.roles.cache.find(role => role.id === `${OneYearRole}`);
		
		const currentDate = new Date();
		const userJoined = message.member.joinedAt;
		const diffDays = dateDiffInDays(userJoined, currentDate);
        let description = 'If you see ``Eligible`` within the following fields, you can claim all eligible roles using ``rc.eligible claim``\nTo remove all claimed roles, run ``rc.eligible remove``';
        let fieldValue = (`\`\`${diffDays >= 365 ? 'Eligible' : (message.member.roles.cache.has(`${OneYearRole}`) ? "\`\`Claimed\`\`" : `Eligible in ${diffDays}`)}\`\``)

        let fnc = await args.rest('string').catch(() => null);
        if(fnc == "claim"){
			if(role){
				message.guild.members.cache.get(message.author.id).roles.add(role);
				description = "Available roles have been successfully claimed!";
			}else{
				description = "Error occured, please contact a moderator using modmail";
				fieldValue = (`\`\`ERR\`\``)
				console.log(role)
			}
        }

		if(fnc == "remove" && diffDays >= 365 && message.member.roles.cache.has(`${OneYearRole}`)){
			if (role) {
				message.guild.members.cache.get(message.author.id).roles.remove(role);
				description = "Available roles have been successfully removed!";
			

			}else{
				description = "Error occured, please contact a moderator using modmail";
				fieldValue = (`\`\`ERR\`\``)
				console.log(role)
			}

		}

        const Eligibilitypanel = new MessageEmbed()
				.setColor('#0099ff')
				.setTitle(`${message.author.tag}'s Eligibility Panel`)
				.setDescription(description)
				.addFields(
					{ name: `One Year Club`, value: `${fieldValue}`},
				)
				.setFooter({text : `If you're experiencing any issues with this panel, please open a modmail ticket.`})
				.setTimestamp()
			message.channel.send({ embeds: [Eligibilitypanel] });
            console.log(diffDays)
            console.log(message.member.joinedAt)
	}
}

function dateDiffInDays(a, b) {
	const utc1 = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate());
	const utc2 = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate());

	return Math.floor((utc2 - utc1) / MS);
}

module.exports = {
	EligibleCommand
};
