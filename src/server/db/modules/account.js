import MySqlQuery from './../mysql_query';

import sha512 from 'hash.js/lib/hash/sha/512';
import randtoken from "rand-token";

const fields = {
	'UserEmail': {'type': 'email', 'length': 200, 'empty': false},
	'UserType': {'type': 'enum', 'values': [null, 'admin', 'promoter']},
	'UserFirstname': {'type': 'string', 'length': 20, 'empty': false},
	'UserLastname': {'type': 'string', 'length': 20, 'empty': false}
};

class Account extends MySqlQuery {

	/**
	 * Login
	 * @param values
	 * @returns {Promise<any>}
	 */
	login(values) {
		return new Promise((resolve, reject) => {
			let UserID = '';
			let UserFirstname = '';
			let UserLastname = '';
			let logout_token = null;

			let sql = 'SELECT UserPasswordSalt FROM tabUser WHERE UserEmail = ?';
			this._queryPromise(sql, [values.UserEmail]).then((res) => {
				if (res && !res.length) {
					reject({'nr': 1000, 'message': 'Wrong user name or password'});
				} else {
					sql = 'SELECT UserID, UserFirstname, UserLastname FROM tabUser WHERE UserPassword = ?';
					return this._queryPromise(sql, [sha512().update(values.UserPassword + res[0].UserPasswordSalt).digest('hex')]);
				}
			}).then((res) => {
				if (res && !res.length) {
					reject({'nr': 1000, 'message': 'Wrong user name or password'});
				} else {
					UserID = res[0].UserID;
					UserFirstname = res[0].UserFirstname;
					UserLastname = res[0].UserLastname;

					sql = 'SELECT ClientConnID FROM memClientConn WHERE ClientConnUserID = ?';
					return this._queryPromise(sql, [UserID]);
				}
			}).then((res) => {
				if (res && !res.length) {
					sql = 'UPDATE memClientConn SET ClientConnUserID = ? WHERE ClientConnID = ?';
					values = [UserID, values.ClientConnID];
				} else {
					logout_token = randtoken.generate(128);
					sql = 'UPDATE memClientConn SET ClientConnLogoutToken = ? WHERE ClientConnUserID = ?';
					values = [logout_token, UserID];
				}
				return this._queryPromise(sql, values);
			}).then((res) => {
				resolve({
					'logout_token': logout_token,
					'UserFirstname': UserFirstname,
					'UserLastname': UserLastname
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
			let sql = 'UPDATE memClientConn SET ClientConnUserID = null WHERE ClientConnID = ?';
			this._queryPromise(sql, [values.ClientConnID]).then((res) => {
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
			let sql = 'SELECT ClientConnID, ClientConnUserID FROM memClientConn WHERE ClientConnLogoutToken = ?';
			this._queryPromise(sql, values).then((res) => {
				result = res;
				sql = 'UPDATE memClientConn SET ClientConnUserID = null, ClientConnLogoutToken = null WHERE ClientConnLogoutToken = ?';
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
			let sql = 'UPDATE memClientConn SET ClientConnLogoutToken = null WHERE ClientConnLogoutToken = ?';
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
			const UserID = this._generateUUID();

			if (!err.length) {
				let sql = 'SELECT UserID FROM tabUser WHERE UserEmail = ?';
				this._queryPromise(sql, [values.UserEmail]).then((res) => {
					if (!res.length) {

						const hashes = this._accountHashPassword(values.UserPassword);
						sql = 'INSERT INTO tabUser (UserID,UserEmail,UserPassword,UserPasswordSalt,UserFirstname,UserLastname) VALUES (?,?,?,?,?,?)';

						return this._queryPromise(sql, [UserID, values.UserEmail, hashes.password, hashes.salt, values.UserFirstname, values.UserLastname]);
					} else {
						reject({'nr': 1001, 'message': 'Email already exists'});
					}
				}).then((res, err) => {
					resolve(UserID);
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

			const err = this._validator(fields, values);

			if (!err.length) {
				let sql = 'UPDATE tabUser SET `UserEmail` = ?, `UserFirstname` = ?, `UserLastname` = ?, `UserType` = ? WHERE `UserID` = ?';
				values = [values.UserEmail, values.UserFirstname, values.UserLastname, values.UserType, values.UserID];
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
			let sql = 'DELTE FROM tabUser WHERE `UserID` = ?';
			this._queryPromise(sql, [values.UserID]).then((res) => {
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
	 * fetch onw specific user by UserID
	 * @param values {Object} eg {'UserID':uuid}
	 * @returns {Promise<any>}
	 */
	fetch(values) {
		return new Promise((resolve, reject) => {

			let sql = 'SELECT * FROM tabUser WHERE UserID = ?';
			this._queryPromise(sql, [values.UserID]).then((res) => {
				if (res.length === 1) {
					var row = res[0];
					delete row.UserID;
					delete row.UserPassword;
					delete row.UserPasswordSalt;
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
	 * @param values {Object} eg {'UserID': uuid, 'type': null || 'admin' || 'promoter'}
	 * @returns {Promise<any>}
	 */
	setType(values) {
		return new Promise((resolve, reject) => {

			let sql = 'UPDATE tabUser SET `UserType` = values.UserType WHERE UserID = ?';
			this._queryPromise(sql, [values.UserID]).then((res) => {
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
