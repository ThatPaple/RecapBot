const { Precondition } = require('@sapphire/framework');
const { permissionLevels } = require('../../config.json');
class TestingOnlyPrecondition extends Precondition {
	run(message) {
		return message.member.roles.cache.has(`${permissionLevels.testing}`)
			? this.ok()
			: this.error({
					message: 'This command is not accessible outside of the test server.'
			  });
	}
}

module.exports = {
	TestingOnlyPrecondition
};
