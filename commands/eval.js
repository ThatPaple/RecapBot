const { colors, permissionLevels } = require('../utils/config.json');
const db = require('../handler/databaseHandler.js');
module.exports = {
    name: 'eval',
    description: 'Run DB / Node commands',
    aliases: [],
    guildOnly: false,
    args: false,
    argList: [],
    usage: '',
    execute: async (message, args, client) => {
        if (message.member.roles.cache.has(`${permissionLevels.owner}`) || (message.member.roles.cache.has(`${permissionLevels.testing}`))) {
            if (args[0] == "node") {
                try {
                    args[0] = "";
                    const evaled = eval(args.join(" "));
                    const cleaned = await clean(evaled);
                    message.channel.send(`\`\`\`js\n${cleaned}\n\`\`\``);
                } catch (err) {
                    message.reply(`\`Error :: \` \`\`\`xl\n${err}\n\`\`\``);
                }
            } else if (args[0] == "db") {
                args[0] = "";
                const evaled = args.join(" ");
                const cleaned = await clean(evaled);
                db.databaseEval(cleaned, message);
            } else {
                message.reply("Error :: You need to select eval mode!")

            }
        }
    },
};

const clean = async (text) => {
    if (text && text.constructor.name == "Promise")
        text = await text;
    if (typeof text !== "string")
        text = require("util").inspect(text, { depth: 1 });

    text = text
        .replace(/`/g, "`" + String.fromCharCode(8203))
        .replace(/@/g, "@" + String.fromCharCode(8203));

    return text;
}