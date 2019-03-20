import Io from 'socket.io';
import Helpers from './helpers';
import numeral from 'numeral';
import _ from 'lodash';
import randtoken from 'rand-token';
import SmtpClient from './mail/smtp_client';

const logPrefix = 'SOCKET  ';

class Socket extends Helpers {

	/**
	 * basic class for socket server
	 * @param config
	 */
	constructor(config) {
		super();

		if (config) {
			this._config = config;
		}

		this._clients = 0;

		db.base.init().then(() => {
			return db.translation.init();
		}).then(() => {

			this._io = Io(this._config.http);
			this._io.on('connection', client => {

				client.token = randtoken.generate(32);
				client.lang = this._detectLang(client.handshake);

				let values = [
					client.id,
					client.token,
					client.lang,
					(client.handshake && client.handshake.address) ? client.handshake.address : '',
					(client.handshake && client.handshake.headers && client.handshake.headers["user-agent"]) ? client.handshake.headers["user-agent"] : ''
				];

				db.base.connection(values).then(() => {
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
					db.base.disconnect([client.id]);
					this._clients--;
					this._logMessage(client, 'client disconnected');
				});
			});
		}).catch((err) => {
			console.log(err);
		});

	}

	/**
	 * handle actions from clients
	 * @param client
	 * @private
	 */
	_actions(client) {

		client.on('register', (req) => {
			client.type = req.type;
			client.emit('register');
			client.emit('translation-fetch', db.translation.fetch(client.lang));
			this._logMessage(client, 'register', req);
		});

		client.on('language-set', (req) => {
			db.base.setLanguage(_.extend(req, {'ClientConnID': client.id})).then((res) => {
				client.lang = res.LangCode;
				client.emit('language-set');
				client.emit('translation-fetch', db.translation.fetch(client.lang));
				this._logMessage(client, 'language-set', req);
			}).catch(err => {
				client.emit('language-set', err);
				this._logError(client, 'language-set', err);
			});
		});

		client.on('language-fetch', (req) => {
			db.base.fetchLanguage(req).then((res) => {
				client.emit('language-fetch', res);
				this._logMessage(client, 'langauge-fetch', req);
			}).catch(err => {
				client.emit('language-fetch', err);
				this._logError(client, 'langauge-fetch', err);
			});
		});

		client.on('translation-set', (req) => {
			db.translation.set(req.LangCode, req.Token, req.Value);
		});

		client.on('translation-fetch', (req) => {
			let LangCode = req.LangCode ? req.LangCode : client.lang;
			client.emit('translation-fetch', db.translation.fetch(LangCode));
			this._logMessage(client, 'translation-fetch');
		});

		client.on('translation-fetch-group', (req) => {
			let LangCode = req.LangCode ? req.LangCode : client.lang;
			let TransGroupID = req.TransGroupID ? req.TransGroupID : null;
			db.translation.fetchGroup(LangCode, TransGroupID).then((res) => {
				client.emit('translation-fetch-group', res);
				this._logMessage(client, 'translation-fetch-group', res);
			}).catch((err) => {
				client.emit('translation-fetch-group', err);
				this._logError(client, 'translation-fetch-group', err);
			});
		});

		client.on('account-create', (req) => {
			this._logMessage(client, 'account-create', req);
			db.account.create(req).then(() => {
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
			db.account.login(_.extend(req, {'ClientConnID': client.id})).then((res) => {
				if (!res.logout_token) {
					client.lang = res.UserLangCode;
					client.emit('account-login', {
						'UserFirstname': res.UserFirstname,
						'UserLastname': res.UserLastname
					});
				} else {
					client.emit('account-logout-token', res.logout_token);
					let ms = (this._config && this._config.logoutTokenTimeout) ? this._config.logoutTokenTimeout : 10000;
					this._logMessage(client, '', 'token expires in ' + ms + ' ms');
					setTimeout(() => {
						db.account.logoutTokenExpired([res.logout_token]).then((res) => {
							if (res) {
								client.emit('account-logout-token-expired');
							}
						});
					}, ms);
				}
			}).catch((err) => {
				client.emit('account-login-err', err);
				this._logError(client, 'account-login', err);
			});
		});

		client.on('account-logout', (req) => {
			this._logMessage(client, 'account-logout', req);
			client.emit('account-logout', false);
			db.account.logout({'ClientConnID': client.id}).then((res) => {
				client.emit('account-logout', true);
			}).catch((err) => {
				console.log(err);
				this._logError(client, 'account-logout', err);
			});
		});

		client.on('account-logout-token', (req) => {
			this._logMessage(client, 'account-logout-token', req);
			db.account.logoutToken([req]).then((res) => {
				_.each(res, (row) => {
					this._io.to(`${row.ClientConnID}`).emit('account-logout', false);
					this._io.to(`${row.ClientConnID}`).emit('account-logout', true);
				});
				client.emit('account-logout-token', false);
			}).catch((err) => {
				console.log(err);
				this._logError(client, 'account-logout-token', err);
			});
		});

		client.on('account-fetch', (req) => {
			this._logMessage(client, 'account-fetch', req);
			db.account.fetch(req).then((res) => {
				client.emit('account-fetch', res);
			}).catch((err) => {
				console.log(err);
				this._logError(client, 'account-fetch', err);
			});
		});

		client.on('account-update', (req) => {
			this._logMessage(client, 'account-update', req);
			db.account.update(req).then((res) => {
				client.emit('account-update', res);
			}).catch((err) => {
				console.log(err);
				this._logError(client, 'account-update', err);
			});
		});

		client.on('list-init', (req) => {
			this._logMessage(client, 'list-init', req);
			db.list.init(req.list_id).then((res) => {
				res.label = db.translation.get(client.lang, res.label);
				_.each(res.columns, (column) => {
					column.label = db.translation.get(client.lang, column.label);
				});
				client.emit('list-init', res);
			}).catch((err) => {
				console.log(err);
				this._logError(client, 'list-init', err);
			});
		});

		client.on('list-fetch', (req) => {
			db.list.fetch(req).then((res) => {
				client.emit('list-fetch', res);
			}).catch((err) => {
				console.log(err);
				this._logError(client, 'list-fetch', err);
			});
		});

		client.on('form-init', (req) => {
			this._logMessage(client, 'form-init', req);
			db.form.init(req.form_id).then((res) => {
				_.each(res.fields, (field) => {
					field.label = db.translation.get(client.lang, field.label);
				});
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

	_detectLang(handshake) {
		let LangCode = 'en-gb';
		if (handshake && handshake.headers && handshake.headers["accept-language"]) {
			LangCode = handshake.headers["accept-language"];
		}
		return LangCode.toLowerCase().substr(0, 5);
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
