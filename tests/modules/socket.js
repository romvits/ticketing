class Socket {
	constructor(count = 1) {
		this._splitter = '==================================================================';
		this.socketClient = [];
		for (var i = 0; i < count; i++) {
			this.socketClient[i] = require('socket.io-client')('http://localhost');
		}
	}

	randTimeout() {
		var min = 100;
		var max = 999;
		var random = Math.floor(Math.random() * (+max - +min)) + +min;
		return random;
	}
}

module.exports = Socket;
