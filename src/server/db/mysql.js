import mysql from 'mysql';

import Base from './modules/base'
import Translation from './modules/translation'
import Account from './modules/account'

import List from './modules/list'
import Form from './modules/form'

import Event from './modules/event'
import Order from './modules/order'

const logPrefix = 'MYSQL   ';

class MySql {

	/**
	 * Init Databse connection pool
	 */
	constructor(config) {
		this._config = config;

		this._pool = mysql.createPool(this._config.conn);
		log.msg(logPrefix,'DB pool created with ' +this._config.conn.connectionLimit + ' connection(s)');

		// base, translation and account
		this.base = new Base(this._pool);
		this.translation = new Translation(this._pool);
		this.account = new Account(this._pool);

		// fe configuration
		this.list = new List(this._pool);
		this.form = new Form(this._pool);

		// event
		this.event = new Event(this._pool);
		this.order = new Order(this._pool);

	}

};

module.exports = MySql;
