const { Discord, Util } = require('discord.js');
const fs = require('fs');
const currentRecap = "data/currentRecap.csv";
const { colors, allowedRole } = require('../utils/config.json');
var parse = require('csv-parse');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;

module.exports = {
    name: 'edit',
    description: 'Edit recap entries',
    aliases: [],
    guildOnly: false,
    args: false,
    argList: [''],
    usage: '[ID] <link> [new entry OR link]',
    execute: (message, args, client) => {
        if (message.member.roles.cache.has(`${allowedRole}`)) {
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

                    var link = "";

                    if (args[0] < csvData.length) {
                        if (args[1] == "link") {
                            for (i = 0; i <= args.length-1; i++) {
                                if (args[i].includes("https://") || args[i].includes("http://")) {
                                    link = link + "> " + "<" + args[i] + ">" + "\n";
                                }
                                csvData[args[0]][2] = link;
                            }
                        } else {
                            csvData[args[0]][1] = `⁃ ${args.slice(1).join(" ")}`;
                        }

                        fs.truncate(`${currentRecap}`, 0, function (err) {
                            if (err) throw err;
                        });

                        for (let i = 0; i < csvData.length; i++) {
                            appendData(csvData[i][0], csvData[i][1], csvData[i][2], csvData[i][3])
                        }
                        message.reply("Edits were successful!")

                    } else {
                        return message.reply(`Index out of bounds : Allowed index between 0 - ${csvData.length - 1}.`)
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