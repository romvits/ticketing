import User from './user';
import Floor from './floor';
import Order from './order';

global.socketClient = require('socket.io-client')('http://localhost');

class Tests {
	constructor() {
		//this.runSocketConnection();
		//this.runUser();
		this.runFloor();

		setTimeout(() => {
			process.exit(0);
		}, 60000);

	}

	runSocketConnection() {
		let socketClients = [];
		let counter = 1000;
		for (var i = 0; i < 5; i++) {
			setTimeout(() => {
				socketClients[i] = require('socket.io-client')('http://localhost');
				setTimeout(() => {
					socketClients[i].emit('set-language', 'de-ch');
				}, 500);
				setTimeout(() => {
					socketClients[i].emit('user-logout');
				}, counter * 3);

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

	runFloor() {
		let floor = new Floor();
		floor.create({
			'FloorEventID': null,
			'FloorLocationID': null,
			'FloorName': 'FloorName',
			'FloorSVG': 'SVG'
		});
	}

	runOrder() {

	}
}

new Tests();
