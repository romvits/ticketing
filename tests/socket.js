class Socket {
	constructor(count = 1) {
		this._splitter = '==================================================================';
		this.socketClient = [];
		for (var i = 0; i < count; i++) {
			this.socketClient[i] = require('socket.io-client')('http://demo01.localhost.int');
		}
	}

	randTimeout() {
		var min = 0;
		var max = 2500;
		var random = Math.floor(Math.random() * (+max - +min)) + +min;
		return random;
	}
}

module.exports = Socket;
