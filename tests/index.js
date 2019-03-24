import User from './user';
import Order from './order';

global.socketClient = require('socket.io-client')('http://localhost');
socketClient.on('connect', () => {
});

class Tests {
	constructor() {
		this.runUser();
	}

	runUser() {
		let user = new User();
		user.login();
		setTimeout(() => {
			user.logout();
		}, 10000);
	}

	runOrder() {

	}
}

new Tests();
