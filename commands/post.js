const { Discord, Util } = require('discord.js');
const { colors, recapChannelID, permissionLevels } = require('../utils/config.json');
const db = require('../handler/databaseHandler.js');
module.exports = {
    name: 'post',
    description: 'Post todays recap',
    aliases: [],
    guildOnly: false,
    args: false,
    argList: [],
    usage: '',
    execute: async (message, args, client) => {
        if (message.member.roles.cache.has(`${permissionLevels.moderator}`) || message.member.roles.cache.has(`${permissionLevels.testing}`)) {
            db.postRecap(message);
        }
    },
};
