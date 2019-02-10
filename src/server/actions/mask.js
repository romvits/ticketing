import _ from 'lodash';
import ActionRecord from './record';

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

		this.query_mask(this._req.mask_id).then((res) => {
			res_mask = res[0];
			return this.query_mask_chapter(this._req.mask_id);
		}).then((res) => {
			res_mask.chapter = res;
			//if (this._req.record_id) {
				/*
				const record = new ActionRecord({
					'io': this._io,
					'client': this._client,
					'Db': this._Db,
					'db': this._db,
					'req': this._req
				});
				record.fetchPromise().then((res) => {
					this._client.emit('mask-fetch', {
						'mask': res_mask,
						'record': res
					});
					this._db.release();
				});
				*/
			//} else {
				this._client.emit('mask-fetch', {
					'mask': res_mask,
					'record': null
				});
				this._db.release();
			//}
		}).catch((err) => {
			console.warn(err);
			this._db.release();
		});
	}

	query_mask(mask_id) {
		return new Promise((resolve, reject) => {
			let sql = 'SELECT * FROM t_mask WHERE mask_id = ?';
			let values = [mask_id];

			this._db.query(sql, values, (err, res) => {
				if (res && !err) {
					resolve(res);
				} else {
					reject(err ? err : res);
				}
			});
		});
	}

	query_mask_chapter(mask_id) {
		return new Promise((resolve, reject) => {
			let sql = 'SELECT * FROM t_mask_chapter WHERE mask_id = ? ORDER BY `order`';
			let values = [mask_id];

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
