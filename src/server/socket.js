import Io from 'socket.io';
import numeral from 'numeral';
import fs from 'fs';
import _ from 'lodash';
import randtoken from 'rand-token';

// import actions
import ActionAccount from './actions/account';
import ActionList from './actions/list';

const logPrefix = 'SOCKET  ';

class Socket {
	constructor(settings) {

		this._clients = 0;

		this._log = settings.log;
		this._config = settings.config;

		this._Db = settings.db;
		this._Db.getConnection((err, db) => {
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

		this._io = Io(settings.http);
		this._io.on('connection', client => {

			client.token = randtoken.generate(32);

			let sql = 'INSERT INTO t_client_conns (`client_id`,`client_token`,`address`,`user-agent`) VALUES (?,?,?,?)';
			let values = [
				client.id,
				client.token,
				client.handshake.address ? client.handshake.address : '',
				client.handshake.headers["user-agent"] ? client.handshake.headers["user-agent"] : ''
			];

			this._Db.getConnection((err, db) => {
				if (db) {
					db.query(sql, values, (err, res) => {
						if (!err) {
							this._actions({
								'client': client,
								'db': db
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
				this._Db.getConnection((err, db) => {
					db.query(sql, values, (err) => {
						this._account_logout(client);
						db.release();
					});
				});
			});
		});
	}

	_actions(settings) {

		let io = this._io;
		let Db = this._Db;

		let client = settings.client;
		let db = settings.db;

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

		client.on('account-update', (req) => {
			this._logMessage(client, 'account-update', req);
			Db.getConnection((err, db) => {
				if (!err) {
					const account = new ActionAccount({
						'io': io,
						'client': client,
						'db': db,
						'req': req
					});
					account.update();
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
					this._account_logout(client);
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

		client.on('list-init', (req) => {
			this._logMessage(client, 'list-init', req);
			Db.getConnection((err, db) => {
				if (!err) {
					const list = new ActionList({
						'io': io,
						'client': client,
						'db': db,
						'Db': Db,
						'req': req
					});
					list.init();
				} else {
					this._err(err);
				}
			});
		});

		client.on('list-fetch', (req) => {
			this._logMessage(client, 'list-fetch', req);
			Db.getConnection((err, db) => {
				if (!err) {
					const list = new ActionList({
						'io': io,
						'client': client,
						'db': db,
						'Db': Db,
						'req': req
					});
					list.fetch();
				} else {
					this._err(err);
				}
			});
		});
	}

	_account_logout(client) {
		this._io.emit('account-logout-other', {'client_id': client.id});
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
