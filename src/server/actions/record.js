import _ from 'lodash';

class ActionRecord {
	constructor(settings) {

		this._io = settings.io;
		this._client = settings.client;
		this._Db = settings.Db;
		this._db = settings.db;
		this._req = settings.req;
	}

	fetch() {

		if (this._req.record_id && this._req.table && this._req.pk) {

			let fields = this._req.pk;
			_.each(this._req.fields, (field) => {
				fields += ',' + field.name;
			});

			let sql = 'SELECT ' + fields + ' FROM ' + this._req.table + ' WHERE ' + this._req.pk + ' = ?';
			let values = [this._req.record_id];

			this._db.query(sql, values, (err, res) => {
				if (res && !err) {
					this._client.emit('record-fetch', res[0]);
				} else {
					console.warn(err);
				}
				this._db.release();
			});
		}
	}
}

module.exports = ActionRecord;
