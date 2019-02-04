import randtoken from 'rand-token';
import sha512 from 'hash.js/lib/hash/sha/512';
import Validator from 'better-validator';
import _ from 'lodash';

class ActionAccount {

	constructor(settings) {
		this._io = settings.io;
		this._client = settings.client;
		this._Db = settings.Db;
		this._db = settings.db;
		this._req = settings.req;
	}

	create() {

		const validator = new Validator({});
		validator(this._req).required().isObject((obj) => {
			obj('email').isString().notEmpty().isEmail();
			obj('password').isString().notEmpty();
			obj('firstname').isString().notEmpty();
			obj('lastname').isString().notEmpty();
		});
		const err = validator.run();

		if (!err.length) {

			let sql = 'SELECT user_id FROM t_user WHERE email = ?';
			let values = [this._req.email];

			this._db.query(sql, values, (err, res) => {
				if (!err) {
					if (!res.length) {
						const user_id = randtoken.generate(32);
						const hashes = this._hash_password(this._req.password);

						sql = 'INSERT INTO t_user (user_id,email,hashes.password,hashes.salt,firstname,lastname) VALUES (?,?,?,?,?,?)';
						values = [user_id, this._req.email, password, password_salt, this._req.firstname, this._req.lastname];

						this._db.query(sql, values, (err, res) => {
							if (err) {
								console.log(err);
							}
							this._client.emit('account-create', true);
							this._db.release();
						});
					} else {
						this._client.emit('err', {'nr': 1001, 'message': 'Email already exists'});
						this._db.release();
					}
				} else {
					console.log(err);
					this._db.release();
				}
			});
		} else {
			this._client.emit('err', err);
		}
	}

	_hash_password(password) {
		const password_salt = randtoken.generate(128);
		const password_hash = sha512().update(password + password_salt).digest('hex');
		return {'password': password_hash, 'salt': password_salt};
	}

	update() {

		let sql = 'UPDATE t_user SET';
		sql += ' email = ?';
		sql += ',firstname = ?';
		sql += ',lastname = ?';
		sql += ' WHERE user_id = ?';

		let values = [this._req.email, this._req.firstname, this._req.lastname, this._req.user_id];
		this._db.query(sql, values, (err, res) => {
			if (!err) {
				if (parseInt(res.changedRows) === 1) {
					this._client.emit('account-update', true);
				} else {
					this._client.emit('err', {'nr': 1007, 'message': 'Update for user, user with user_id not found OR you didn´t change anything'});
				}
				this._db.release();
			} else {
				console.log(err);
				this._db.release();
			}
		});

	}

	login() {

		// check if user with email exists
		let sql = 'SELECT password_salt FROM t_user WHERE email = ?';
		let values = [this._req.email];
		this._db.query(sql, values, (err, res_salt) => {
			if (!err) {
				if (res_salt.length) {

					// check user password with result of password_salt from last query
					sql = 'SELECT user_id, firstname, lastname FROM t_user WHERE password = ?';
					values = [sha512().update(this._req.password + res_salt[0].password_salt).digest('hex')];
					this._db.query(sql, values, (err, res_user) => {
						if (!err) {
							if (res_user.length) {

								let user_id = res_user[0].user_id;
								let user_firstname = res_user[0].firstname;
								let user_lastname = res_user[0].lastname;

								sql = 'SELECT client_id FROM t_client_conns WHERE user_id = ?';
								values = [user_id];
								this._db.query(sql, values, (err, res) => {
									if (!err) {
										if (!res.length) {

											// update conns and set user_id to client_id
											sql = 'UPDATE t_client_conns SET user_id = ? WHERE client_id = ?';
											values = [user_id, this._client.id];
											this._db.query(sql, values, (err, res) => {
												if (!err) {
													this._client.emit('account-login', {
														'firstname': user_firstname,
														'lastname': user_lastname
													});
												} else {
													console.log(err);
												}
												this._db.release();
											});
										} else {

											const logout_token = randtoken.generate(128);
											sql = 'UPDATE t_client_conns SET logout_token = ? WHERE user_id = ?';
											values = [logout_token, user_id];
											this._db.query(sql, values, (err, res) => {
												if (!err) {
													this._client.emit('account-logout-token', logout_token);
													this._client.emit('err', {'nr': 1002, 'message': 'User already logged in on other device'});
													setTimeout(() => {
														this._Db.getConnection((err, db) => {
															sql = 'UPDATE t_client_conns SET logout_token = ? WHERE logout_token = ?';
															values = ['', logout_token];
															db.query(sql, values, (err, res) => {
																if (res.changedRows) {
																	this._client.emit('account-logout-token-expired');
																	this._client.emit('err', {'nr': 1005, 'message': 'Token expired'});
																}
																db.release();
															});
														});
													}, 10000); // 900000
												} else {
													console.log(err);
												}
												this._db.release();
											});
										}
									} else {
										console.log(err);
										this._db.release();
									}
								});

							} else {
								this._client.emit('err', {'nr': 1000, 'message': 'Wrong user name or password'});
								this._db.release();
							}
						} else {
							console.log(err);
							this._db.release();
						}
					});
				} else {
					this._client.emit('err', {'nr': 1000, 'message': 'Wrong user name or password'});
					this._db.release();
				}
			}
		});

	}

	logout() {

		let sql = 'UPDATE t_client_conns SET user_id = \'\' WHERE client_id = ?';
		let values = [this._client.id];
		this._db.query(sql, values, (err, res) => {
			if (!err) {
				this._client.emit('account-logout', true);
			} else {
				console.log(err);
			}
			this._db.release();
		});
	}

	logout_token() {

		let sql = 'SELECT client_id, user_id FROM t_client_conns WHERE logout_token = ?';
		let values = [this._req];
		this._db.query(sql, values, (err, res) => {
			if (!err) {
				if (res.length) {

					_.each(res, (row) => {
						this._io.to(`${row.client_id}`).emit('account-logout', true);
					});

					sql = 'UPDATE t_client_conns SET user_id = \'\', logout_token = \'\' WHERE logout_token = ?';
					values = [this._req];
					this._db.query(sql, values, (err, res) => {
						if (!err) {
							this._client.emit('account-logout', true);
						} else {
							console.log(err);
						}
						this._db.release();
					});
				} else {
					this._client.emit('account-logout', true);
					this._client.emit('err', {'nr': 1004, 'message': 'Token not valid'});
					this._db.release();
				}
			} else {
				console.log(err);
				this._db.release();
			}
		});
	}

	fetch() {

		let sql = 'SELECT user_id, email, firstname, lastname FROM t_user WHERE user_id = ?';
		let values = [this._req.user_id];
		this._db.query(sql, values, (err, res) => {
			if (!err) {
				if (parseInt(res.length) === 1) {
					this._client.emit('account-fetch', res[0]);
				} else {
					this._client.emit('err', {'nr': 1006, 'message': 'User with user_id not found'});
				}
				this._db.release();
			} else {
				console.log(err);
				this._db.release();
			}
		});
	}
}

module.exports = ActionAccount;