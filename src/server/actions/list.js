import _ from 'lodash';

class ActionList {

	constructor(settings) {
		this._io = settings.io;
		this._client = settings.client;
		this._Db = settings.Db;
		this._db = settings.db;
		this._req = settings.req;
	}

	init() {
		this.getList(this._req.list_id).then((result) => {
			this._client.emit('list-init', result);
			this._db.release();
		});
	}

	getList(list_id, full = false) {
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

			this._db.query(sql, values, (err, res) => {
				if (res[0] && !err) {

					sql = 'SELECT COUNT(*) AS count FROM ' + res[0].table;
					values = [this._req.list_id];

					this._db.query(sql, values, (err, res_count) => {
						if (!err) {
							let result = {
								'label': res[0].label,
								'pk': res[0].pk,
								'count': res_count[0].count,
								'json': JSON.parse(res[0].json)
							};
							if (full) {
								result.table = res[0].table;
								result.limit = res[0].limit;
							}
							resolve(result);
						}
					});

				} else {
					reject(err ? err : res);
				}
			});
		});
	}

	_promiseListColumn(list_id) {
		return new Promise((resolve, reject) => {
			let sql = 'SELECT * FROM t_list_column WHERE list_id = ? ORDER BY `order`';
			let values = [list_id];

			this._db.query(sql, values, (err, res) => {
				if (res && !err) {
					_.each(res, (column, id)=>{
						res[id].json = JSON.parse(column.json);
					});
					resolve(res);
				} else {
					reject(err ? err : res);
				}
			});
		});
	}

	fetch() {

		this.getList(this._req.list_id, true).then((result) => {

			let json = result.json;
			let columns = json.columns;
			let table = result.table;
			let limit = result.limit;
			let fields = result.pk;
			let orderby = this._req.orderby ? this._req.orderby : json.orderby;
			let orderdesc = this._req.orderdesc ? this._req.orderdesc : false;

			_.each(columns, (column) => {
				fields += ',' + column.name;
			});

			let sql = 'SELECT ' + fields + ' FROM ' + table;

			if (orderby) {
				sql += ' ORDER BY ' + orderby;
				(orderdesc) ? sql += ' DESC' : '';
				sql += ',' + result.pk
			}

			(limit) ? sql += ' LIMIT ' + this._req.from + ',' + limit : null;

			let values = [];
			this._db.query(sql, values, (err, rows) => {
				if (!err) {
					this._client.emit('list-fetch', {'orderby': orderby, 'rows': rows});
				} else {
					console.warn(err);
				}
				this._db.release();
			});

		});
	}
}

module.exports = ActionList;
