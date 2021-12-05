const { Discord, Util, StickerPack } = require('discord.js');
const fs = require('fs');
const currentRecap = "data/currentRecap.csv";
const { colors, permissionLevels } = require('../utils/config.json');
var parse = require('csv-parse');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;

module.exports = {
    name: 'delete',
    description: 'Delete recap',
    aliases: [],
    guildOnly: false,
    args: false,
    argList: [''],
    usage: '[ID] confirm',
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
                if (Number(args[0]) < Number(id)) {
                    if (args[1] == "confirm") {
                        fs.truncate(`${currentRecap}`, 0, function (err) {
                            if (err) throw err;
                        })
                        for (let i = 0; i < csvData.length; i++) {
                            if(Number(csvData[i][0]) == args[0]){
                            }
                            if (Number(csvData[i][0]) > args[0] && Number(csvData[i][0]) != args[0]) {
                                appendData(Number(csvData[i][0])-1, csvData[i][1], csvData[i][2], csvData[i][3])
                            } else if(Number(csvData[i][0]) < args[0] && Number(csvData[i][0]) != args[0]){
                                appendData(csvData[i][0], csvData[i][1], csvData[i][2], csvData[i][3])
                            }
                        }


                        fs.writeFile('data/id', `${Number(id) - 1}`, err => {
                            if (err) {
                                console.error(err)
                                return
                            }
                        })

                        message.reply(`You have deleted entry with ID ${args[0]} !`)

                    } else {
                        return message.reply("You need to type \"confirm\" after the ID! ")

                    }
                } else {
                    return message.reply(`Index out of bounds : Allowed index between 0 - ${id - 1}.`)
                }
            });
        }
    },
};

async function appendData(id, recap, link, posted) {
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

    csvWriter
        .writeRecords(data)
}