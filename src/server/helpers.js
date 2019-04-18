import randtoken from "rand-token";
import validator from 'validator';
import numeral from 'numeral';
import _ from 'lodash';
import moment from 'moment';
import dateFormat from 'dateformat';

const logSocketPrefix = 'SOCKET  ';

class Helpers {

	/**
	 * Helper Methos
	 * many (nearly all) classes extends here
	 * @param config {Object} configuration object
	 */
	constructor(config) {
		if (config) {
			this._config = config;
		}
	}

	/**
	 * generate a unique id
	 * @returns {String} uniqe id
	 */
	generateUUID() {
		return randtoken.generate(32);
	}

	/**
	 * get datetime format for database insert/update
	 */
	getDateTime() {
		return new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '');
	}

	/**
	 * lag a message
	 * @param message
	 * @private
	 */
	_logMessage(message = '') {
		//message = numeral(this._clients).format('0000') + ' client(s) => ' + client.id + ' => ' + evt + ' => ' + JSON.stringify(message);
		if (this._config.debug) {
			log.msg(this.logPrefix, message);
		}
	}

	/**
	 * lag a error
	 * @param message
	 * @private
	 */
	_logError(message = '') {
		//message = numeral(this._clients).format('0000') + ' client(s) => ' + client.id + ' => ' + evt + ' => ' + JSON.stringify(message);
		log.err(this.logPrefix, message);
		console.log(message);
	}

	/**
	 * log message
	 * @param client {Object} socket.io connection object
	 * @param evt {String} event
	 * @param message {Object} message
	 * @private
	 */
	logSocketMessage(ClientID, UserID, evt = '', message = '') {
		message = numeral(global.socket.connections).format('0000') + ' => ' + ClientID + ' => ' + UserID + ' => ' + evt + ' => ' + JSON.stringify(message);
		log.msg(logSocketPrefix, message);
	}

	/**
	 * log error
	 * @param client {Object} socket.io connection object
	 * @param evt {String} event
	 * @param message {Object} message
	 * @private
	 */
	logSocketError(ClientID, UserID, evt = '', message = '') {
		message = numeral(global.socket.connections).format('0000') + ' => ' + ClientID + ' => ' + UserID + ' => ' + evt + ' => ' + JSON.stringify(message);
		log.err(logSocketPrefix, message);
	}

	/**
	 * validate before save to database
	 * @param fields {Object}
	 * @param values {Object}
	 * @returns {*|*|IFailure[]|any[]|*}
	 * @external https://www.npmjs.com/package/validator
	 * @private
	 */
	_validator(fields, values) {

		let err = {};
		_.each(fields, (settings, name) => {
			if (!_.isUndefined(values[name])) {
				let value = values[name];
				if (value === true) {
					value = 'true';
				} else if (value === false) {
					value = 'false';
				}
				value = (values[name]) ? values[name].toString() : '';

				err[name] = [];
				if (settings.length && !validator.isLength(value, {min: 0, max: settings.length})) {
					err[name].push({'length': settings.length});
				}
				switch (settings.type) {
					case 'string':
						if (settings.empty === false && !value) {
							err[name] = ['empty'];
						} else if (settings.length && !validator.isLength(value, {min: 0, max: settings.length})) {
							err[name] = ['length'];
						}
						break;
					case 'email':
						if (!validator.isEmail(value)) {
							err[name] = ['email'];
						} else if (settings.length && !validator.isLength(value, {min: 0, max: settings.length})) {
							err[name] = ['length'];
						}
						break;
					case 'boolean':
						break;
					case 'json':
						break;
					case 'datetime':
						break;
					case 'enum':
						break;
					case 'integer':
					case 'int':
						break;
					case 'float':
					case 'decimal':
						break;
					default:
						log.err('VALIDATE', 'field: \'' + name + '\' type: \'' + settings.type + '\' not valid');
						break;
				}
				if (!_.size(err[name])) {
					delete err[name];
				}
			}
		});

		return (_.size(err)) ? err : false;
	}
}

module.exports = Helpers;
