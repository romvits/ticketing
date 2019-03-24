import Io from 'socket.io';
import Helpers from './helpers';
import numeral from 'numeral';
import _ from 'lodash';
import randtoken from 'rand-token';
import SmtpClient from './mail/smtp_client';

// modules
import Base from './modules/base'
import Translation from './modules/translation'
import User from './modules/user'
import List from './modules/list'
import Form from './modules/form'
import Event from './modules/event'
import Order from './modules/order'

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

		// base, translation and account
		this.base = new Base();
		this.translation = new Translation();
		this.user = new User();

		// fe configuration
		this.list = new List();
		this.form = new Form();

		// other modules
		this.event = new Event();
		this.order = new Order();

		this.base.init().then(() => {
			return this.translation.init();
		}).then(() => {

			this._io = Io(this._config.http);
			this._io.on('connection', client => {

				client.token = randtoken.generate(32);
				client.lang = this._detectLang(client.handshake);

				client.on('user-login', (req) => {
					req = _.extend(req, {'ClientConnID': client.id});
					this.user.login(req).then((res) => {
						client.lang = res.UserLangCode;
						if (!res.LogoutToken) {
							client.emit('user-login', res);
							this._logMessage(client, 'user-login', req);
						} else {
							client.emit('user-logout-token', res.LogoutToken);
							this._logMessage(client, 'user-logout-token', req);
						}
					}).catch((err) => {
						client.emit('user-login', err);
						this._logError(client, 'user-login', req);
					});
				});

				client.on('user-logout', (req) => {
					this.user.logout({'ClientConnID': client.id}).then((res) => {
						client.emit('user-logout', true);
						this._logMessage(client, 'user-logout', req);
					}).catch((err) => {
						client.emit('user-logout', err);
						this._logError(client, 'user-logout', req);
					});
				});

				client.on('user-logout-token', (req) => {
					console.log(req);
				});

				let values = {
					'ClientConnID': client.id,
					'ClientConnToken': client.token,
					'ClientConnLang': client.lang,
					'ClientConnAddress': (client.handshake && client.handshake.address) ? client.handshake.address : '',
					'ClientConnUserAgent': (client.handshake && client.handshake.headers && client.handshake.headers["user-agent"]) ? client.handshake.headers["user-agent"] : ''
				};

				this.base.connection(values).then(() => {
					this._clients++;
					this._logMessage(client, 'client connected', {
						'id': client.id,
						'handshake': client.handshake
					});

					//this._actions(client);
				}).catch((err) => {
					this._logError(client, 'connection', err);
				});

				client.on('disconnect', () => {
					this.base.disconnect({
						'ClientConnID': client.id
					}).then(() => {
						this._clients--;
						this._logMessage(client, 'client disconnected');
					}).catch((err) => {
						this._logError(client, 'disconnected', err);
					});
				});

			});
		}).catch((err) => {
			console.log(err);
		});

	}

	actionUserLogin(req) {
		return new Promise((resolve, reject) => {
		});
		/*
		db.account.login(_.extend(req, {'ClientConnID': client.id})).then((res) => {
			if (!res.logout_token) {
				client.lang = res.UserLangCode;
				client.emit('user-login', {
					'UserFirstname': res.UserFirstname,
					'UserLastname': res.UserLastname
				});
			} else {
				client.emit('user-logout-token', res.logout_token);
				let ms = (this._config && this._config.logoutTokenTimeout) ? this._config.logoutTokenTimeout : 10000;
				this._logMessage(client, '', 'token expires in ' + ms + ' ms');
				setTimeout(() => {
					db.account.logoutTokenExpired([res.logout_token]).then((res) => {
						if (res) {
							client.emit('user-logout-token-expired');
						}
					});
				}, ms);
			}
		}).catch((err) => {
			client.emit('user-login-err', err);
			this._logError(client, 'user-login', err);
		});
		*/
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

		client.on('user-create', (req) => {
			this._logMessage(client, 'user-create', req);
			db.account.create(req).then(() => {
				client.emit('user-create');
				// TODO: send confirmation email
				let smtpClient = new SmtpClient(this._config.mail.smtp);

				smtpClient.sendPromise().then((res) => {
					console.log('socket.js', 'res', res);
				}).catch((err) => {
					console.log('socket.js', 'err', err);
				});

			}).catch((err) => {
				client.emit('user-create', err);
				this._logError(client, 'user-create', err);
			});
		});


		client.on('user-logout-token', (req) => {
			this._logMessage(client, 'user-logout-token', req);
			db.account.logoutToken([req]).then((res) => {
				_.each(res, (row) => {
					this._io.to(`${row.ClientConnID}`).emit('user-logout', false);
					this._io.to(`${row.ClientConnID}`).emit('user-logout', true);
				});
				client.emit('user-logout-token', false);
			}).catch((err) => {
				console.log(err);
				this._logError(client, 'user-logout-token', err);
			});
		});

		client.on('user-fetch', (req) => {
			this._logMessage(client, 'user-fetch', req);
			db.account.fetch(req).then((res) => {
				client.emit('user-fetch', res);
			}).catch((err) => {
				console.log(err);
				this._logError(client, 'user-fetch', err);
			});
		});

		client.on('user-update', (req) => {
			this._logMessage(client, 'user-update', req);
			db.account.update(req).then((res) => {
				client.emit('user-update', res);
			}).catch((err) => {
				console.log(err);
				this._logError(client, 'user-update', err);
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

		client.on('order-create', (req) => {
			this._logMessage(client, 'order-create', req);
			db.order.create(req).then((res) => {
				client.emit('order-create', res);
			});
		});

		/*

		client.on('user-fetch', (req) => {
			this._logMessage(client, 'user-fetch', req);
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

		client.on('user-update', (req) => {
			this._logMessage(client, 'user-update', req);
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
