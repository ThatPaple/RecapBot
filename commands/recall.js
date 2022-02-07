const { Discord, Util } = require('discord.js');
const { colors, permissionLevels } = require('../utils/config.json');
const db = require('../handler/databaseHandler.js');

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
            db.recallRecap(args[0], message)
        }
    },
};
