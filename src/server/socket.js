import Io from 'socket.io';
import numeral from 'numeral';
import fs from 'fs';
import _ from 'lodash';

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

		const Db = settings.db;
		Db.getConnection((err, db) => {
			// initial remove all old connections from database
			if (!err && db) {
				db.query('TRUNCATE TABLE t_client_conns', [], (err, res) => {
					if (err) {
						console.log(err);
					}
					db.release();
				});
			} else {
				this._log.msg(logPrefix, 'could not truncate t_connections');
			}
		});

		const io = Io(settings.http);
		io.on('connection', client => {

			let sql = 'INSERT INTO t_client_conns (`client_id`,`address`,`user-agent`) VALUES (?,?,?)';
			let values = [
				client.id,
				client.handshake.address ? client.handshake.address : '',
				client.handshake.headers["user-agent"] ? client.handshake.headers["user-agent"] : ''
			];

			Db.getConnection((err, db) => {
				if (db) {
					db.query(sql, values, (err, res) => {
						if (!err) {
							client.on('register', (req) => {
								client.type = req.type;
								this._logMessage(client, 'register', req);

								if (req.type === 'api-tests') { // list all files in tests/actions and send to client
									let documentRoot = __dirname + '/../www';
									let files_html = [];
									fs.readdir(documentRoot + '/tests/actions', function(err, files) {
										_.each(files, (file) => {
											if (file.indexOf('html') !== -1) {
												files_html.push(file);
											}
										});
										client.emit('register', files_html);
									});
								}
							});

							client.on('account-create', (req) => {
								this._logMessage(client, 'account-create', req);
								Db.getConnection((err, db) => {
									if (!err) {
										const account = new ActionAccount({
											'io': io,
											'client': client,
											'db': db,
											'Db': Db,
											'req': req
										});
										account.create();
									} else {
										this._err(err);
									}
								});
							});

							client.on('account-fetch', (req) => {
								this._logMessage(client, 'account-fetch', req);
								Db.getConnection((err, db) => {
									if (!err) {
										const account = new ActionAccount({
											'io': io,
											'client': client,
											'db': db,
											'req': req
										});
										account.fetch();
									} else {
										this._err(err);
									}
								});
							});

							client.on('account-login', (req) => {
								this._logMessage(client, 'account-login', req);
								Db.getConnection((err, db) => {
									if (!err) {
										const account = new ActionAccount({
											'io': io,
											'client': client,
											'db': db,
											'Db': Db,
											'req': req
										});
										account.login();
									} else {
										this._err(err);
									}
								});
							});

							client.on('account-logout', (req) => {
								this._logMessage(client, 'account-logout', req);
								Db.getConnection((err, db) => {
									if (!err) {
										const account = new ActionAccount({
											'io': io,
											'client': client,
											'Db': Db,
											'db': db
										});
										account.logout();
									} else {
										this._err(err);
									}
								});
							});

							client.on('account-logout-token', (req) => {
								this._logMessage(client, 'account-logout-token', req);
								Db.getConnection((err, db) => {
									if (!err) {
										const account = new ActionAccount({
											'io': io,
											'client': client,
											'db': db,
											'Db': Db,
											'req': req
										});
										account.logout_token();
									} else {
										this._err(err);
									}
								});
							});


							client.on('mock_data', (req) => {
								this._logMessage(client, 'mock_data', req);
								for (var i = 0; i < 1; i++) {
									Db.getConnection((err, db) => {
										(err) ? this._err(err) : new ActionMockData({
											'io': io,
											'client': client,
											'db': db,
											'Db': Db,
											'req': req
										});
									});
								}
							});
						} else {
							console.log(err);
						}
						db.release();
					});
				} else {
					console.log(err);
				}
			});

			this._clients++;
			this._logMessage(client, 'client connected', {
				'id': client.id,
				'handshake': client.handshake
			});

			client.on('disconnect', () => {
				this._clients--;
				this._logMessage(client, 'client disconnected');

				let sql = 'DELETE FROM t_client_conns WHERE client_id = ?';
				let values = [client.id];
				Db.getConnection((err, db) => {
					db.query(sql, values, (err) => {
						db.release();
					});
				});
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
