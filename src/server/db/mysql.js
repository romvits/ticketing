import Helpers from './../helpers';
import mysql from 'mysql';
import _ from 'lodash';

const logPrefix = 'MYSQL   ';

class MySql extends Helpers {

	/**
	 * create connection pool for mysql database<br>
	 * create instance for all modules<br>
	 * look also at: <a target="_blank" href="https://www.npmjs.com/package/sequelize">https://www.npmjs.com/package/sequelize</a> (TODO)
	 * @param config {Object} connection configuration
	 */
	constructor(config) {
		super();
		this._debug = false;
		this._translate = {};
		this._pool = mysql.createPool(_.extend(config.conn, {multipleStatements: true}));
		this._log('created pool with ' + config.conn.connectionLimit + ' connection(s)');
	}

	/**
	 * Query Database without a Promise
	 * @param {String} sql native sql query (INSERT INTO table (`field1`,`field2`,`field3`) VALUES (?,?));
	 * @param {Array} values array of values (Array('value1','value2',123))
	 */
	query(sql, values = []) {
		this._pool.getConnection((err, conn) => {
			if (!err && conn) {
				conn.query(sql, values, (err, res) => {
					this._log(sql + ' ' + JSON.stringify(values), err);
					conn.release();
				});
			} else {
				this._log(null, err);
			}
		});
	}

	/**
	 * Query Database with a Promise
	 * @param {String} sql native sql query (INSERT INTO table (`field1`,`field2`,`field3`) VALUES (?,?,?);
	 * @param {Array} values array of values (Array('value1','value2',123))
	 * @returns {Promise<any>} with resultset of this query in the resolve callback
	 */
	promiseQuery(sql, values = []) {
		return new Promise((resolve, reject) => {
			this._pool.getConnection((err, conn) => {
				if (!err && conn) {
					conn.query(sql, values, (err, res) => {
						this._log(sql + ' ' + JSON.stringify(values), err);
						if (err) {
							reject(err);
						} else {
							resolve(res);
						}
						conn.release();
					});
				} else {
					this._log(null, err);
					reject(err);
				}
			});
		});
	}

	/**
	 * promised insert query
	 * @param table {String} database table name
	 * @param data {Object|Array} object with fieldname => value pairs ({'field1':'value1', 'field2':'value2'}) | array of objects for multiple row insert => array value pairs ([{'field1':'value1', 'field2':'value2'},{'field3':'value1', 'field2':'value4'}])
	 * @returns {Promise<any>} with resultset of this query in the resolve callback
	 */
	promiseInsert(table, data) {
		return new Promise((resolve, reject) => {
			this._pool.getConnection((err, conn) => {
				if (!err && conn) {
					let sql = 'INSERT INTO `' + table + '` (';
					let questionmarks = '';
					let values = [];
					let comma = '';
					if (_.isArray(data)) {
						_.each(data[0], (value, field) => {
							sql += comma + '`' + field + '`';
							questionmarks += comma + '?';
							comma = ',';
						});
						sql += ') VALUES ';
						comma = '';
						_.each(data, (row) => {
							sql += comma + '(' + questionmarks + ')';
							comma = ',';
							_.each(row, (value) => {
								values.push((_.isObject(value)) ? JSON.stringify(value) : value);
							});
						});
					} else if (_.isObject(data)) {
						_.each(data, (value, field) => {
							values.push((_.isObject(value)) ? JSON.stringify(value) : value);
							sql += comma + '`' + field + '`';
							questionmarks += comma + '?';
							comma = ',';
						});
						sql += ') VALUES (' + questionmarks + ')';
					}
					conn.query(sql, values, (err, res) => {
						this._log(sql + ' ' + JSON.stringify(values), err);
						if (err) {
							reject(err);
						} else {
							resolve(_.extend(res, {'data': data}));
						}
						conn.release();
					});
				} else {
					this._log(null, err);
					reject(err);
				}
			});
		});
	}

	/**
	 * promised select query
	 * @param table {String} database table name
	 * @param fields {Array|null} array of fields which will be returned by the select query | if fields is null all fields will be returned
	 * @param where {Array|Object|null} where condition for this query
	 *          - array       => multiple objects for the where condition ([{'field1':'value1'},{'field2':'value2']])<br>
	 * 			- object      => object with two elements ({'conditions':'(field1 = ? and field2 = ?) or (field3 > ? or field3 < ?)','values':['abc','def',1,2]})<br>
	 * 			- object      => object of field value pair ({'field':'value'})<br>
	 * 			- null		  => if where condition is null all rows will be returned
	 * @param order {Array|Object|String|null} order condition for this query
	 *          - array       => array of objects ([{'field1':'asc'},{'field2':'desc'},{'field3':'' <= empty same as asc>}])<br>
	 *          - object      => object of field and orderdir ({'field':'desc|asc'})<br>
	 *          - string      => native order by condition ('field1 asc, field2 desc, field3')<br>
	 *          - null        => no order by condition for this select query
	 * @param from {Integer} limit from for this query
	 * @param count {Integer} limit count for this query
	 * @returns {Promise<any>} with resultset of this query in the resolve callback
	 */
	promiseSelect(table, fields = null, where = null, order = null, from = null, count = null) {
		return new Promise((resolveSelect, rejectSelect) => {
			this._pool.getConnection((err, conn) => {
				if (!err && conn) {
					fields = (fields !== null && _.isArray(fields)) ? '`' + _.join(fields, '`,`') + '`' : '*';
					let conditionWhere = this._where(where);
					let conditionOrder = this._order(order);
					let sql = 'SELECT ' + fields + ' FROM `' + table + '`';
					sql += conditionWhere.where;
					sql += conditionOrder;
					if (from != null && count != null) {
						sql += ' LIMIT ' + from + ',' + count;
					} else if (from == null && count != null) {
						sql += ' LIMIT ' + count;
					}
					conn.query(sql, conditionWhere.values, (err, res) => {
						this._log(sql + ' ' + JSON.stringify(conditionWhere.values), err);
						if (err) {
							rejectSelect(err);
						} else {
							resolveSelect(res);
						}
						conn.release();
					});
				} else {
					this._log(null, err);
					rejectSelect(err);
				}
			});
		});
	}

	/**
	 * promise select fulltext search query
	 * TODO: implementation :)
	 * @param table {String} database table name
	 * @param fields {Array|null} array of fields which will be returned by the select query | if fields is null all fields will be returned
	 * @param match {String} string of fields for fulltext search ('UserCompany, UserFirstname, UserLastname, UserEmail')
	 * @param against {String} string to search for
	 * @returns {Promise<any>} with resultset of this query in the resolve callback
	 */
	promiseSelectFulltext(table, fields = null, match, against) {
		// Select * from students where match(first_name, last_name) AGAINST ('Ade');
	}

	/**
	 * promised update query<br>
	 * before update is processed a select is done and data where saved to archive table<br>
	 * @param table {String} database table name
	 * @param data {Object} object with fieldname => value pairs ({'field1':'value1', 'field2':'value12'});
	 * @param where {Array|Object|null} where condition for this query
	 * @returns {Promise<any>} with resultset of this query in the resolve callback
	 */
	promiseUpdate(table, data, where) {
		return new Promise((resolveUpdate, rejectUpdate) => {
			this._pool.getConnection((err, conn) => {
				if (!err && conn) {
					let sql = 'UPDATE `' + table + '` SET ';
					let values = [];
					let comma = '';
					_.each(data, (value, field) => {
						sql += comma + '`' + field + '`=?';
						values.push((_.isObject(value)) ? JSON.stringify(value) : value);
						comma = ',';
					});
					let condition = this._where(where);
					sql += condition.where;
					values = values.concat(condition.values);
					if (condition.where && _.size(condition.values)) {
						this._log(sql + ' ' + JSON.stringify(values), err);
						conn.query(sql, values, (err, res) => {
							if (err) {
								console.log(err);
								rejectUpdate(err);
							} else {
								resolveUpdate(res);
							}
							conn.release();
						});
					} else {
						this._log(null, 'UPDATE operation without WHERE condition is not allowed!');
						this._log(null, sql);
						this._log(null, where);
						rejectDelete(err);
					}
				} else {
					this._log(null, err);
					rejectUpdate(err);
				}
			});
		});
	}

	/**
	 * promised delete query<br>
	 * before delete is processed a select is done and data where saved to archive table<br>
	 * @param table {String} database table name
	 * @param where {Array|Object} where condition for this query
	 * @returns {Promise<any>} with resultset of this query in the resolve callback
	 */
	promiseDelete(table, where) {
		return new Promise((resolveDelete, rejectDelete) => {
			this._pool.getConnection((err, conn) => {
				if (!err && conn) {
					let sql = 'DELETE FROM `' + table + '`';
					let condition = this._where(where);
					sql += condition.where;
					if (condition.where && _.size(condition.values)) {
						conn.query(sql, condition.values, (err, res) => {
							this._log(sql + ' ' + JSON.stringify(condition.values), err);
							if (err) {
								this._log(null, err);
								rejectDelete(err);
							} else {
								resolveDelete(condition.values);
							}
							conn.release();
						});
					} else {
						this._log(null, 'DELETE operation without WHERE condition is not allowed!');
						this._log(null, sql);
						this._log(null, where);
						rejectDelete(err);
					}
				} else {
					this._log(null, err);
					rejectDelete(err);
				}
			});
		});
	}

	/**
	 * promised count query<br>
	 * http://www.mysqltutorial.org/mysql-count/
	 * @param table {String} database table name
	 * @param where {Array|Object|null} where condition for this query
	 * @param fields {String|*} optional parameter - string which will be used for the select count query (eg field1,COUNT(field2) AS count) | if fields is empty COUNT(*) is used
	 * @param groupby {String} optional parameter - string for a GROUP BY condition
	 * @param having {String} optional parameter - string for a HAVING condition
	 * @returns {Promise<any>} with resultset of this query in the resolve callback
	 */
	promiseCount(table, where = null, fields = '*', groupby = null, having = null) {
		return new Promise((resolveCount, rejectCont) => {
			this._pool.getConnection((err, conn) => {
				if (!err && conn) {
					fields = (fields !== '*' && fields) ? fields : 'COUNT(*)';
					let sql = 'SELECT ' + fields + ' FROM `' + table + '`';
					let condition = this._where(where);
					sql += condition.where;
					(groupby !== null) ? sql += ' GROUP BY ' + groupby : null;
					(having !== null) ? sql += ' HAVING ' + having : null;
					conn.query(sql, condition.values, (err, res) => {
						this._log(sql + ' ' + JSON.stringify(condition.values), err);
						if (err) {
							rejectCont(err);
						} else {
							resolveCount(res);
						}
						conn.release();
					});
				} else {
					this._log(null, err);
					rejectCont(err);
				}
			});
		});
	}

	/**
	 * select translation value
	 * @param Token {String}
	 * @param LangCode {String}
	 * @param TransID {String}
	 * @returns {Promise<any>}
	 */
	promiseTranslateSelect(Token, LangCode, TransID = null) {
		let index = (TransID ? TransID : '') + LangCode + Token;
		return new Promise((resolveTranslate, rejectTranslate) => {
			if (!this._translate[index]) {
				this._pool.getConnection((err, conn) => {
					if (!err && conn) {
						let sql = "SELECT TransValue FROM `feTrans` WHERE ";
						TransID ? sql += 'TransID = ? ' : sql += 'TransID IS ? ';
						Token ? sql += 'AND TransToken = ? ' : sql += 'AND TransToken IS ? ';
						LangCode ? sql += 'AND TransLangCode = ? ' : sql += 'AND TransLangCode IS ? ';
						conn.query(sql, [TransID, Token, LangCode], (err, res) => {
							this._log(sql, err);
							if (err) {
								rejectTranslate(err);
							} else {
								this._translate[index] = res[0].TransValue;
								resolveTranslate(this._translate[index]);
							}
							conn.release();
						});
					} else {
						this._log(null, err);
						rejectTranslate(err);
					}
				});
			} else {
				resolveTranslate(this._translate[index]);
			}
		});
	}

	/**
	 * insert or update token value
	 * @param Token {String}
	 * @param LangCode {String}
	 * @param Value {String}
	 * @param TransID {String}
	 * @returns {Promise<any>}
	 */
	promiseTranslateReplace(values) {
		let index = values.TransID ? values.TransID : '';
		index += values.LangCode ? values.LangCode : '';
		index += values.Token ? values.Token : '';
		this._translate[index] = values.Value ? values.Value : '';
		return new Promise((resolve, reject) => {
			this._pool.getConnection((err, conn) => {
				if (!err && conn) {
					let sql = "SELECT TransValue FROM `feTrans` WHERE ";
					values.TransID ? sql += 'TransID = ? ' : sql += 'TransID IS ? ';
					values.Token ? sql += 'AND TransToken = ? ' : sql += 'AND TransToken IS ? ';
					values.LangCode ? sql += 'AND TransLangCode = ? ' : sql += 'AND TransLangCode IS ? ';
					let sqlValues = [values.TransID ? values.TransID : null, values.Token ? values.Token : null, values.LangCode ? values.LangCode : null];
					conn.query(sql, sqlValues, (err, res) => {
						if (err) {
							this._log(sql + ' ' + JSON.stringify(values), err);
							reject(err);
						} else {
							let sql = '';
							let sqlValues = [];
							if (_.size(res)) {
								sql = "UPDATE `feTrans` SET TransValue = ? WHERE ";
								values.TransID ? sql += 'TransID = ? ' : sql += 'TransID IS ? ';
								values.Token ? sql += 'AND TransToken = ? ' : sql += 'AND TransToken IS ? ';
								values.LangCode ? sql += 'AND TransLangCode = ? ' : sql += 'AND TransLangCode IS ? ';
								sqlValues = [values.Value ? values.Value : null, values.TransID ? values.TransID : null, values.Token ? values.Token : null, values.LangCode ? values.LangCode : null];
							} else {
								sql = 'INSERT INTO `feTrans` (TransID,TransToken,TransLangCode,TransTransGroupID,TransValue) VALUES (?,?,?,?,?)';
								sqlValues = [values.TransID ? values.TransID : null, values.Token ? values.Token : null, values.LangCode ? values.LangCode : null, values.Group ? values.Group : null, values.Value ? values.Value : null];
							}
							conn.query(sql, sqlValues, (err, res) => {
								conn.release();
								this._log(sql + ' ' + JSON.stringify(sqlValues), err);
								if (err) {
									reject(err);
								} else {
									resolve(res);
								}
							});
						}
					});
				} else {
					this._log(null, err);
					reject(err);
				}
			});
		});

	}

	/**
	 * fetch multiple translation depending on LangCode and TransID
	 * @param Token
	 * @param LangCode
	 * @param TransID
	 * @returns {Promise<any>}
	 */
	promiseTranslate(Token, LangCode, LangCodeDefault, TransID = null) {
		return new Promise((resolveTranslate, rejectTranslate) => {
			let ret = {};
			let index = (TransID ? TransID : '') + LangCode;
			let TransTokenArray = Token;
			if (!_.isArray(TransTokenArray)) {
				TransTokenArray = [Token];
			}
			let sql = "SELECT TransLangCode, TransToken, TransValue FROM `feTrans` WHERE ";
			TransID ? sql += 'TransID = ? ' : sql += 'TransID IS ? ';
			sql += 'AND (TransLangCode = ? OR TransLangCode = ?) ';
			sql += 'AND ('
			let whereArray = [TransID, LangCode, LangCodeDefault];
			let or = '';
			_.each(TransTokenArray, Token => {
				if (Token) {
					if (this._translate[index + Token]) {
						ret[Token] = this._translate[index + Token];
					} else {
						whereArray.push(Token);
						sql += or + 'TransToken=?';
						or = ' OR ';
					}
				}
			});
			sql += ')';
			if (_.size(whereArray) > 3) {
				this._pool.getConnection((err, conn) => {
					if (!err && conn) {
						conn.query(sql, whereArray, (err, res) => {
							conn.release();
							this._log(sql, err);
							if (err) {
								rejectTranslate(err);
							} else {
								_.each(res, row => {
									if (row.TransLangCode === LangCode) {
										ret[row.TransToken] = row.TransValue;
										this._translate[index + row.TransToken] = row.TransValue;
									}
								});
								_.each(res, row => {
									if (!ret[row.TransToken] && row.TransLangCode === LangCodeDefault) {
										ret[row.TransToken] = row.TransValue;
										this._translate[index + row.TransToken] = row.TransValue;
									}
								});
								resolveTranslate(ret);
							}
						});
					}
				});
			} else {
				console.log(ret);
				resolveTranslate(ret);
			}
		});
	}

	/**
	 * fetch all translation tokens
	 * @param TransID {String} 32 characters EventID
	 * @param LangCode {String} 5 language code
	 * @returns {Promise<any>}
	 */
	promiseTransID(TransID, LangCode = null) {
		return new Promise((resolveTrans, rejectTrans) => {
			let ret = {};
			let whereArray = [TransID];
			let sql = "SELECT TransLangCode, TransToken, TransValue FROM `feTrans` WHERE TransID = ?";
			if (LangCode !== null) {
				sql += ' AND (TransLangCode = ?';
				whereArray.push(LangCode);
				if (_.size(LangCode) === 5) {
					sql += ' OR TransLangCode = ?';
					whereArray.push(LangCode.substring(0, 2));
				}
				sql += ')';
			}
			this._pool.getConnection((err, conn) => {
				if (!err && conn) {
					conn.query(sql, whereArray, (err, res) => {
						conn.release();
						this._log(sql, err);
						if (err) {
							rejectTrans(err);
						} else {
							_.each(res, row => {
								if (row.TransLangCode === LangCode) {
									ret[row.TransToken] = row.TransValue;
								}
							});
							resolveTrans(ret);
						}
					});
				}
			});
		});
	}

	/**
	 * archives data to `archiveRow` and `archiveRowData` tables according to the where condition<br>
	 * also multiple rows can be archived, it depends on the where condition
	 * @param table {String} database table name
	 * @param where {Array|Object|null} where condition for this query
	 * TODO: implementation :)
	 */
	promiseArchive(table, where) {
		return new Promise((resolveArchive, rejectArchive) => {
			this._pool.getConnection((err, conn) => {
				if (!err && conn) {
					this.promiseSelect(table, null, where).then((res) => {
						if (_.size(res)) {
							_.each(res, (row) => {
								console.log(row);
							});
						} else {

						}
						resolveArchive();
					}).catch((err) => {
						rejectArchive(err);
					});
				} else {
					this._log(null, err);
					rejectArchive(err);
				}
			});
		});
	}

	/**
	 * creates the where condition for queries (select, update, delete)
	 * @param where {Array|Object|null}
	 *          - array       => multiple objects for the where condition ([{'field1':'value1'},{'field2':'value2']])<br>
	 * 			- object      => object with two elements ({'conditions':'(field1 = ? and field2 = ?) or (field3 > ? or field3 < ?)','values':['abc','def',1,2]})<br>
	 * 			- object      => object of field value pair ({'field':'value'})<br>
	 * 			- null		  => if where condition is null all rows will be returned
	 * @returns {Object} object with condition string and values as array
	 * @private
	 */
	_where(where) {
		let whereString = '';
		let valuesArray = [];
		let ret = {
			'where': whereString,
			'values': valuesArray
		};
		if (where !== null) {
			if (_.isArray(where) || (_.isObject(where) && (!where.conditions || !where.values))) {
				let and = '';
				_.each(where, (value, field) => {
					whereString += and + field + "=?";
					valuesArray.push(value);
					and = ' AND ';
				});
			} else if (_.isObject(where) && where.conditions && where.values) {
				whereString += where.conditions;
				valuesArray = where.values;
			}
			if (whereString && _.size(valuesArray)) {
				ret = {
					'where': ' WHERE ' + whereString,
					'values': valuesArray
				}
			}
		}
		return ret;
	}

	/**
	 * creates the order condition string for a select query
	 * @param order {Array|Object|String|null} array of objects for order by for this query<br>
	 *          - array       => array of objects ([{'field1':'asc'},{'field2':'desc'},{'field3':'' <= empty same as asc>}])<br>
	 *          - object      => object of field and orderdir ({'field':'desc|asc'})<br>
	 *          - string      => native order by condition ('field1 asc, field2 desc, field3')<br>
	 *          - null        => no order by condition for this select query
	 * @returns {String} string with order condition
	 * @private
	 */
	_order(order) {
		let orderString = '';
		if (order !== null && _.size(order)) {
			orderString += ' ORDER BY ';
			if (_.isArray(order)) {
				let comma = '';
				_.each(order, (obj) => {
					orderString += comma + Object.keys(obj);
					if (obj[Object.keys(obj)].toLowerCase() === 'desc') {
						orderString += ' DESC';
					}
					comma = ',';
				});
			} else if (_.isObject(order)) {
				orderString += Object.keys(order);
				if (order[Object.keys(order)].toLowerCase() === 'desc') {
					orderString += ' DESC';
				}
			} else {
				orderString += order;
			}
		}
		return orderString;
	}

	/** log messages and errors **/
	_log(message = null, error = null) {
		if (this._debug) {
			if (!error) {
				LOG.msg(logPrefix, message);
			} else {
				LOG.err(logPrefix, error);
			}
		}
	}
};

module.exports = MySql;
