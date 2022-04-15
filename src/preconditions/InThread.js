const { Precondition } = require('@sapphire/framework');

class InThreadChannelPrecondition extends Precondition {
	run(message) {
		return message.channel.type === 'GUILD_PRIVATE_THREAD' || message.channel.type === 'GUILD_PUBLIC_THREAD'
			? this.ok()
			: this.error({
					message: 'This command only works in thread channels.'
			  });
	}
}

module.exports = {
	InThreadChannelPrecondition
};
