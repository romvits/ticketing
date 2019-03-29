import User from './user';
import Order from './order';

global.socketClient = require('socket.io-client')('http://localhost');

class Tests {
	constructor() {
		this.runSocketConnection();
		this.runUser();

		setTimeout(() => {
			process.exit(1);
		}, 30000);

	}

	runSocketConnection() {
		let socketClients = [];
		let counter = 1000;
		for (var i = 0; i < 5; i++) {
			setTimeout(() => {
				socketClients[i] = require('socket.io-client')('http://localhost');
				setTimeout(() => {
					socketClients[i].emit('set-language', {'LangCode': 'de-ch'});
				}, 500);
			}, counter);
			counter = counter + (Math.floor(Math.random() * 50) + 500);
			console.log('connect in ' + counter + ' ms');
		}
	}

	runUser() {
		let user = new User();

		user.loginErrorUsername();
		setTimeout(() => {
			user.loginErrorPassword();
		}, 500);
		setTimeout(() => {
			user.login();
		}, 1000);
		setTimeout(() => {
			user.logout();
		}, 1500);
		setTimeout(() => {
			user.login();
		}, 1550);
		setTimeout(() => {
			user.loginToken();
		}, 1700);
	}

	runOrder() {

	}
}

new Tests();
