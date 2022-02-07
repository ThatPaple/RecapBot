const { Discord, Util, StickerPack } = require('discord.js');
const currentRecap = "data/currentRecap.csv";
const { colors, permissionLevels } = require('../utils/config.json');
const db = require('../handler/databaseHandler.js');

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
            db.deleteRecap(args[0], message)
        }
    },
};
