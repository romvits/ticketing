class Socket {
	constructor(count = 1) {
		this._splitter = '===============================================================================';
		this.socketClient = [];
		for (var i = 0; i < count; i++) {
			this.socketClient[i] = require('socket.io-client')('http://localhost');
		}
	}
}

module.exports = Socket;
