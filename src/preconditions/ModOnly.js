const { Precondition } = require('@sapphire/framework');
const { permissionLevels } = require('../../config.json');
class ModOnlyPrecondition extends Precondition {
	run(message) {
		return message.member.roles.cache.has(`${permissionLevels.moderator}`)
			? this.ok()
			: this.error({
					message: 'You do not have permissions to run this command.',
					//context: { silent: true }
			  });
	}
}

module.exports = {
	ModOnlyPrecondition
};
