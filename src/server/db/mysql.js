import mysql from 'mysql';

import Translation from './modules/translation'
import Base from './modules/base'
import Account from './modules/account'
import List from './modules/list'
import Form from './modules/form'

class MySql {

	/**
	 * Init Databse connection pool
	 */
	constructor(config) {
		this._config = config;

		this._pool = mysql.createPool(this._config.conn);
		log.msg('DB pool created');

		this.base = new Base(this._pool);
		this.translation = new Translation(this._pool);

		this.account = new Account(this._pool);
		this.list = new List(this._pool);
		this.form = new Form(this._pool);
	}

};

module.exports = MySql;
