import Socket from '../../socket';
import _ from 'lodash';
import sha256 from 'sha256';
import md5 from 'md5';

function cryptPassword(UserPassword) {
	return (md5(sha256(UserPassword)));
}

class UserLgoin extends Socket {

	constructor() {
		super();

		const runtime = 10000;
		setTimeout(() => {
			process.exit(0);
		}, runtime);

		setTimeout(() => {
			this.login();
		}, this.randTimeout() + 500);

		setTimeout(() => {
			this.logout();
		}, this.randTimeout() + 5000);


		this.socketClient[0].on('user-login', (res) => {
			console.log(this._splitter);
			console.log('user-login', res);
		});

		this.socketClient[0].on('user-login-err', (res) => {
			console.log(this._splitter);
			console.log('user-login-err', res);
		});

		this.socketClient[0].on('user-login-token', (res) => {
			console.log(this._splitter);
			console.log('user-login-token', res);
		});

		this.socketClient[0].on('user-logout', (res) => {
			console.log(this._splitter);
			console.log('user-logout', res);
		});


	}

	login() {
		const req = {'UserEmail': 'admin@admin.tld', 'UserPassword': cryptPassword('admin')};
		this.socketClient[0].emit('user-login', req);
	}

	logout() {
		this.socketClient[0].emit('user-logout');
	}

}

const userLogin = new UserLgoin();
