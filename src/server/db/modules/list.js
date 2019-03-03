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
		let res = {};
		return new Promise((resolve, reject) => {
			this._promiseList(list_id, full).then((row) => {
				res = row;
				return this._promiseListColumn(list_id);
			}).then((rows) => {
				res.columns = rows;
				resolve(res);
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
				let columns = result.columns;
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
			let sql = 'SELECT * FROM feList WHERE ListID = ?';
			let values = [list_id];
			this._pool.getConnection((err, db) => {
				db.query(sql, values, (err, res) => {
					if (res.length && !err) {
						sql = 'SELECT COUNT(*) AS count FROM ' + res[0].ListTable;
						db.query(sql, values, (err, res_count) => {
							if (!err) {
								let row = {
									'label': res[0].ListName,
									'pk': res[0].ListPK,
									'mask_id': res[0].ListMaskID,
									'count': res_count[0].count,
									'limit': res[0].ListLimit,
									'json': JSON.parse(res[0].ListJSON)
								};
								if (full) {
									row.table = res[0].ListTable;
									row.limit = res[0].ListLimit;
								}
								db.release();
								resolve(row);
							}
						});
					} else if (!err) {
						reject({'nr': 2002, 'message': 'list not found'});
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
			let sql = 'SELECT * FROM feListColumn WHERE ListColumnListID = ? ORDER BY `ListColumnOrder`';
			let values = [list_id];
			this._pool.getConnection((err, db) => {
				db.query(sql, values, (err, res) => {
					if (res.length && !err) {
						let rows = [];
						_.each(res, (row, id) => {
							rows.push({
								'id': row.ListColumnID,
								'name': row.ListColumnName,
								'label': row.ListColumnLabel,
								'width': row.ListColumnWidth,
								'editable': row.ListColumnEditable,
								'type': row.ListColumnType,
								'json': JSON.parse(row.ListColumnJSON)
							});
						});
						db.release();
						resolve(rows);
					} else if (!err) {
						reject({'nr': 2003, 'message': 'no columns for this list found'});
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
