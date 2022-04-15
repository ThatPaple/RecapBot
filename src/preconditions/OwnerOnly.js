const { Precondition } = require('@sapphire/framework');
const { permissionLevels } = require('../../config.json');
class OwnerOnlyPrecondition extends Precondition {
	run(message) {
		return message.author.id === (permissionLevels.paple || permissionLevels.martin) 
			? this.ok()
			: this.error({
					message: 'Only the bot owner can use this command!',
					context: { silent: true }
			  });
	}
}

module.exports = {
	OwnerOnlyPrecondition
};
