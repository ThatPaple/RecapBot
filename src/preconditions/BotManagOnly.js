const { Precondition } = require('@sapphire/framework');
const { permissionLevels } = require('../../config.json');
class BotManagOnlyPrecondition extends Precondition {
	run(message) {
		return message.member.roles.cache.has(`${permissionLevels.botManagement}`)
			? this.ok()
			: this.error({
					message: 'This command can be executed by Bot Managers only',
					context: { silent: true }
			  });
	}
}

module.exports = {
	BotManagOnlyPrecondition
};
