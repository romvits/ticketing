import io from 'socket.io';
import RmLog from "rm-log";
import EventEmitter from 'events';
import _ from 'lodash';

const log = new RmLog();

class Socket extends EventEmitter {
	constructor(server) {
		super();
		this._clients = 0;
		this.io = io(server);
		this.io.on('connection', client => {
			this._clients++;
			this.emit('connected', client);
			log.msg("SOCKET ", 'client connected ' + this._clients);
			client.on('event', data => {
				log.msg("SOCKET ", data);
			});
			client.on('disconnect', () => {
				this._clients--;
				this.emit('disconnected');
				log.msg("SOCKET ", 'client disconnected ' + this._clients);
			});
		});
	}

	send(id, message) {
		console.log(id);
		//console.log(message);
	}
};

module.exports = Socket;
