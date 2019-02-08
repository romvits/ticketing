import _ from 'lodash';

class ActionMask {
	constructor(settings) {

		this._io = settings.io;
		this._client = settings.client;
		this._Db = settings.Db;
		this._db = settings.db;
		this._req = settings.req;
	}

	fetch() {

		let res_mask;

		this._query_mask().then((res) => {
			res_mask = res[0];
			return this._query_mask_chapter();
		}).then((res) => {
			res_mask.chapter = res;
			this._client.emit('mask-fetch', res_mask);
			this._db.release();
		}).catch((err) => {
			console.warn(err);
			this._db.release();
		});
	}

	_query_mask() {
		return new Promise((resolve, reject) => {
			let sql = 'SELECT * FROM t_mask WHERE mask_id = ?';
			let values = [this._req.mask_id];

			this._db.query(sql, values, (err, res) => {
				if (res && !err) {
					resolve(res);
				} else {
					reject(err ? err : res);
				}
			});
		});
	}

	_query_mask_chapter() {
		return new Promise((resolve, reject) => {
			let sql = 'SELECT * FROM t_mask_chapter WHERE mask_id = ? ORDER BY `order`';
			let values = [this._req.mask_id];

			this._db.query(sql, values, (err, res) => {
				if (res && !err) {
					resolve(res);
				} else {
					reject(err ? err : res);
				}
			});
		});
	}
}

module.exports = ActionMask;
