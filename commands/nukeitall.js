const { Discord, Util, StickerPack } = require('discord.js');
const fs = require('fs');
const currentRecap = "data/currentRecap.csv";
const { colors, permissionLevels } = require('../utils/config.json');
var parse = require('csv-parse');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;

module.exports = {
    name: 'nukeitall',
    description: 'Primes a new recap file and stores current as a random ID',
    aliases: [],
    guildOnly: false,
    args: false,
    argList: [''],
    usage: 'iunderstandtheconsequences',
    execute: (message, args, client) => {
        if (message.member.roles.cache.has(`${permissionLevels.owner}`) || message.member.roles.cache.has(`${permissionLevels.testing}`)){
        var csvData = [];

        try {
            const data = fs.readFileSync('data/id', 'utf8')
            id = data;
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
                    if (args[0] == "iunderstandtheconsequences") {
                        newname = (Math.random() + 1).toString(36).substring(7)
                        fs.copyFile('./data/currentRecap.csv', `./old/${newname}.csv`, (err) => {
                            if (err) throw err;
                            message.reply(`File has been saved as : ${newname}\nLocation : \`\`./old/${newname}.csv\`\``)
                          });

                        fs.truncate(`${currentRecap}`, 0, function (err) {
                            if (err) throw err;
                        })

                        fs.writeFile('data/id', `0`, err => {
                            if (err) {
                                console.error(err)
                                return
                            }
                        })

                    } else {
                        return message.reply("You need to type \"iunderstandtheconsequences\" as an argument! ")
                    }
                
            });
        } else {
            message.reply("You do not have the permissions to run this command!")
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