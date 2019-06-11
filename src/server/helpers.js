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
		let uuid = randtoken.generate(17) + new Date().getTime().toString() + Math.floor(Math.random() * 100).toString();
		if (uuid.length < 32) {
			uuid += Math.floor(Math.random() * 10).toString();
		}
		return uuid.substr(0, 32);
	}

	/**
	 * get datetime format for database insert/update
	 */
	getDateTime(date = false) {
		let dateObj = new Date();
		if (date) {
			dateObj = new Date(date);
		}
		return dateObj.toISOString().replace(/T/, ' ').replace(/\..+/, '');
	}

	convertDate(date, pattern = 'dd.mm.yyyy') {
		return dateFormat(date, pattern);
	}

	convertDateTime(date, pattern = 'dd.mm.yyyy HH:MM:ss') {
		return dateFormat(date, pattern);
	}

	/**
	 * get ean 8 checksum
	 * @param number {integer}
	 * @returns {number} 1 digit checksum
	 */
	getEan8Checksum(number) {
		const res = number
			.substr(0, 7)
			.split('')
			.map((n) => +n)
			.reduce((sum, a, idx) => (
				idx % 2 ? sum + a : sum + a * 3
			), 0);
		return (10 - (res % 10)) % 10;
	}

	/**
	 * lag a message
	 * @param message
	 * @private
	 */
	_logMessage(message = '') {
		//message = numeral(this._clients).format('0000') + ' client(s) => ' + client.id + ' => ' + evt + ' => ' + JSON.stringify(message);
		if (this._config.debug) {
			LOG.msg(this.logPrefix, message);
		}
	}

	/**
	 * lag a error
	 * @param message
	 * @private
	 */
	_logError(message = '') {
		//message = numeral(this._clients).format('0000') + ' client(s) => ' + client.id + ' => ' + evt + ' => ' + JSON.stringify(message);
		LOG.err(this.logPrefix, message);
		console.log(message);
	}

	/**
	 * log message
	 * @param ClientConnID {String}
	 * @param evt {String} event
	 * @param message {Object} message
	 */
	logSocketMessage(ClientConnID, evt = '', message = '') {
		let UserID = (SOCKET.io.sockets.connected[ClientConnID] && SOCKET.io.sockets.connected[ClientConnID].userdata.User) ? SOCKET.io.sockets.connected[ClientConnID].userdata.User.UserID : null;
		message = numeral(SOCKET.connections).format('0000') + ' => ' + ClientConnID + ' => ' + UserID + ' => ' + evt + ' => ' + JSON.stringify(message);
		LOG.msg(logSocketPrefix, message);
	}

	/**
	 * log warn
	 * @param ClientConnID {String}
	 * @param evt {String} event
	 * @param message {Object} message
	 */
	logSocketWarn(ClientConnID, evt = '', message = '') {
		let UserID = (SOCKET.io.sockets.connected[ClientConnID] && SOCKET.io.sockets.connected[ClientConnID].userdata.User) ? SOCKET.io.sockets.connected[ClientConnID].userdata.User.UserID : null;
		message = numeral(SOCKET.connections).format('0000') + ' => ' + ClientConnID + ' => ' + UserID + ' => ' + evt + ' => ' + JSON.stringify(message);
		LOG.info(logSocketPrefix, message);
	}

	/**
	 * log error
	 * @param ClientConnID {String}
	 * @param evt {String} event
	 * @param message {Object} message
	 */
	logSocketError(ClientConnID, evt = '', message = '') {
		let UserID = (SOCKET.io.sockets.connected[ClientConnID] && SOCKET.io.sockets.connected[ClientConnID].userdata.User) ? SOCKET.io.sockets.connected[ClientConnID].userdata.User.UserID : null;
		message = numeral(SOCKET.connections).format('0000') + ' => ' + ClientConnID + ' => ' + UserID + ' => ' + evt + ' => ' + JSON.stringify(message);
		LOG.err(logSocketPrefix, message);
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
						LOG.err('VALIDATE', 'field: \'' + name + '\' type: \'' + settings.type + '\' not valid');
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
