import io from 'socket.io';
import RmLog from "rm-log";
import EventEmitter from 'events';
import Database from './database';
import _ from 'lodash';

const log = new RmLog({'datePattern': 'yyyy/mm/dd HH:MM:ss'});
const logPrefix = 'SOCKET  ';

class Socket extends EventEmitter {
	constructor(server) {
		super();
		this._clients = 0;
		this.io = io(server);
		this.io.on('connection', client => {
			this._clients++;
			this.emit('connected', client);
			log.msg(logPrefix, 'connected id ');
			this._logCount();
			client.on('event', data => {
				log.msg(logPrefix, data);
				let database = new Database();
				client.emit('event', data);
			});
			client.on('disconnect', () => {
				this._clients--;
				client.emit('disconnected');
				log.msg(logPrefix, 'disconnected id ');
				this._logCount();
			});
		});
	}

	send(id, message) {
		console.log(id);
		//console.log(message);
	}

	_logCount() {
		log.msg(logPrefix, this._clients + ' client(s) connected');
	}
};

module.exports = Socket;
