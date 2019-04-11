import Module from './../module';
import sha512 from 'hash.js/lib/hash/sha/512';
import randtoken from "rand-token";
import _ from 'lodash';


/**
 * user actions
 * @extends Module
 */
class User extends Module {

	/**
	 * constructor
	 * @param connID {String} 32 character string of connection ID from database table ``
	 */
	constructor(ConnID = null, ConnUserID = null) {
		super(ConnID, ConnUserID);
		this.pk = 'FloorID';
		this.table = 'innoFloor';
		this.view = 'viewFloor';
		this.fields = {
			'UserEmail': {'type': 'email', 'length': 200, 'empty': false},
			'UserType': {'type': 'enum', 'values': [null, 'admin', 'promoter']},
			'UserFirstname': {'type': 'string', 'length': 50, 'empty': false},
			'UserLastname': {'type': 'string', 'length': 50, 'empty': false}
		}
	}

	/**
	 * login
	 * @param values
	 * @returns {Promise<any>}
	 */
	login(values) {

		return new Promise((resolve, reject) => {

			let UserID = '';
			let UserFirstname = '';
			let UserLastname = '';
			let UserLangCode = '';
			let LogoutToken = null;

			let UserEmail = values.UserEmail;
			let UserPassword = values.UserPassword;

			let fields = ['UserPasswordSalt'];
			let where = {'UserEmail': UserEmail};

			db.promiseSelect('innoUser', fields, where).then((res) => {
				if (!_.size(res)) {
					throw this.getError(1000);
				} else {
					let fields = ['UserID', 'UserLangCode', 'UserFirstname', 'UserLastname'];
					let values = {'UserEmail': UserEmail, 'UserPassword': sha512().update(UserPassword + res[0].UserPasswordSalt).digest('hex')};
					return db.promiseSelect('innoUser', fields, values);
				}
			}).then((res) => {
				if (!_.size(res)) {
					throw this.getError(1001);
				} else {
					UserID = res[0].UserID;
					UserFirstname = res[0].UserFirstname;
					UserLastname = res[0].UserLastname;
					UserLangCode = res[0].UserLangCode;
					return db.promiseSelect('memClientConn', ['ClientConnID'], {'ClientConnUserID': UserID});
				}
			}).then((res) => {
				let data = {'ClientConnUserID': UserID, 'ClientConnLangCode': UserLangCode};
				let where = {'ClientConnID': this.getConnID()};
				if (_.size(res)) {
					LogoutToken = randtoken.generate(128);
					data = {'ClientConnLogoutToken': LogoutToken};
					where = {'ClientConnID': res[0].ClientConnID};
				}
				return db.promiseUpdate('memClientConn', data, where);
			}).then((res) => {
				resolve({
					'LogoutToken': LogoutToken,
					'UserID': UserID,
					'UserEmail': UserEmail,
					'UserFirstname': UserFirstname,
					'UserLastname': UserLastname,
					'UserLangCode': UserLangCode
				});
			}).catch((err) => {
				if (!err.nr || !err.message) {
					console.log(err);
				}
				reject(err);
			});
		});
	}

	/**
	 * logout
	 * @param {array} values
	 * @returns {Promise<any>}
	 */
	logout() {
		return db.promiseUpdate('memClientConn', {'ClientConnUserID': null}, {'ClientConnID': this.getConnID()});
	}

	/**
	 * logout all other users by token
	 * @param values
	 * @returns {Promise<any>}
	 */
	logoutToken(LogoutToken) {
		return new Promise((resolve, reject) => {
			let table = 'memClientConn';
			let fields = ['ClientConnID'];
			let where = {'ClientConnLogoutToken': LogoutToken};
			let ret = [];
			db.promiseSelect(table, fields, where).then((res) => {
				if (!_.size(res)) {
					throw this.getError(1002);
				} else {
					ret = res;
					let data = {'ClientConnUserID': null};
					let where = {'ClientConnLogoutToken': LogoutToken};
					return db.promiseUpdate(table, data, where);
				}
			}).then(() => {
				resolve(ret);
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
	 * create new user
	 * @param values
	 * @returns {Promise<any>}
	 */
	create(values) {
		return new Promise((resolve, reject) => {
			const err = this._validator(this.fields, values);
			if (!_.size(err)) {
				let table = 'innoUser';
				let where = {'UserEmail': values.UserEmail};
				db.promiseCount(table, where, 'COUNT(UserID) AS count').then((res) => {
					if (res[0].count) {
						throw this.getError('1003', {'§§EMAIL': values.UserEmail});
					} else {
						const hashes = this._hashPassword(values.UserPassword);
						values.UserID = this.generateUUID();
						values.UserPassword = hashes.password;
						values.UserPasswordSalt = hashes.salt;
						delete values.UserPasswordCheck;
						return db.promiseInsert(table, values);
					}
				}).then((res) => {
					delete values.UserPassword;
					delete values.UserPasswordSalt;
					resolve(res);
				}).catch((err) => {
					reject(err);
				});
			} else {
				reject(err);
			}
		});
	}

	/**
	 * update
	 * @param values
	 * @returns {Promise<any>}
	 */
	update(values) {
		return new Promise((resolve, reject) => {
			console.log('update');
			resolve();
		});
	}

	/**
	 * delete
	 * @param id
	 * @returns {Promise<any>}
	 */
	delete(id) {
		return new Promise((resolve, reject) => {
			db.promiseDelete('innoUser', {'UserID': id}).then((res) => {
				resolve(id);
			}).catch((err) => {
				console.log(err);
				reject(err);
			});
		});
	}

	/**
	 * create password salt and hash password with extended salt
	 * @param password {String} password string should be already hasched by client (eg md5 or sha256 or even both)
	 * @returns {Object} object with password hash and password salt {'password': password_hash, 'salt': password_salt}
	 * @private
	 */
	_hashPassword(password) {
		const password_salt = randtoken.generate(128);
		const password_hash = sha512().update(password + password_salt).digest('hex');
		return {'password': password_hash, 'salt': password_salt};
	}

}

module.exports = User;