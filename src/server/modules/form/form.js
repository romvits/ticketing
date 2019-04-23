import Module from './../module';
import _ from 'lodash';

class Form extends Module {

	/**
	 * Form init load of configuration and fields
	 * @param FormID
	 * @param full
	 * @returns {Promise<any>}
	 */
	init(FormID, full = false) {
		var result = {};
		return new Promise((resolve, reject) => {
			this._promiseForm(FormID, full).then((row) => {
				result = row;
				return this._promiseFormField(FormID);
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
	 * @param FormID
	 * @param full
	 * @returns {Promise<any>}
	 * @private
	 */
	_promiseForm(FormID, full = false) {
		return new Promise((resolve, reject) => {

			let table = 'feForm';
			let where = {'FormID': FormID};

			DB.promiseSelect(table, null, where).then((res) => {
				if (!_.size(res)) {
					throw this.getError(1200, {'§§ID': FormID});
				}
				let row = {
					'label': res[0].FormName,
					'json': JSON.parse(res[0].FormJSON)
				};
				resolve(row);
			}).catch((err) => {
				reject(err);
			});
		});
	}

	/**
	 * Form Promise load for form fields
	 * @param FormID
	 * @returns {Promise<any>}
	 * @private
	 */
	_promiseFormField(FormID) {
		return new Promise((resolve, reject) => {

			let table = 'feFormField';
			let where = {'FormFieldFormID': FormID};
			let order = {'FormFieldOrder': ''};

			DB.promiseSelect(table, null, where, order).then((res) => {
				if (!_.size(res)) {
					throw this.getError(1201, {'§§ID': FormID});
				}
				let rows = [];
				_.each(res, (row, id) => {
					rows.push({
						'name': row.FormFieldName,
						'label': row.FormFieldLabel,
						'json': JSON.parse(row.FormFieldJSON)
					});
				});
				resolve(rows);
			}).catch((err) => {
				reject(err);
			});
		});
	}

}

module.exports = Form;
