/*
CommandDenied Listener works with preconditions.
If the precondition returns true, the command will be denied and then executed as a deny here.
If the command has a silent text set up, it will be checked on line 12 and as such, the deny
won't return a message.
*/

const { Listener } = require('@sapphire/framework');

class CommandDeniedListener extends Listener {
	run(error, { message }) {
		if (Reflect.get(Object(error.context), 'silent')) return;
		return message.channel.send(error.message);
	}
}

module.exports = {
	CommandDeniedListener
};
