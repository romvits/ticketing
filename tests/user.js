import sha256 from 'sha256';
import md5 from 'md5';

function cryptPassword(UserPassword) {
	return (md5(sha256(UserPassword)));
}


class User {
	constructor() {
		socketClient.on('user-login', (res) => {
			console.log('user-login', res);
		});

		socketClient.on('user-login-err', (res) => {
			console.log('user-login-err', res);
		});

		socketClient.on('user-logout', (res) => {
			console.log('user-logout', res);
		});
	}

	login() {
		let req = {'UserEmail': 'admin@admin.tld', 'UserPassword': cryptPassword('admin')};
		socketClient.emit('user-login', req);
	}

	loginErrorUsername() {
		let req = {'UserEmail': 'error@error.tld', 'UserPassword': cryptPassword('error')};
		socketClient.emit('user-login', req);
	}

	loginErrorPassword() {
		let req = {'UserEmail': 'admin@admin.tld', 'UserPassword': cryptPassword('error')};
		socketClient.emit('user-login', req);
	}

	loginToken() {
		let token = null;
		let socketClient = require('socket.io-client')('http://localhost');
		socketClient.on('user-logout-token', (token) => {
			console.log('user-logout-token', token);
			socketClient.emit('user-logout-token', token);
		});
		socketClient.on('user-logout', (res) => {
			console.log('user-logout', res);
		});
		let req = {'UserEmail': 'admin@admin.tld', 'UserPassword': cryptPassword('admin')};
		socketClient.emit('user-login', req);
	}

	logout() {
		socketClient.emit('user-logout');
	}

	create() {
	}
}

module.exports = User;

