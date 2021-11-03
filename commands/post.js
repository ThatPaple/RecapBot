const { Discord, Util } = require('discord.js');
const fs = require('fs');
const currentRecap = "data/currentRecap.csv";
const { colors, recapChannelID, allowedRole } = require('../utils/config.json');
var parse = require('csv-parse');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;

module.exports = {
    name: 'post',
    description: 'Post todays recap',
    aliases: [],
    guildOnly: false,
    args: false,
    argList: [],
    usage: '',
    execute: async (message, args, client) => {
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
                let clean = "";
                for (let i = 0; i < csvData.length; i++) {
                    if (Number(csvData[i][3]) == 0) {
                        clean = clean + `${csvData[i][1]}\n${csvData[i][2]}\n`
                    }
                }

                if (clean.length > 0) {
                    //Posts recap into recap channel
                    message.guild.channels.cache.get(`${recapChannelID}`).send(`**Daily Recap ${new Date()}**`)
                    const chunks = Util.splitMessage(clean);
                    async function post() {
                        return await chunks.forEach((chunk, i) => message.guild.channels.cache.get(`${recapChannelID}`).send(chunk));
                    };
                    post().then(message.reply("Recap has been posted. Please wait for cleanup confirmation."))



                    fs.truncate(`${currentRecap}`, 0, function (err) {
                        if (err) throw err;
                    });

                    for (let i = 0; i < csvData.length; i++) {
                        csvData[i][3] = 1;
                        appendData(csvData[i][0], csvData[i][1], csvData[i][2], csvData[i][3])
                    }
                    message.reply(":soap: Everything has been prepared for tomorrow.")



                } else {
                    message.reply("There is nothing to be posted.")

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