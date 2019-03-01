import MySqlQuery from './../mysql_query';
import Validator from 'better-validator';
import _ from 'lodash';

const fields = {
	'name': {'type': 'string', 'length': 200, 'empty': false},
	'strasse': {'type': 'string', 'length': 200, 'empty': false},
	'plz': {'type': 'string', 'length': 10, 'empty': false},
	'ort': {'type': 'string', 'length': 200, 'empty': false},
	'land': {'type': 'string', 'length': 200, 'empty': false},
	'telefon': {'type': 'phone', 'length': 20, 'empty': false}
};

class Location extends MySqlQuery {

	/**
	 * create new location
	 * @param values
	 * @returns {Promise<any>}
	 */
	create(values) {
		return new Promise((resolve, reject) => {

			const err = this._validator(fields, values);

			if (!err.length) {

				var fields_string = '';
				var values_string = '';
				var comma = '';

				_.each(fields, (settings, name) => {
					fields_string += comma + '`' + name + '`';
					values_string += comma + '?';
					comma = ',';
				});

				let sql = 'INSERT INTO tabLocation (' + fields_string + ') VALUES (' + values_string + ')';
				this._queryPromise(sql, values).then((res) => {
					resolve(user_id);
				}).catch((err) => {
					console.log(err);
					reject(err);
				});
			} else {
				reject(err);
			}
		});
	}


}