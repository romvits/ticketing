import MySqlQuery from './../mysql_query';

import _ from 'lodash';

class List extends MySqlQuery {

	/**
	 * List init load of configuration and columns
	 * @param list_id
	 * @param full
	 * @returns {Promise<any>}
	 */
	init(list_id, full = false) {
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

	/**
	 * List fetch data for a list
	 * @param values
	 * @returns {Promise<any>}
	 */
	fetch(values) {
		let req = values;
		return new Promise((resolve, reject) => {
			this.init(req.list_id, true).then((result) => {
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

	/**
	 * List Promise load for list configuration
	 * @param list_id
	 * @param full
	 * @returns {Promise<any>}
	 * @private
	 */
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

	/**
	 * List Promise load for list columns
	 * @param list_id
	 * @returns {Promise<any>}
	 * @private
	 */
	_promiseListColumn(list_id, full = false) {
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
}

module.exports = List;
