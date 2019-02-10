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
		let sql = 'SELECT * FROM t_list WHERE list_id = ?';
		let values = [this._req.list_id];

		this._db.query(sql, values, (err, res) => {
			if (!err) {
				if (res.length) {

					let row = res[0];

					sql = 'SELECT COUNT(*) AS count FROM ' + row.table;
					values = [this._req.list_id];

					this._db.query(sql, values, (err, res_count) => {
						if (!err) {

							let row_count = res_count[0];

							this._client.emit('list-init', {
								'count': row_count.count,
								'pk': row.pk,
								'editable': row.editable,
								'json': JSON.parse(row.json)
							});
							this._db.release();
						} else {
							console.warn(err);
							this._db.release();
						}
					});
				} else {
					console.warn(err);
					this._db.release();
				}
			} else {
				console.warn(err);
				this._db.release();
			}
		});
	}

	fetch() {
		let sql = 'SELECT * FROM t_list WHERE list_id = ?';
		let values = [this._req.list_id];

		this._db.query(sql, values, (err, res) => {
			if (!err) {
				if (res.length) {

					let row = res[0];

					let json = JSON.parse(row.json);
					let columns = json.columns;
					let table = row.table;
					let limit = row.limit;
					let fields = row.pk;
					let orderby = this._req.orderby ? this._req.orderby : json.orderby;
					let orderdesc = this._req.orderdesc ? this._req.orderdesc : false;

					_.each(columns, (column) => {
						fields += ',' + column.name;
					});

					sql = 'SELECT ' + fields + ' FROM ' + table;
					(orderby) ? sql += ' ORDER BY ' + orderby : null;
					(orderby && orderdesc) ? sql += ' DESC, ' + row.pk : '';
					(limit) ? sql += ' LIMIT ' + this._req.from + ',' + limit : null;

					values = [];
					this._db.query(sql, values, (err, rows) => {
						if (!err) {
							this._client.emit('list-fetch', {'orderby': orderby, 'rows': rows});
						} else {
							console.warn(err);
						}
						this._db.release();
					});
				}
			} else {
				console.warn(err);
				this._db.release();
			}
		});
	}
}

module.exports = ActionList;
