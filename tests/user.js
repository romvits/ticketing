import sha256 from 'sha256';
import md5 from 'md5';

function cryptPassword(UserPassword) {
	return (md5(sha256(UserPassword)));
}


class User {
	constructor() {
		socketClient.on('user-login', (res) => {
			console.log('user-login');
			console.log(res);
		});

		socketClient.on('user-logout', (res) => {
			console.log('user-logout');
			console.log(res);
			process.exit(1);
		});
	}

	login() {
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

