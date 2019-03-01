import MySqlQuery from './../mysql_query';

import sha512 from 'hash.js/lib/hash/sha/512';
import randtoken from "rand-token";

const fields = {
	'email': {'type': 'email', 'length': 200, 'empty': false},
	'type': {'type': 'enum', 'values': [null, 'admin', 'promoter']},
	'firstname': {'type': 'string', 'length': 20, 'empty': false},
	'lastname': {'type': 'string', 'length': 20, 'empty': false}
};

class Account extends MySqlQuery {

	/**
	 * Login
	 * @param values
	 * @returns {Promise<any>}
	 */
	login(values) {
		return new Promise((resolve, reject) => {
			let user_id = '';
			let firstname = '';
			let lastname = '';
			let logout_token = null;

			let sql = 'SELECT password_salt FROM t_user WHERE email = ?';
			this._queryPromise(sql, [values.email]).then((res) => {
				if (res && !res.length) {
					reject({'nr': 1000, 'message': 'Wrong user name or password'});
				} else {
					sql = 'SELECT user_id, firstname, lastname FROM t_user WHERE password = ?';
					return this._queryPromise(sql, [sha512().update(values.password + res[0].password_salt).digest('hex')]);
				}
			}).then((res) => {
				if (res && !res.length) {
					reject({'nr': 1000, 'message': 'Wrong user name or password'});
				} else {
					user_id = res[0].user_id;
					firstname = res[0].firstname;
					lastname = res[0].lastname;

					sql = 'SELECT client_id FROM t_client_conns WHERE user_id = ?';
					return this._queryPromise(sql, [user_id]);
				}
			}).then((res) => {
				if (res && !res.length) {
					sql = 'UPDATE t_client_conns SET user_id = ? WHERE client_id = ?';
					values = [user_id, values.client_id];
				} else {
					logout_token = randtoken.generate(128);
					sql = 'UPDATE t_client_conns SET logout_token = ? WHERE user_id = ?';
					values = [logout_token, user_id];
				}
				return this._queryPromise(sql, values);
			}).then((res) => {
				resolve({
					'logout_token': logout_token,
					'firstname': firstname,
					'lastname': lastname
				});
			}).catch((err) => {
				console.log(err);
				reject(err);
			});
		});
	}

	/**
	 * logout
	 * @param {array} values
	 * @returns {Promise<any>}
	 */
	logout(values) {
		return new Promise((resolve, reject) => {
			let sql = 'UPDATE t_client_conns SET user_id = null WHERE client_id = ?';
			this._queryPromise(sql, values).then((res) => {
				resolve({});
			}).catch((err) => {
				console.log(err);
				reject(err);
			});
		});
	}

	/**
	 * logout all other users by token
	 * @param values
	 * @returns {Promise<any>}
	 */
	logoutToken(values) {
		return new Promise((resolve, reject) => {
			let result = [];
			let sql = 'SELECT client_id, user_id FROM t_client_conns WHERE logout_token = ?';
			this._queryPromise(sql, values).then((res) => {
				result = res;
				sql = 'UPDATE t_client_conns SET user_id = null, logout_token = null WHERE logout_token = ?';
				return this._queryPromise(sql, values);
			}).then(() => {
				resolve(result);
			}).catch((err) => {
				console.log(err);
				reject(err);
			});
		});
	}

	/**
	 * logout-token expired
	 * @param values
	 * @returns {Promise<any>}
	 */
	logoutTokenExpired(values) {
		return new Promise((resolve, reject) => {
			let sql = 'UPDATE t_client_conns SET logout_token = null WHERE logout_token = ?';
			this._queryPromise(sql, values).then((res) => {
				resolve(res.changedRows);
			}).catch((err) => {
				console.log(err);
				reject(err);
			});
		});
	}

	/**
	 * create a new user
	 * @param values
	 * @returns {Promise<any>}
	 */
	create(values) {
		return new Promise((resolve, reject) => {

			const err = this._validator(fields, values);
			const user_id = this._generateUUID();

			if (!err.length) {
				let sql = 'SELECT user_id FROM t_user WHERE email = ?';
				this._queryPromise(sql, [values.email]).then((res) => {
					if (!res.length) {

						const hashes = this._accountHashPassword(values.password);
						sql = 'INSERT INTO t_user (user_id,email,password,password_salt,firstname,lastname) VALUES (?,?,?,?,?,?)';

						return this._queryPromise(sql, [user_id, values.email, hashes.password, hashes.salt, values.firstname, values.lastname]);
					} else {
						reject({'nr': 1001, 'message': 'Email already exists'});
					}
				}).then((res, err) => {
					resolve(user_id);
				}).catch((err) => {
					console.log(err);
					reject(err);
				});
			} else {
				reject(err);
			}
		});
	}

	/**
	 * update user
	 * @param values
	 * @returns {Promise<any>}
	 */
	update(values) {
		return new Promise((resolve, reject) => {
			const validator = new Validator({});
			validator(values).required().isObject((obj) => {
				obj('email').isString().notEmpty().isEmail();
				obj('password').isString().notEmpty();
				obj('firstname').isString().notEmpty();
				obj('lastname').isString().notEmpty();
			});
			const err = validator.run();

			if (!err.length) {
				let sql = 'UPDATE t_user SET `email` = ?, `firstname` = ?, `lastname` = ?, `type` = ? WHERE `user_id` = ?';
				values = [values.email, values.firstname, values.lastname, values.type, values.user_id];
				this._queryPromise(sql, values).then((res) => {
					if (res.changedRows && res.affectedRows) {
						resolve();
					} else if (!res.changedRows && res.affectedRows) {
						reject({'nr': 1006, 'message': 'Nothing changed!'});
					} else if (!res.affectedRows) {
						reject({'nr': 1006, 'message': 'User not found!'});
					} else {
						reject({'nr': 9999, 'message': 'Unknown error!'});
					}
				}).catch((err) => {
					console.log(err);
					reject(err);
				});
			} else {
				reject(err);
			}
		});
	}

	/**
	 * delete user
	 * @param values
	 * @returns {*}
	 */
	delete(values) {
		return new Promise((resolve, reject) => {
			let sql = 'DELTE FROM t_user WHERE `user_id` = ?';
			this._queryPromise(sql, [values.user_id]).then((res) => {
				if (res.affectedRows) {
					resolve();
				} else {
					reject({'nr': 1008, 'message': 'Could not delete User!'});
				}
			}).catch((err) => {
				console.log(err);
				reject(err);
			});
		});
	}

	/**
	 * fetch onw specific user by user_id
	 * @param values {Object} eg {'user_id':uuid}
	 * @returns {Promise<any>}
	 */
	fetch(values) {
		return new Promise((resolve, reject) => {

			let sql = 'SELECT * FROM t_user WHERE user_id = ?';
			this._queryPromise(sql, [values.user_id]).then((res) => {
				if (res.length === 1) {
					var row = res[0];
					delete row.user_id;
					delete row.password;
					delete row.password_salt;
					resolve(row);
				} else {
					reject({'nr': 1003, 'message': 'User not found'});
				}
			}).catch((err) => {
				console.log(err);
				reject(err);
			});
		});
	}

	/**
	 * set type for user rights (null = visitor || admin = Administrator || promoter = Promoter
	 * @param values {Object} eg {'user_id': uuid, 'type': null || 'admin' || 'promoter'}
	 * @returns {Promise<any>}
	 */
	setType(values) {
		return new Promise((resolve, reject) => {

			let sql = 'UPDATE t_user SET `type` = values.type WHERE user_id = ?';
			this._queryPromise(sql, [values.user_id]).then((res) => {
				if (res.affectedRows) {
					resolve();
				} else {
					reject({'nr': 1002, 'message': 'User not found or wrong type given.'});
				}
			}).catch((err) => {
				reject(err);
			});
		});
	}

	/**
	 * update password (create a new password for a user)
	 * @param values
	 * @returns {Promise<any>}
	 */
	updatePassword(values) {
		return new Promise((resolve, reject) => {

		});
	}

	/**
	 * create password salt and hash password with extended salt
	 * @param password
	 * @returns {{password: number[] | string | PromiseLike<ArrayBuffer> | *, salt: *}}
	 * @private
	 */
	_accountHashPassword(password) {
		const password_salt = randtoken.generate(128);
		const password_hash = sha512().update(password + password_salt).digest('hex');
		return {'password': password_hash, 'salt': password_salt};
	}


}

module.exports = Account;
