const path = require('path');

module.exports = {
	name: 'ready',
	once: true,
	execute(client) {
		console.log(`Let's roll! -${client.user.tag}`);
	},
};