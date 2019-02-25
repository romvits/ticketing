import MySqlQuery from './../mysql_query';

import _ from 'lodash';

class Form extends MySqlQuery {

	/**
	 * Form init load of configuration and fields
	 * @param form_id
	 * @param full
	 * @returns {Promise<any>}
	 */
	init(form_id, full = false) {
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
			let sql = 'SELECT * FROM t_form WHERE form_id = ?';
			let values = [form_id];
			this._pool.getConnection((err, db) => {
				db.query(sql, values, (err, res) => {
					if (res[0] && !err) {
						let result = {
							'label': res[0].label,
							'json': JSON.parse(res[0].json)
						};
						resolve(result);
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
			let sql = 'SELECT * FROM t_form_field WHERE form_id = ? ORDER BY `order`';
			let values = [form_id];
			this._pool.getConnection((err, db) => {
				db.query(sql, values, (err, res) => {
					if (res && !err) {
						_.each(res, (field, id) => {
							res[id].json = JSON.parse(field.json);
						});
						resolve(res);
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
