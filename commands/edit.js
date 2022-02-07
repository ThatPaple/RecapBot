const { Discord, Util } = require('discord.js');
const currentRecap = "data/currentRecap.csv";
const { colors, permissionLevels } = require('../utils/config.json');
const db = require('../handler/databaseHandler.js');

module.exports = {
    name: 'edit',
    description: 'Edit recap entries',
    aliases: [],
    guildOnly: false,
    args: false,
    argList: [''],
    usage: '[ID] <link> [new entry OR link]',
    execute: (message, args, client) => {
        if (message.member.roles.cache.has(`${permissionLevels.moderator}`) || message.member.roles.cache.has(`${permissionLevels.testing}`)) {

            if (args[1] == "link") {
                db.editRecap(args[0], true, linkCol(args), message);
            } else {
                let temp = `${args.slice(1).join(" ")}`;
                db.editRecap(args[0], false, temp, message)
            }
        }
    },
};

function linkCol(args) {
    link = "";
    for (i = 0; i <= args.length - 1; i++) {
        if (args[i].includes("https://") || args[i].includes("http://")) {
            link = link + "> " + "<" + args[i] + ">" + "\n";
        }
    }
    return link;
}
