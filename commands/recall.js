const { Discord, Util } = require('discord.js');
const fs = require('fs');
const currentRecap = "data/currentRecap.csv";
const { colors, permissionLevels } = require('../utils/config.json');
var parse = require('csv-parse');


module.exports = {
    name: 'recall',
    description: 'View old recap entries',
    aliases: [],
    guildOnly: false,
    args: false,
    argList: ['all'],
    usage: '',
    execute: (message, args, client) => {
        if (message.member.roles.cache.has(`${permissionLevels.moderator}`) || message.member.roles.cache.has(`${permissionLevels.testing}`)) {
        var csvData = [];
        var id;

            try {
                const data = fs.readFileSync('data/id', 'utf8')
                id = data
            } catch (err) {
            }

            
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
                if (Number(args[0]) < Number(id)) {
                    for (let i = 0; i < csvData.length; i++) {
                        if (Number(csvData[i][0]) == args[0]) {
                            clean = clean + `\nID ${Number(csvData[i][0])} : ${csvData[i][1]}\nLink : ${csvData[i][2]}\n`
                        }
                    }
                } else {
                    message.reply(`Index out of bounds : Allowed index between 0 - ${id - 1}.`)
                }

                if (clean.length > 0) {
                    const chunks = Util.splitMessage(clean);
                    message.channel.send(`**Recap Storage**`);
                    chunks.forEach((chunk, i) => message.channel.send(`\`\`\`${chunk}\`\`\``))
                }
            });
        }
    },
};
