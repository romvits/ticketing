import Socket from '../../socket';
import _ from 'lodash';
import sha256 from 'sha256';
import md5 from 'md5';

function cryptPassword(UserPassword) {
	return (md5(sha256(UserPassword)));
}

class User extends Socket {

	constructor() {
		super();

		const runtime = 60000;
		setTimeout(() => {
			process.exit(0);
		}, runtime);

		console.log('test runtime ' + runtime);

		this.socketClient[0].on('user-login', (res) => {
			console.log(this._splitter);
			console.log('user-login', res);
		});

		this.socketClient[0].on('user-login-err', (res) => {
			console.log(this._splitter);
			console.log('user-login-err', res);
		});

		this.socketClient[0].on('user-logout', (res) => {
			console.log(this._splitter);
			console.log('user-logout', res);
		});

		this.socketClient[0].on('user-login-token', (res) => {
			console.log(this._splitter);
			console.log('user-login-token', res);
		});

		this.socketClient[0].on('user-create', (res) => {

			console.log(this._splitter);
			console.log('user-create', res);

			let id = (res && res.data) ? _.clone(res.data.UserID) : null;

			setTimeout(() => {
				this.create(); // create again with same data (results in error => user with email-address 'test1.test1@test1.at' already exists)
			}, this.randTimeout() + 250);

			setTimeout(() => {
				this.fetch(id);
			}, this.randTimeout() + 500);

			setTimeout(() => {
				this.update(id);
			}, this.randTimeout() + 1000);

			setTimeout(() => {
				this.fetch(id);
			}, this.randTimeout() + 1500);

			setTimeout(() => {
				// this.delete(id);
			}, this.randTimeout() + runtime - 5000);

		});

		this.socketClient[0].on('user-create-err', (res) => {
			console.log(this._splitter);
			console.log('user-create-err', res);
		});

		this.socketClient[0].on('user-fetch', (res) => {
			console.log(this._splitter);
			console.log('user-fetch', res);
		});

		this.socketClient[0].on('user-update', (res) => {
			console.log(this._splitter);
			console.log('user-update', res);
		});

		this.socketClient[0].on('user-delete', (res) => {
			console.log(this._splitter);
			console.log('user-delete', res);
		});

		setTimeout(() => {
			this.loginErrorPassword();
		}, 250);

		setTimeout(() => {
			this.loginErrorUsername();
		}, 500);

		setTimeout(() => {
			this.login();
		}, 1000);

		setTimeout(() => {
			this.logout();
		}, 1500);

		setTimeout(() => {
			this.login();
		}, 1550);

		setTimeout(() => {
			this.loginToken();
		}, 1700);

		this.create();

	}

	create() {
		const req = {
			'UserType': null,
			'UserEmail': 'test1.test1@test1.at',
			'UserLangCode': 'de-at',
			'UserCompany': 'Company 1',
			'UserCompanyUID': 'AT Test 1',
			'UserGender': 'm',
			'UserTitle': 'Dr.',
			'UserFirstname': 'First Name 1',
			'UserLastname': 'Last Name 1',
			'UserStreet': 'Street 1',
			'UserCity': 'City 1',
			'UserZIP': '1234',
			'UserCountryCountryISO2': 'AT',
			'UserPassword': cryptPassword('abcdefg1'),
			'UserPasswordCheck': cryptPassword('abcdefg1')
		};
		this.socketClient[0].emit('user-create', req);
	}

	fetch(id) {
		this.socketClient[0].emit('user-fetch', id);
	}

	update(id) {
		const req = {};
		this.socketClient[0].emit('user-update', req);
	}

	delete(id) {
		this.socketClient[0].emit('user-delete', id);
	}

	login() {
		const req = {'UserEmail': 'admin@admin.tld', 'UserPassword': cryptPassword('admin')};
		this.socketClient[0].emit('user-login', req);
	}

	loginErrorUsername() {
		const req = {'UserEmail': 'error@error.tld', 'UserPassword': cryptPassword('error')};
		this.socketClient[0].emit('user-login', req);
	}

	loginErrorPassword() {
		const req = {'UserEmail': 'admin@admin.tld', 'UserPassword': cryptPassword('error')};
		this.socketClient[0].emit('user-login', req);
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
		this.socketClient[0].emit('user-logout');
	}

}

const user = new User();

