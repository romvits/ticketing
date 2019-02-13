import _ from 'lodash';

class ActionForm {

	constructor(settings) {
		this._io = settings.io;
		this._client = settings.client;
		this._Db = settings.Db;
		this._db = settings.db;
		this._req = settings.req;
	}

	init() {
		this.getForm(this._req.form_id).then((result) => {
			this._client.emit('form-init', result);
			this._db.release();
		});
	}

	getForm(form_id, full = false) {
		var result = {};
		return new Promise((resolve, reject) => {
			this._promiseForm(form_id, full).then((res) => {
				result = res;
				return this._promiseFormField(form_id);
			}).then((res) => {
				result.fields = res;
				resolve(result);
			}).catch((err) => {
				console.warn(err);
				this._db.release();
			});
		});
	}

	_promiseForm(form_id, full = false) {
		return new Promise((resolve, reject) => {
			let sql = 'SELECT * FROM t_form WHERE form_id = ?';
			let values = [form_id];

			this._db.query(sql, values, (err, res) => {
				if (res[0] && !err) {
					let result = {
						'label': res[0].label,
						'json': JSON.parse(res[0].json)
					};
					resolve(result);
				} else {
					reject(err ? err : res);
				}
			});
		});
	}

	_promiseFormField(form_id) {
		return new Promise((resolve, reject) => {
			let sql = 'SELECT * FROM t_form_field WHERE form_id = ? ORDER BY `order`';
			let values = [form_id];

			console.log(sql, values);

			this._db.query(sql, values, (err, res) => {
				if (res && !err) {
					_.each(res, (field, id) => {
						res[id].json = JSON.parse(field.json);
					});
					resolve(res);
				} else {
					reject(err ? err : res);
				}
			});
		});
	}
}

module.exports = ActionForm;
