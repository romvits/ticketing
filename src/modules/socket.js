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
			this.emit('connected');
			this._log('connected ');

			client.on('event', (req) => {
				log.msg(logPrefix, req);
				client.database = new Database(req.action, req.data);
				client.database.on('event', (res) => {
					client.emit('event', {'action': res.action, data: res.data});
				});
				client.database.on('err', (err) => {
					client.emit('err', err);
				});
				client.database.query();
			});

			client.on('disconnect', () => {
				this._clients--;
				this.emit('disconnected', client);
				this._log('disconnected ');
			});
		});
	}

	send(id, message) {
		console.log(id);
		//console.log(message);
	}

	_log(message) {
		log.msg(logPrefix, message + ' ' + this._clients + ' client(s) connected');
	}
};

module.exports = Socket;
