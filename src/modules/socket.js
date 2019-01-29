import io from 'socket.io';
import numeral from 'numeral';
import fs from 'fs';

// import actions
import ActionAccount from './actions/account';
import ActionLogin from './actions/login';
import ActionMockData from './actions/mock_data';

const logPrefix = 'SOCKET  ';

class Socket {
	constructor(settings) {

		this._clients = 0;

		this._log = settings.log;
		this._config = settings.config;
		this._db = settings.db;

		this._db.getConnection((err, db) => {
			// initial remove all old connections from database
			if (!err && db) {
				db.query('TRUNCATE TABLE t_connections', [], (err, res) => {
					if (err) {
						console.log(err);
					}
					db.release();
				});
			} else {
				this._log.msg(logPrefix, 'could not truncate t_connections, does database container exist?');
			}
		});

		this._io = io(settings.http);
		this._io.on('connection', client => {

			const token = client.handshake.query.token ? client.handshake.query.token : null;
			const init = client.handshake.query.init ? true : false;

			if (token) {

				let sql, values;

				if (init) {
					sql = 'INSERT INTO t_connections (`token`,`socket_id`,`address`,`user-agent`) VALUES (?,?,?,?)';
					values = [
						token,
						client.id,
						client.handshake.address ? client.handshake.address : '',
						client.handshake.headers["user-agent"] ? client.handshake.headers["user-agent"] : ''
					];
				} else {
					sql = 'UPDATE t_connections SET socket_id = ? WHERE token = ?';
					values = [client.id, token];
				}

				this._db.getConnection((err, db) => {
					db.query(sql, values, (err, res) => {
						if (err) {
							console.log(err);
						}
						db.release();

						if (init || (!init && res.changedRows)) {
							client.on('register', (req) => {
								client.type = req.type;
								this._logMessage(client, 'register', req);

								if (req.type === 'api-tests') { // list all files in tests/actions and send to client
									let documentRoot = __dirname + '/../www';
									fs.readdir(documentRoot + '/tests/actions', function(err, items) {
										client.emit('register', items);
									});
								}
							});

							client.on('account-create', (req) => {
								this._logMessage(client, 'account-create', req);
								this._db.getConnection((err, db) => {
									if (!err) {
										const action = new ActionAccount({
											'io': this._io,
											'client': client,
											'db': db,
											'req': req
										});
										action.create();
									} else {
										this._err(err);
									}
								});
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
						}
					});
				});
			} else {
				client.emit('err', {'nr': 1001, 'message': 'no token given'});
			}

			this._clients++;
			this._logMessage(client, 'client connected', {
				'id': client.id,
				'handshake': client.handshake
			});

			client.on('disconnect', () => {
				this._clients--;
				this._logMessage(client, 'client disconnected');

				let sql = 'DELETE FROM t_connections WHERE socket_id = ?';
				let values = [client.id];
				setTimeout(() => {
					this._db.getConnection((err, db) => {
						db.query(sql, values, (err) => {
							db.release();
						});
					});
				}, this._config.timeout);
			});
		});
	}

	_logMessage(client = null, evt = '', message = '') {
		message = numeral(this._clients).format('0000') + ' client(s) => ' + client.id + ' => ' + evt + ' => ' + JSON.stringify(message);
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
