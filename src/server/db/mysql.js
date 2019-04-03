import mysql from 'mysql';
import _ from 'lodash';

const logPrefix = 'MYSQL   ';

class MySql {

	/**
	 * create connection pool for mysql database
	 * create instance for all modules
	 * @param config {Object} connection configuration
	 */
	constructor(config) {
		this._debug = config.debug;
		this._pool = mysql.createPool(config.conn);
		this._log('created pool with ' + config.conn.connectionLimit + ' connection(s)');
	}

	/**
	 * Query Database without a Promise
	 * @param {String} sql native sql query (INSERT INTO table (`field1`,`field2`,`field3`) VALUES (?,?);
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
	 * @param data {Object} object with fieldname => value pairs ({'field1':'value1', 'field2':'value12'});
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
					_.each(data, (value, field) => {
						values.push(value);
						sql += comma + '`' + field + '`';
						questionmarks += comma + '?';
						comma = ',';
					});
					sql += ') VALUES (' + questionmarks + ')';
					conn.query(sql, values, (err, res) => {
						this._log(sql + ' ' + JSON.stringify(values), err);
						if (err) {
							reject(err);
						} else {
							resolve({'res': res, 'data': data});
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
						values.push(value);
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
	 * @param where {Array|Object|null} where condition for this query
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
								rejectDelete(err);
							} else {
								resolveDelete();
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
	 * archives data to `archiveRow` and `archiveRowData` tables according to the where condition<br>
	 * also multiple rows can be archived, it depends on the where condition
	 * @param table {String} database table name
	 * @param where {Array|Object|null} where condition for this query
	 * @private
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
				log.msg(logPrefix, message);
			} else {
				log.err(logPrefix, error);
			}
		}
	}
};

module.exports = MySql;
