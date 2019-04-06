import Helpers from './../helpers';
import _ from 'lodash';

/**
 * basic module class
 * all modules should extend this class
 * this class is also like a model
 */
class Module extends Helpers {

	/**
	 * constructor for all modules
	 * @param connID
	 */
	constructor(connID = null) {
		super();
		this._connID = connID;
	}

	/**
	 * create a new item into database table (this.table)
	 * @param values {Object} object which key value pairs
	 */
	create(values) {
		values[this.pk] = this.generateUUID();
		return db.promiseInsert(this.table, values);
	}

	/**
	 * update existing item in database table (this.table)
	 * @param values {Object} object which key value pairs. values must have also the pk value for the where condition
	 */
	update(values) {
		let where = {};
		where[this.pk] = values[this.pk];
		return db.promiseUpdate(this.table, values, where);
	}

	/**
	 * delete item from database table (this.table)
	 * @param id {String} uuid 32 character string
	 */
	delete(id) {
		let where = {};
		where[this.pk] = id;
		return db.promiseDelete(this.table, where);
	}

	/**
	 * fetch item by uuid related to database table (this.table)
	 * @param id {String} uuid 32 character string
	 */
	fetch(id) {
		let where = {};
		where[this.pk] = id;
		return db.promiseSelect(this.table, null, where);
	}

	/**
	 * get connection ID
	 * @returns {String} connection ID
	 */
	getConnID() {
		return this._connID;
	}

	/**
	 * get detail information for a error number
	 * @param nr {String} number of the error (error code)
	 * @param values {Object} object of values which should be replaced for the returned message
	 * @returns {{nr: *, message: *}}
	 */
	getError(nr, values) {
		let message = Module.errors[nr];
		_.each(values, (value, name) => {
			console.log(value, name);
			let re = new RegExp(name, 'g');
			message = message.replace(re, value);
		});
		return {'nr': nr, 'message': message};
	}

}

Module.errors = {
	'0010': "language code '§§LangCode' not found",
	'1000': "wrong user name",
	'1001': "wrong password",
	'1002': "token not found",
	'1100': "list with ID: '§§ID' not found",
	'1101': "list with ID: '§§ID' count not valid",
	'1102': "list with ID: '§§ID' no columns found",
	'1200': "form with ID: '§§ID' not found",
	'1201': "form with ID: '§§ID' no fields found",
}

module.exports = Module;
