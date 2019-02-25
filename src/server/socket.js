import Io from 'socket.io';
import numeral from 'numeral';
import fs from 'fs';
import _ from 'lodash';
import randtoken from 'rand-token';
import SmtpClient from './smtp_client';

const logPrefix = 'SOCKET  ';

class Socket {
	constructor(config) {

		this._clients = 0;

		this._config = config;

		db.init();

		this._io = Io(this._config.http);
		this._io.on('connection', client => {

			client.token = randtoken.generate(32);

			let values = [
				client.id,
				client.token,
				client.handshake.address ? client.handshake.address : '',
				client.handshake.headers["user-agent"] ? client.handshake.headers["user-agent"] : ''
			];

			db.socketConnection(values).then((res) => {
				this._clients++;
				this._logMessage(client, 'client connected', {
					'id': client.id,
					'handshake': client.handshake
				});
				this._actions(client);
			}).catch((err) => {
				this._logError(client, 'connection', err);
			});

			client.on('disconnect', () => {
				db.socketDisconnect([client.id]);
				this._clients--;
				this._logMessage(client, 'client disconnected');
			});
		});
	}

	_actions(client) {

		client.on('register', (req) => {
			client.type = req.type;
			this._logMessage(client, 'register', req);
		});

		client.on('account-create', (req) => {
			this._logMessage(client, 'account-create', req);
			db.accountCreate(req).then(() => {
				client.emit('account-create');
				// TODO: send confirmation email
				let smtpClient = new SmtpClient(this._config.mail.smtp);

				smtpClient.sendPromise().then((res) => {
					console.log('socket.js', 'res', res);
				}).catch((err) => {
					console.log('socket.js', 'err', err);
				});

			}).catch((err) => {
				client.emit('account-create', err);
				this._logError(client, 'account-create', err);
			});
		});

		client.on('account-login', (req) => {
			this._logMessage(client, 'account-login', req);
			db.accountLogin(_.extend(req, {'client_id': client.id})).then((res) => {
				if (!res.logout_token) {
					client.emit('account-login', {
						'firstname': res.firstname,
						'lastname': res.lastname
					});
				} else {
					client.emit('account-logout-token', res.logout_token);
					let ms = (this._config && this._config.logoutTokenTimeout) ? this._config.logoutTokenTimeout : 10000;
					this._logMessage(client, '', 'token expires in ' + ms + ' ms');
					setTimeout(() => {
						db.accountLogoutTokenExpired([res.logout_token]).then((res) => {
							if (res) {
								client.emit('account-logout-token-expired');
							}
						});
					}, ms);
				}
			}).catch((err) => {
				console.log(err);
				this._logError(client, 'account-login', err);
			});
		});

		client.on('account-logout', (req) => {
			this._logMessage(client, 'account-logout', req);
			client.emit('account-logout', false);
			db.accountLogout([client.id]).then((res) => {
				client.emit('account-logout', true);
			}).catch((err) => {
				console.log(err);
				this._logError(client, 'account-logout', err);
			});
		});

		client.on('account-logout-token', (req) => {
			this._logMessage(client, 'account-logout-token', req);
			db.accountLogoutToken([req]).then((res) => {
				_.each(res, (row) => {
					this._io.to(`${row.client_id}`).emit('account-logout', false);
					this._io.to(`${row.client_id}`).emit('account-logout', true);
				});
				client.emit('account-logout-token', false);
			}).catch((err) => {
				console.log(err);
				this._logError(client, 'account-logout-token', err);
			});
		});

		client.on('list-init', (req) => {
			this._logMessage(client, 'list-init', req);
			db.listInit(req.list_id).then((res) => {
				client.emit('list-init', res);
			}).catch((err) => {
				console.log(err);
				this._logError(client, 'list-init', err);
			});
		});

		client.on('list-fetch', (req) => {
			db.listFetch(req).then((res) => {
				client.emit('list-fetch', res);
			}).catch((err) => {
				console.log(err);
				this._logError(client, 'list-fetch', err);
			});
		});

		client.on('form-init', (req) => {
			this._logMessage(client, 'form-init', req);
			db.formInit(req.form_id).then((res) => {
				client.emit('form-init', res);
			}).catch((err) => {
				console.log(err);
				this._logError(client, 'form-init', err);
			});
		});

		/*

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

		client.on('form-init', (req) => {
			this._logMessage(client, 'form-init', req);
			Db.getConnection((err, db) => {
				if (!err) {
					const form = new ActionForm({
						'io': io,
						'client': client,
						'db': db,
						'Db': Db,
						'req': req
					});
					form.init();
				} else {
					this._err(err);
				}
			});
		});

		client.on('record-fetch', (req) => {
			this._logMessage(client, 'record-fetch', req);
			Db.getConnection((err, db) => {
				if (!err) {
					const record = new ActionRecord({
						'io': io,
						'client': client,
						'db': db,
						'Db': Db,
						'req': req
					});
					record.fetch();
				} else {
					this._err(err);
				}
			});
		});

		client.on('mask-fetch', (req) => {
			this._logMessage(client, 'record-fetch', req);
			Db.getConnection((err, db) => {
				if (!err) {
					const mask = new ActionMask({
						'io': io,
						'client': client,
						'db': db,
						'Db': Db,
						'req': req
					});
					mask.fetch();
				} else {
					this._err(err);
				}
			});
		});
		*/

	}

	_account_logout(client) {
		this._io.emit('account-logout-other', {'client_id': client.id});
	}

	_logMessage(client = null, evt = '', message = '') {
		message = numeral(this._clients).format('0000') + ' client(s) => ' + client.id + ' => ' + evt + ' => ' + JSON.stringify(message);
		log.msg(logPrefix, message);
	}

	_logError(client = null, evt = '', message = '') {
		message = numeral(this._clients).format('0000') + ' client(s) => ' + client.id + ' => ' + evt + ' => ' + JSON.stringify(message);
		log.err(logPrefix, message);
	}

	_err(err) {
		var ret = false;
		if (err) {
			log.err(logPrefix, err);
			this.emit('err', err);
			ret = true;
		}
		return ret;
	}
};

module.exports = Socket;
