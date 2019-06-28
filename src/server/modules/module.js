import Helpers from './../helpers';
import _ from 'lodash';

/**
 * basic module class
 * all modules should extend this class
 * this class is also like a model
 * @extends Helpers
 */
class Module extends Helpers {

	/**
	 * constructor for all modules
	 * @param connID
	 */
	constructor(clientConnID = null) {
		super();
		this._clientConnID = clientConnID;
	}

	/**
	 * create item into database table (this.table)
	 * @param values {Object} object which key value pairs
	 */
	create(values) {
		values[this.pk] = this.generateUUID();
		return DB.promiseInsert(this.table, values);
	}

	/**
	 * update existing item in database table (this.table)
	 * @param values {Object} object which key value pairs. values must have also the pk value for the where condition
	 */
	update(values) {
		let where = {};
		where[this.pk] = values[this.pk];
		return DB.promiseUpdate(this.table, values, where);
	}

	/**
	 * delete item from database table (this.table)
	 * @param id {String} uuid 32 character string
	 */
	delete(id) {
		let where = {};
		where[this.pk] = id;
		return DB.promiseDelete(this.table, where);
	}

	/**
	 * fetch item by uuid related to database table (this.table)
	 * @param id {String} uuid 32 character string
	 * @param fields {Array|null} array of fields which will be returned by the select query | if fields is null all fields will be returned
	 */
	fetch(id, fields = null) {
		let where = {};
		where[this.pk] = id;
		return DB.promiseSelect(this.table, fields, where);
	}

	/**
	 * fetch items by where condition
	 * @param where {Array|Object|null}
	 *          - array       => multiple objects for the where condition ([{'field1':'value1'},{'field2':'value2']])<br>
	 * 			- object      => object with two elements ({'conditions':'(field1 = ? and field2 = ?) or (field3 > ? or field3 < ?)','values':['abc','def',1,2]})<br>
	 * 			- object      => object of field value pair ({'field':'value'})<br>
	 * 			- null		  => if where condition is null all rows will be returned
	 * @param fields {Array|null} array of fields which will be returned by the select query | if fields is null all fields will be returned
	 */
	fetchAll(where = null, fields = null) {
		return DB.promiseSelect(this.table, fields, where);
	}

	/**
	 * get form fields for this module
	 * @returns {false|object}
	 */
	getFields() {
		if (this.fields) {
			return this.fields;
		} else {
			return false;
		}
	}

	/**
	 * get connection ID
	 * @returns {String} connection ID
	 */
	getConnID() {
		return this._clientConnID;
	}

	/**
	 * get connection user ID
	 * @returns {String} connection user ID
	 */
	getConnUserID() {
		return SOCKET.io.sockets.connected[this._clientConnID].userdata.UserID;
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
			let re = new RegExp(name, 'g');
			message = message.replace(re, value);
		});
		return {'nr': parseInt(nr), 'message': message};
	}

}

Module.errors = {
	'0010': "language code '§§LangCode' not found",
	'1000': "wrong user name",
	'1001': "wrong password",
	'1002': "token not found",
	'1003': "user with email-address §§EMAIL already exists",
	'1100': "list with ID: '§§ID' not found",
	'1101': "list with ID: '§§ID' count not valid",
	'1102': "list with ID: '§§ID' no columns found",
	'1200': "form with ID: '§§ID' not found",
	'1201': "form with ID: '§§ID' no fields found",
}

module.exports = Module;
