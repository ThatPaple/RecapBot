const { Discord, Util } = require('discord.js');
const fs = require('fs');
const currentRecap = "data/currentRecap.csv";
const { colors, recapChannelID, permissionLevels } = require('../utils/config.json');
var parse = require('csv-parse');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;

module.exports = {
    name: 'purge',
    description: 'Clean todays recap',
    aliases: [],
    guildOnly: false,
    args: false,
    argList: [],
    usage: '',
    execute: async (message, args, client) => {
        if (message.member.roles.cache.has(`${permissionLevels.moderator}`) || message.member.roles.cache.has(`${permissionLevels.testing}`)) {
        var csvData = [];
        fs.createReadStream(currentRecap)
            .pipe(parse({ delimiter: ',' }))
            .on('data', function (csvrow) {
                csvData.push(csvrow);
            })
            .on('end', function () {

                fs.truncate(`${currentRecap}`, 0, function (err) {
                    if (err) throw err;
                });


                csvData.sort(function (a, b) {
                    return a[0] - b[0];
                });


                for (let i = 0; i < csvData.length; i++) {
                    if (Number(csvData[i][3]) == 0) {
                        csvData[i][3] = 1;
                        appendData(csvData[i][0], csvData[i][1], csvData[i][2], csvData[i][3])
                    } else {
                        appendData(csvData[i][0], csvData[i][1], csvData[i][2], csvData[i][3])
                    }
                }
                message.reply(":soap: Everything has been cleanaed.")
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