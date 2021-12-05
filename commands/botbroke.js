const { Discord, Util } = require('discord.js');
const { colors, recapChannelID, permissionLevels } = require('../utils/config.json');

module.exports = {
    name: 'botbroke',
    description: 'Report error',
    aliases: [],
    guildOnly: false,
    args: false,
    argList: [],
    usage: '[number of messages]',
    execute: async (message, args, client) => {
        if (message.member.roles.cache.has(`${permissionLevels.moderator}`) || message.member.roles.cache.has(`${permissionLevels.testing}`)) {

            const me = client.users.cache.get('630473266166890517')
            if (!me) return;
                    parser = args.join(" ").toString()
                    me.send(`${parser}\n<https://panel.pebblehost.com/server>\nReport submitted by : ${message.author.tag}`)
                    message.reply(`Paps has been notified.`)
        }
    },
};
