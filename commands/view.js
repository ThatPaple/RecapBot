const { Discord, Util } = require('discord.js');
const { colors, permissionLevels } = require('../utils/config.json');
const db = require('../handler/databaseHandler.js');

module.exports = {
    name: 'view',
    description: 'View current recap file',
    aliases: [],
    guildOnly: false,
    args: false,
    argList: ['all'],
    usage: '',
    execute: (message, args, client) => {
        if (message.member.roles.cache.has(`${permissionLevels.moderator}`) || message.member.roles.cache.has(`${permissionLevels.testing}`)) {

            if (args[0] == "all") {
                db.viewRecap("all", "none", message) // View all recap
            } else {
                db.viewRecap("today", "none", message) // View today's recap
            }
        }
    },
};