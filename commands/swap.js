const { Discord, Util } = require('discord.js');
const { colors, permissionLevels } = require('../utils/config.json');
const db = require('../handler/databaseHandler.js');

module.exports = {
    name: 'swap',
    description: 'Swap recap positions',
    aliases: [],
    guildOnly: false,
    args: false,
    argList: [''],
    usage: '[ID] [ID]',
    execute: (message, args, client) => {
        if (message.member.roles.cache.has(`${permissionLevels.moderator}`) || message.member.roles.cache.has(`${permissionLevels.testing}`)) {
                db.swapRecap(args[0], args[1], message);
        }
    }
}
