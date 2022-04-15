const { Precondition } = require('@sapphire/framework');

class InTextChannelPrecondition extends Precondition {
	run(message) {
		return message.channel.type === 'GUILD_TEXT'
			? this.ok()
			: this.error({
					message: 'This command only works in text channels.'
			  });
	}
}

module.exports = {
	InTextChannelPrecondition
};
