const ascii = require('ascii-table');
const commandCheck = require('./../utils/commandCheck');
const table = new ascii().setHeading('command', 'Load Status');

module.exports = (err, files, client) => {
	if (err) return console.error(err);
	// searches through /commands dir and adds them to the command collection.
	files.forEach((file, index) => {
		const command = require(`./../commands/${file}`);
		if (commandCheck(command.name, command)) {
			if (command.name) {
				client.commands.set(command.name, command);
				table.addRow(command.name, 'LOADED');
				if (command.aliases && Array.isArray(command)) {
					command.aliases.foreach((alias) =>
						client.aliases.set(alias, command.name),
					);
				}
			}
			else {
				table.addRow(command.name, 'FAILED TO LOAD');
			}
		}
		if (index == (files.length - 1)) console.log(table.toString());
	});
};