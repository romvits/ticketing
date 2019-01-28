import mysql from 'mysql';
import io from 'socket.io';
import numeral from 'numeral';
import _ from 'lodash';

// import actions
import ActionLogin from './actions/login';
import ActionMockData from './actions/mock_data';

//import List from './actions/list';
//import ListContent from './actions/list_content';

const logPrefix = 'SOCKET  ';

class Socket {
	constructor(settings) {

		this._clients = 0;

		this._log = settings.log;
		this._config = settings.config;

		this._db = mysql.createPool(this._config.db.pool);
		this._io = io(settings.http);

		this._io.on('connection', client => {

			this._clients++;

			this._logMessage(client, 'client connected', {
				'id': client.id,
				'handshake': client.handshake
			});

			client.on('disconnect', () => {
				this._clients--;
				this._logMessage(client, 'client disconnected');
			});

			client.on('register', (req) => {
				client.type = req.type;
				this._logMessage(client, 'register', req);
			});

			client.on('login', (req) => {
				this._logMessage(client, 'login', req);
				this._db.getConnection((err, db) => {
					(err) ? this._err(err) : new ActionLogin({
						'io': this._io,
						'client': client,
						'db': db,
						'req': req
					});
				});
			});

			client.on('mock_data', (req) => {
				this._logMessage(client, 'mock_data', req);
				for (var i = 0; i < 1; i++) {
					this._db.getConnection((err, db) => {
						(err) ? this._err(err) : new ActionMockData({
							'io': this._io,
							'client': client,
							'db': db,
							'req': req
						});
					});
				}
			});
		});
	}

	_logMessage(client = null, evt = '', message = '') {
		message = numeral(this._clients).format('0000') + ' client(s) connected => ' + client.id + ' => ' + evt + ' => ' + JSON.stringify(message);
		this._log.msg(logPrefix, message);
	}

	_err(err) {
		var ret = false;
		if (err) {
			this._log.err(logPrefix, err);
			this.emit('err', err);
			ret = true;
		}
		return ret;
	}
};

module.exports = Socket;
