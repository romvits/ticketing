import _ from 'lodash';
import ActionRecord from './record';

class ActionForm {
	constructor(settings) {

		this._io = settings.io;
		this._client = settings.client;
		this._Db = settings.Db;
		this._db = settings.db;
		this._req = settings.req;
	}

	init() {

		let sql = 'SELECT * FROM t_form WHERE form_id = ?';
		let values = [this._req.form_id];

		this._db.query(sql, values, (err, res) => {
			if (res && !err) {
				this._client.emit('form-init', JSON.parse(res[0].json));
				if (!this._req.record_id) {
					this._db.release();
				} else {
					const json = JSON.parse(res[0].json);
					const record = new ActionRecord({
						'io': this._io,
						'client': this._client,
						'db': this._db,
						'Db': this._Db,
						'req': _.extend(this._req, {
							'table': res[0].table,
							'pk': res[0].pk,
							'fields': json.fields
						})
					});
					record.fetch();
				}
			} else {
				console.warn(err);
				this._db.release();
			}
		});
	}

}

module.exports = ActionForm;
