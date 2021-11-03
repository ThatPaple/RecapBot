const { Channel, Message, ThreadManager, ThreadChannel } = require("discord.js");
const fs = require('fs')
const bannedWords = "data/bannedWords.txt";

module.exports = {
    event: 'threadCreate',
    once: false,
    run(client, message) {

    },
};


