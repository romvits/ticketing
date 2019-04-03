import randtoken from "rand-token";
import Validator from 'better-validator';
import _ from 'lodash';

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

	_logMessage(message = '') {
		//message = numeral(this._clients).format('0000') + ' client(s) => ' + client.id + ' => ' + evt + ' => ' + JSON.stringify(message);
		if (this._config.debug) {
			log.msg(this.logPrefix, message);
		}
	}

	_logError(message = '') {
		//message = numeral(this._clients).format('0000') + ' client(s) => ' + client.id + ' => ' + evt + ' => ' + JSON.stringify(message);
		log.err(this.logPrefix, message);
		console.log(message);
	}

	/**
	 * generate a unique id
	 * @returns {String} uniqe id
	 */
	generateUUID() {
		return randtoken.generate(32);
	}

	/**
	 * validate before save to database
	 * @param fields {Object}
	 * @param values {Object}
	 * @returns {*|*|IFailure[]|any[]|*}
	 * @private
	 */
	_validator(fields, values) {

		const validator = new Validator({});
		validator(values).required().isObject((obj) => {
			_.each(fields, (settings, name) => {
				if (!_.isUndefined(values[name])) {
					console.log(name, settings);
					switch (settings.type) {
						case 'string':
							if (settings.empty === false) {
								obj(name).isString().isLength({min: 0, max: settings.length}).notEmpty();
							} else {
								obj(name).isString().isLength({min: 0, max: settings.length});
							}
							break;
						case 'email':
							obj(name).isString().isLength({min: 0, max: settings.length}).isEmail();
							break;
						case 'enum':
							obj(name).isIncludedInArray(settings.values);
							break;
						case 'int':
							obj(name).isNumber().integer();
							break;
						case 'float':
							obj(name).isNumber().isFloat();
							break;
						default:
							log.err('VALIDATE', 'field: \'' + name + '\' type: \'' + settings.type + '\' not valid');
							break;
					}
				} else {
					log.msg('VALIDATE', 'field: \'' + name + '\' not in values');
				}
			});
		});
		return validator.run();
	}
}

module.exports = Helpers;
