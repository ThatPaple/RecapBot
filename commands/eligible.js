const { Discord, MessageEmbed } = require('discord.js');
const { colors, modlogChannelID, permissionLevels, OneYearRole } = require('../utils/config.json');
const _MS_PER_DAY = 1000 * 60 * 60 * 24;

module.exports = {
	name: 'eligible',
	description: 'Are you eligible for the club?',
	aliases: ['e'],
	guildOnly: false,
	args: false,
	argList: ['claim, remove'],
	usage: '',
	execute: async (message, args, client) => {

		const currentDate = new Date();
		const userJoined = message.member.joinedAt;
		const diffDays = difference = dateDiffInDays(userJoined, currentDate);
		let oneYearEligible = false;
		if (Number(diffDays) >= 365) oneYearEligible = true;
		let role = message.member.guild.roles.cache.find(role => role.id === `${OneYearRole}`);
		let footer = "If you're experiencing any issues with this panel, please open a modmail ticket."


		if (args[0] === "claim" && oneYearEligible) {
			if (message.member.roles.cache.has(`${OneYearRole}`)) {
				message.reply("You already have all your roles claimed!\nRun ``rc.eligible`` to see what roles you've claimed.")
			} else {

				if (role) {
					message.guild.members.cache.get(message.author.id).roles.add(role);
					const claim = new MessageEmbed()
						.setColor('#0099ff')
						.setTitle(`${message.author.tag}'s Eligibility Claim`)
						.setDescription('Success, you have claimed your eligible roles!')
						.setTimestamp()
					message.channel.send({ embeds: [claim] });
				} else {
					const claimError = new MessageEmbed()
						.setColor('#0099ff')
						.setTitle(`${message.author.tag}'s Eligibility Claim`)
						.setDescription('ERROR -> ``Please open a ticket to notify a moderator of this error!``')
						.setTimestamp()
					message.channel.send({ embeds: [claimError] });
				}
			}
		}
		else if (args[0] === "remove" && oneYearEligible && message.member.roles.cache.has(`${OneYearRole}`)) {
			if (role) {
				message.guild.members.cache.get(message.author.id).roles.remove(role);
				const remove = new MessageEmbed()
					.setColor('#0099ff')
					.setTitle(`${message.author.tag}'s Eligibility Panel`)
					.setDescription('Success, you have removed your eligible roles!')
					.setTimestamp()
				message.channel.send({ embeds: [remove] });
			} else {
				const removeError = new MessageEmbed()
					.setColor('#0099ff')
					.setTitle(`${message.author.tag}'s Eligibility Panel`)
					.setDescription('ERROR -> ``Please open a ticket to notify a moderator of this error!``')
					.setTimestamp()
				message.channel.send({ embeds: [removeError] });
			}
		} else {
			if (message.member.roles.cache.has(`${OneYearRole}`)) {
				oneYearEligible = "Claimed"
			} else if (oneYearEligible) {
				oneYearEligible = "Eligible"
			} else {
				footer = `This panel calculates eligibility based on your latest join. If you rejoined the server, you may open a modmail ticket and we'll verify your eligibility manually.`
				oneYearEligible = `Eligible in ${360 - Number(diffDays)} days`
			}

			const Eligibilitypanel = new MessageEmbed()
				.setColor('#0099ff')
				.setTitle(`${message.author.tag}'s Eligibility Panel`)
				.setDescription('If you see ``Eligible`` within the following fields, you can claim all eligible roles using ``rc.eligible claim``\nTo remove all claimed roles, run ``rc.eligible remove``')
				.addFields(
					{ name: `One Year Club`, value: `\`\`${oneYearEligible}\`\`` },
				)
				.setFooter({text : `${footer}`})
				.setTimestamp()
			message.channel.send({ embeds: [Eligibilitypanel] });
		}
	}
};

function dateDiffInDays(a, b) {
	const utc1 = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate());
	const utc2 = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate());

	return Math.floor((utc2 - utc1) / _MS_PER_DAY);
}