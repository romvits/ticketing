
class Helpers {
	constructor(config) {
		this._config = config;
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
}

module.exports = Helpers;
