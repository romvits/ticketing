import _ from 'lodash';

class Form {

	/**
	 * Form init load of configuration and fields
	 * @param form_id
	 * @param full
	 * @returns {Promise<any>}
	 */
	init(form_id, full = false) {
		var result = {};
		return new Promise((resolve, reject) => {
			this._promiseForm(form_id, full).then((row) => {
				result = row;
				return this._promiseFormField(form_id);
			}).then((rows) => {
				result.fields = rows;
				resolve(result);
			}).catch((err) => {
				console.warn(err);
			});
		});
	}

	/**
	 * Form Promise load for form configuration
	 * @param form_id
	 * @param full
	 * @returns {Promise<any>}
	 * @private
	 */
	_promiseForm(form_id, full = false) {
		return new Promise((resolve, reject) => {
			let sql = 'SELECT * FROM feForm WHERE FormID = ?';
			let values = [form_id];
			this._pool.getConnection((err, db) => {
				db.query(sql, values, (err, res) => {
					if (res[0] && !err) {
						let row = {
							'label': res[0].FormName,
							'json': JSON.parse(res[0].FormJSON)
						};
						resolve(row);
					} else {
						reject(err ? err : res);
					}
					db.release();
				});
			});
		});
	}

	/**
	 * Form Promise load for form fields
	 * @param form_id
	 * @returns {Promise<any>}
	 * @private
	 */
	_promiseFormField(form_id) {
		return new Promise((resolve, reject) => {
			let sql = 'SELECT * FROM feFormField WHERE FormFieldFormID = ? ORDER BY `FormFieldOrder`';
			let values = [form_id];
			this._pool.getConnection((err, db) => {
				db.query(sql, values, (err, res) => {
					if (res && !err) {
						let rows = [];
						_.each(res, (row, id) => {
							rows.push({
								'name': row.FormFieldName,
								'label': row.FormFieldLabel,
								'json': JSON.parse(row.FormFieldJSON)
							});
						});
						resolve(rows);
					} else {
						reject(err ? err : res);
					}
					db.release();
				});
			});
		});
	}

}

module.exports = Form;
