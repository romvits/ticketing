import DBMySQL from './../mysql';

class Account extends DBMySQL {
	constructor() {
		console.log("hier");
		super();
	}

	login() {
		this._logMessage('hallo wir sind hier!');
	}
}

module.exports = Account;
