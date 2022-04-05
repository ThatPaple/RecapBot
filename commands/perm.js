const { colors, permissionLevels } = require('../utils/config.json');
const db = require('../handler/databaseHandler.js');
const { MessageEmbed } = require('discord.js')
const pool = require('../handler/mysqlConnector')
const prettyMilliseconds = require('pretty-ms');

module.exports = {
    name: 'perm',
    description: 'Permission management',
    aliases: ["permission"],
    guildOnly: false,
    args: true,
    argList: ["add", "remove", "clear"],
    usage: 'perm <add|remove|clear> channel <member> permission',
    execute: async (message, args, client) => {
        if (message.member.roles.cache.has(`${permissionLevels.moderator}`) || message.member.roles.cache.has(`${permissionLevels.testing}`)) {
            let allowedLen = 3
            if (args[0] === 'clear')
                allowedLen = 2

            // --------------------  checkers  --------------------
            if (args.length <= allowedLen)
                return message.reply("Missing arguments!\n``rc.help perm``")

            if (args.length > allowedLen + 1) return;

            var subcommand = args[0]
            var tagChannel = args[1].replace("<#", "").replace(">", "")
            var member = args[2].replace("<@", "").replace("!", "").replace(">", "")
            if (allowedLen == 3) var permission = args[3].toUpperCase()

            if (!(subcommand === "add" || subcommand === "clear" || subcommand === "remove"))
                return message.reply("Unknown sub-command.\n``rc.help perm``")

            foundChannel = client.channels.cache.find(channel => channel.id === `${tagChannel}`)
            permList = ["ADD_REACTIONS", "PRIORITY_SPEAKER", "STREAM", "VIEW_CHANNEL", "SEND_MESSAGES", "EMBED_LINKS", "ATTACH_FILES", "READ_MESSAGE_HISTORY", "USE_EXTERNAL_EMOJIS", "CONNECT", "SPEAK", "USE_VAD", "REQUEST_TO_SPEAK", "USE_PUBLIC_THREADS", "CREATE_PUBLIC_THREADS", "USE_PRIVATE_THREADS", "CREATE_PRIVATE_THREADS", "USE_EXTERNAL_STICKERS", "SEND_MESSAGES_IN_THREADS", "START_EMBEDDED_ACTIVITIES"];

            foundChannel = client.channels.cache.find(channel => channel.id === `${tagChannel}`)

            if (subcommand === 'clear') {
                foundChannel.permissionOverwrites.delete(member, "Cleared channel overrides").catch(console.error);
                return message.reply(`Cleared ${foundChannel} permissions for <@${member}>`)
            }

            if (!foundChannel)
                return message.reply("Channel does not exist!")

            message.reply(`perm : ${foundChannel.permissionsFor(message.author.id).has(permission)}`)
            if (foundChannel.permissionsFor(message.author.id).has(permission) === false)
                return message.reply(`You yourself do not have \`\`${permission}\`\` permission witin ${foundChannel}`)

            if (!permList.includes(permission.toUpperCase()))
                return message.reply(`Unknown permission.\nList of permissions here:\n\`\`\`${permList.toString().replaceAll(',', '\n')}\`\`\``)

            // --------------------  func  --------------------

            if (subcommand === 'add') {
                foundChannel.permissionOverwrites.edit(member, {
                    [permission]: true,
                }).catch(console.error);
                return message.reply(`${subcommand === 'add' ? "Added" : "Removed"} permission \`\`${permission}\`\` for <@${member}> in ${foundChannel}`)
            }

            if (subcommand === "remove") {
                foundChannel.permissionOverwrites.edit(member, {
                    [permission]: false,
                }).catch(console.error);
                return message.reply(`${subcommand === 'add' ? "Added" : "Removed"} permission \`\`${permission}\`\` for <@${member}> in ${foundChannel}`)
            }
        }
    },
};
