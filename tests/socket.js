import sha256 from 'sha256';
import md5 from 'md5';

function cryptPassword(UserPassword) {
	return (md5(sha256(UserPassword)));
}

class Socket {

	constructor(count = 1) {
		this._splitter = '==================================================================';
		this.socketClient = [];
		for (var i = 0; i < count; i++) {
			this.socketClient[i] = require('socket.io-client')('http://www.localhost.int');

			this.socketClient[i].on('user-login', (res) => {
				console.log(this._splitter);
				console.log('user-login');
				console.log(res);
			});

			this.socketClient[i].on('user-login-err', (res) => {
				console.log(this._splitter);
				console.log('user-login-err');
				console.log(res);
			});

			// set intern (for admin and promoter only!)
			this.socketClient[i].on('set-intern', (res) => {
				console.log(this._splitter);
				console.log('set-intern');
				console.log(res);
			});
			this.socketClient[i].on('set-intern-err', (res) => {
				console.log(this._splitter);
				console.log('set-intern-err');
				console.log(res);
			});

			// event
			this.socketClient[i].on('set-event', (res) => {
				console.log(this._splitter);
				console.log('set-event');
				console.log(res);
			});
			this.socketClient[i].on('set-event-err', (res) => {
				console.log(this._splitter);
				console.log('set-event-err');
				console.log(res);
			});
			this.socketClient[i].on('shopping-cart-update-event', (res) => {
				console.log(this._splitter);
				console.log('update-event');
				console.log(res);
			});
		}
	}

	randTimeout() {
		var min = 0;
		var max = 1000;
		var random = Math.floor(Math.random() * (+max - +min)) + +min;
		return random;
	}

	login(eMail, PW) {
		const req = {'UserEmail': eMail, 'UserPassword': cryptPassword(PW)};
		this.socketClient[0].emit('user-login', req);
	}

	logout() {
		this.socketClient[0].emit('user-logout');
	}

	setIntern(state) {
		this.socketClient[0].emit('set-intern', state);
	}

	setEvent(EventSubdomain) {
		this.socketClient[0].emit('set-event', EventSubdomain);
	}


}

module.exports = Socket;
