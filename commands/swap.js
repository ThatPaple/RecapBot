const { Discord, Util } = require('discord.js');
const fs = require('fs');
const currentRecap = "data/currentRecap.csv";
const { colors, permissionLevels } = require('../utils/config.json');
var parse = require('csv-parse');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
// const { SSL_OP_ALLOW_UNSAFE_LEGACY_RENEGOTIATION } = require('constants');

module.exports = {
    name: 'swap',
    description: 'Swap recap positions',
    aliases: [],
    guildOnly: false,
    args: false,
    argList: [''],
    usage: '[ID] [ID]',
    execute: (message, args, client) => {
        if (message.member.roles.cache.has(`${permissionLevels.moderator}`)) {
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

                   try {

                    if (Number(args[0]) < Number(id) && Number(args[1]) < Number(id)) {                

                        csvData[args[0]][0] = args[1];
                        csvData[args[1]][0] = args[0];
                        

                        fs.truncate(`${currentRecap}`, 0, function (err) {
                            if (err) throw err;
                        })

                        csvData.sort(function (a, b) {
                            return a[0] - b[0];
                        });

                     for (let i = 0; i < csvData.length; i++) {
                        appendData(csvData[i][0], csvData[i][1], csvData[i][2], csvData[i][3])
                        }
                        message.reply("Swapping successful!")

                    } else {
                        return message.reply(`Index out of bounds : Allowed index between 0 - ${id - 1}.`)
                    }
                } catch (error) {
                       console.log(error)
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