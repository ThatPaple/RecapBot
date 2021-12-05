const Discord = require('discord.js');
const { colors, permissionLevels } = require('../utils/config.json');
const { version, dependencies } = require('../package.json')
const fs = require('fs');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;

module.exports = {
	name: 'track',
	description: 'Activity Tracker',
	aliases: [],
	guildOnly: false,
	args: false,
	argList: [],
	usage: '',
	execute: async (message, args, client) => {
		if (message.member.roles.cache.has(`${permissionLevels.owner}`) || message.member.roles.cache.has(`${permissionLevels.testing}`)) {
			message.react("👍")
			setInterval(async function(){ 
				const mods = ["797807532042354698","621146326763044877","142673643363631104","456287893217083433","215269705043279874","365530349695926302","732312551987216512","588190461026500611","181743431196999680","779815536245866537","762421323669438464","413481857364000769","433628848836575232","242236617757163520","162894948721623041","602827752835383296","542876387925688322","449820501607579648","761314056757313546","321140713523773462","630473266166890517","498297439766315020"]
				var online = 0;
				var idle = 0;
				var dnd = 0;
				mods.forEach(members =>{
					member = message.guild.members.fetch(members)
					if(member.presence?.status === 'online'){
						online++;
					}if(member.presence?.status === 'dnd'){
						dnd++;
					}if(member.presence?.status === 'idle'){
						idle++;
					}
				})
			var currentdate = new Date();
			appendData(currentdate.getDate(), (currentdate.getMonth()+1), currentdate.getFullYear(), currentdate.getHours(), currentdate.getMinutes(), online, dnd, idle)
			}, 60000);
			
		}
	},
};

function appendData(dd, mm, yy, hh, m, on, dnd, idle) {
	const csvWriter = createCsvWriter({
		append: true,
		path: `data/activity.csv`,
		header: [
			{ id: 'day', title: 'Day' },
			{ id: 'month', title: 'Month' },
			{ id: 'year', title: 'Year' },
			{ id: 'hours', title: 'Hours' },
			{ id: 'minutes', title: 'Minutes' },
			{ id: 'online', title: 'Online' },
			{ id: 'dnd', title: 'Dnd' },
			{ id: 'idle', title: 'idle' }
		]
	});

	const data = [
		{
			day: `${dd}`,
			month: `${mm}`,
			year: `${yy}`,
			hours: `${hh}`,
			minutes:`${m}`,
			online: `${on}`,
			dnd: `${dnd}`,
			idle: `${idle}`,
		}
	];


	csvWriter
		.writeRecords(data)
}