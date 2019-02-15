import Helpers from './helpers';
import mysql from 'mysql';
import randtoken from "rand-token";
import numeral from "numeral";
import sha512 from 'hash.js/lib/hash/sha/512';
import _ from 'lodash';

class DBMySQL extends Helpers {

	init() {
		this.logPrefix = 'DB MySQL';
		this._pool = mysql.createPool(this._config.conn);
		this._logMessage('DB pool created');
		this._query('TRUNCATE TABLE t_client_conns');
	}

	// connect AND disconnect

	connection(values) {
		return new Promise((resolve, reject) => {
			let sql = 'INSERT INTO t_client_conns (`client_id`,`client_token`,`address`,`user-agent`) VALUES (?,?,?,?)';
			this._queryPromise(sql, values).then((res) => {
				resolve(res);
			}).catch((err) => {
				console.log(err);
				reject(err);
			});
		});
	}

	disconnect(values) {
		let sql = 'DELETE FROM t_client_conns WHERE client_id = ?'
		this._query(sql, values);
	}

	// account

	accountLogin(values) {
		return new Promise((resolve, reject) => {
			let user_id = '';
			let firstname = '';
			let lastname = '';
			let logout_token = null;

			let sql = 'SELECT password_salt FROM t_user WHERE email = ?';
			this._queryPromise(sql, [values.email]).then((res) => {
				if (!res.length) {
					reject({'nr': 1000, 'message': 'Wrong user name or password'});
				} else {
					sql = 'SELECT user_id, firstname, lastname FROM t_user WHERE password = ?';
					return this._queryPromise(sql, [sha512().update(values.password + res[0].password_salt).digest('hex')]);
				}
			}).then((res) => {
				if (!res.length) {
					reject({'nr': 1000, 'message': 'Wrong user name or password'});
				} else {
					user_id = res[0].user_id;
					firstname = res[0].firstname;
					lastname = res[0].lastname;

					sql = 'SELECT client_id FROM t_client_conns WHERE user_id = ?';
					return this._queryPromise(sql, [user_id]);
				}
			}).then((res) => {
				if (!res.length) {
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

	accountLogout(values) {
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

	accountLogoutToken(values) {
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

	accountLogoutTokenExpired(values) {
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

	// list

	listInit(list_id, full = false) {
		var result = {};
		return new Promise((resolve, reject) => {
			this._promiseList(list_id, full).then((res) => {
				result = res;
				return this._promiseListColumn(list_id);
			}).then((res) => {
				result.json.columns = res;
				resolve(result);
			}).catch((err) => {
				console.warn(err);
				this._db.release();
			});
		});
	}

	_promiseList(list_id, full = false) {
		return new Promise((resolve, reject) => {
			let sql = 'SELECT * FROM t_list WHERE list_id = ?';
			let values = [list_id];
			this._pool.getConnection((err, db) => {
				db.query(sql, values, (err, res) => {
					if (res[0] && !err) {
						sql = 'SELECT COUNT(*) AS count FROM ' + res[0].table;
						db.query(sql, values, (err, res_count) => {
							if (!err) {
								let result = {
									'label': res[0].label,
									'pk': res[0].pk,
									'mask_id': res[0].mask_id,
									'count': res_count[0].count,
									'limit': res[0].limit,
									'json': JSON.parse(res[0].json)
								};
								if (full) {
									result.table = res[0].table;
									result.limit = res[0].limit;
								}
								db.release();
								resolve(result);
							}
						});
					} else {
						db.release();
						reject(err ? err : res);
					}
				});
			});
		});
	}

	_promiseListColumn(list_id) {
		return new Promise((resolve, reject) => {
			let sql = 'SELECT * FROM t_list_column WHERE list_id = ? ORDER BY `order`';
			let values = [list_id];
			this._pool.getConnection((err, db) => {
				db.query(sql, values, (err, res) => {
					if (res && !err) {
						_.each(res, (column, id) => {
							res[id].json = JSON.parse(column.json);
						});
						db.release();
						resolve(res);
					} else {
						db.release();
						reject(err ? err : res);
					}
				});
			});
		});
	}

	listFetch(values) {
		let req = values;
		return new Promise((resolve, reject) => {
			this.listInit(req.list_id, true).then((result) => {
				let json = result.json;
				let columns = json.columns;
				let table = result.table;
				let limit = result.limit;
				let fields = result.pk;
				let orderby = '';
				let orderdesc = '';

				_.each(columns, (column) => {
					fields += ',' + column.name;
				});
				let sql = 'SELECT ' + fields + ' FROM ' + table;

				if (req && req.orderdesc && req.orderdesc === true) {
					orderdesc = ' DESC';
				}

				let comma = '';
				if (json.orderby && _.isArray(json.orderby)) {
					_.each(json.orderby, (field) => {
						if (req.orderby !== field) {
							orderby += comma + field + orderdesc;
							comma = ',';
						}
					});
				}
				if (req.orderby) {
					orderby = req.orderby + orderdesc + comma + orderby;
				} else {
					req.orderby = (json && json.orderby && json.orderby[0]) ? json.orderby[0] : null;
				}

				if (orderby) {
					sql += ' ORDER BY ' + orderby;
				}

				(limit) ? sql += ' LIMIT ' + req.from + ',' + limit : null;

				let values = [];
				this._pool.getConnection((err, db) => {
					db.query(sql, values, (err, res) => {
						if (!err) {
							resolve({'orderby': req.orderby, 'orderdesc': (req.orderdesc ? req.orderdesc : false), 'rows': res});
						} else {
							reject(err ? err : res);
						}
						db.release();
					});
				});
			}).catch((err) => {
				console.warn(err);
				this._db.release();
			});
		});
	}

	// form

	formInit(form_id, full = false) {
		var result = {};
		return new Promise((resolve, reject) => {
			this._promiseForm(form_id, full).then((res) => {
				result = res;
				return this._promiseFormField(form_id);
			}).then((res) => {
				result.fields = res;
				resolve(result);
			}).catch((err) => {
				console.warn(err);
			});
		});
	}

	_promiseForm(form_id, full = false) {
		return new Promise((resolve, reject) => {
			let sql = 'SELECT * FROM t_form WHERE form_id = ?';
			let values = [form_id];
			this._pool.getConnection((err, db) => {
				db.query(sql, values, (err, res) => {
					if (res[0] && !err) {
						let result = {
							'label': res[0].label,
							'json': JSON.parse(res[0].json)
						};
						resolve(result);
					} else {
						reject(err ? err : res);
					}
					db.release();
				});
			});
		});
	}

	_promiseFormField(form_id) {
		return new Promise((resolve, reject) => {
			let sql = 'SELECT * FROM t_form_field WHERE form_id = ? ORDER BY `order`';
			let values = [form_id];
			this._pool.getConnection((err, db) => {
				db.query(sql, values, (err, res) => {
					if (res && !err) {
						_.each(res, (field, id) => {
							res[id].json = JSON.parse(field.json);
						});
						resolve(res);
					} else {
						reject(err ? err : res);
					}
					db.release();
				});
			});
		});
	}

	// queries (async and promise)

	_query(sql, values = []) {
		this._pool.getConnection((err, db) => {
			if (!err && db) {
				db.query(sql, values, (err, res) => {
					if (err) {
						this._logError(err);
					} else {
						this._logMessage(sql + ' ' + JSON.stringify(values));
					}
					db.release();
				});
			} else {
				this._logError(err);
			}
		});
	}

	_queryPromise(sql, values = []) {
		return new Promise((resolve, reject) => {
			this._pool.getConnection((err, db) => {
				if (!err && db) {
					db.query(sql, values, (err, res) => {
						if (err) {
							this._logError(err);
							reject(err);
						} else {
							this._logMessage(sql + ' ' + JSON.stringify(values));
							resolve(res);
						}
						db.release();
					});
				} else {
					this._logError(err);
					reject(err);
				}
			});
		});
	}

};

module.exports = DBMySQL;
