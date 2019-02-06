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

					sql = 'SELECT COUNT(*) AS count FROM ' + res[0].table;
					values = [this._req.list_id];

					this._db.query(sql, values, (err, res_count) => {
						if (!err) {
							this._client.emit('list-init', {
								'count': res_count[0].count,
								'pk': res[0].pk,
								'json': JSON.parse(res[0].json)
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
					let json = JSON.parse(res[0].json);
					let columns = json.columns;
					let table = res[0].table;
					let limit = res[0].limit;

					sql = 'SELECT * FROM ' + table;
					(limit) ? sql += ' LIMIT 0,' + limit : null;

					values = [];
					this._db.query(sql, values, (err, res) => {
						if (!err) {
							this._client.emit('list-fetch', res);
						} else {
							console.warn(err);
						}
					});
				}
			} else {
				console.warn(err);
			}
		});
	}
}

module.exports = ActionList;
