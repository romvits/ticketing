import MySqlQuery from './../mysql_query';

import sha512 from 'hash.js/lib/hash/sha/512';
import randtoken from "rand-token";
import Validator from 'better-validator';

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
	 * Account logout
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
	 * Account logout all other users by token
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
	 * Account logout-token expired
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
	 * Account create a new user
	 * @param values
	 * @returns {Promise<any>}
	 */
	create(values) {
		return new Promise((resolve, reject) => {
			const validator = new Validator({});
			validator(values).required().isObject((obj) => {
				obj('email').isString().notEmpty().isEmail();
				obj('password').isString().notEmpty();
				obj('firstname').isString().notEmpty();
				obj('lastname').isString().notEmpty();
			});
			const err = validator.run();

			const user_id = randtoken.generate(32);

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
	 * Account update password (create a new password for a user)
	 * @param values
	 * @returns {Promise<any>}
	 */
	updatePassword(values) {
		return new Promise((resolve, reject) => {

		});
	}

	/**
	 * Account create password salt and hash password with extended salt
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
