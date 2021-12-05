const { Discord, Util } = require('discord.js');
const fs = require('fs');
const currentRecap = "data/currentRecap.csv";
const { colors, permissionLevels } = require('../utils/config.json');
var parse = require('csv-parse');


module.exports = {
    name: 'view',
    description: 'View current recap file',
    aliases: [],
    guildOnly: false,
    args: false,
    argList: ['all'],
    usage: '',
    execute: (message, args, client) => {
        if (message.member.roles.cache.has(`${permissionLevels.moderator}`) || message.member.roles.cache.has(`${permissionLevels.testing}`)) {
        try {
            var csvData = [];
        fs.createReadStream(currentRecap)
            .pipe(parse({ delimiter: ',' }))
            .on('data', function (csvrow) {
                csvData.push(csvrow);
            })
            .on('end', function () {
                csvData.sort(function (a, b) {
                    return a[0] - b[0];
                });

                let clean = "";
                for (let i = 0; i < csvData.length; i++) {
                    if (Number(csvData[i][3]) == 0) {
                        clean = clean + `\nID ${Number(csvData[i][0])} : ${csvData[i][1]}\nLink : ${csvData[i][2]}\n`
                    } else if (args[0] == "all"){
                        clean = clean + `\nID ${Number(csvData[i][0])} : ${csvData[i][1]}\nLink : ${csvData[i][2]}\n`
                    }
                }

                if (clean.length > 0) {
                    const chunks = Util.splitMessage(clean);
                    if(args[0] == "dm"){
                        try {
                            message.author.send(`**Recap Storage**`);
                            chunks.forEach((chunk, i) => message.author.send(`\`\`\`${chunk}\`\`\``))
                            message.reply("I am currently crunching all the data and sending it your way!")
       
                        } catch (error) {
                            message.reply("I cannot DM you due to your privacy settings, please use ``recap.view all`` instead!")                            
                        }                        
                    } else {
                        message.channel.send(`**Recap Storage**`);
                    chunks.forEach((chunk, i) => message.channel.send(`\`\`\`${chunk}\`\`\``))
                    }
                } else {
                    message.reply('**There is no recap currently stored!**')
                }
            });
        } catch (error) {
            message.reply("Well.. This is embarrasing. Something went wrong! Please contact Paps asap.")
            console.log(error)
        }
    }
    },
};