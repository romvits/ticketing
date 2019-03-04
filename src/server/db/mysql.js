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
	 * create connection pool for mysql database
	 * create instance for all modules
	 * @param config {Object} connection configuration
	 */
	constructor(config) {

		const pool = mysql.createPool(config.conn);
		log.msg(logPrefix, 'created pool with ' + config.conn.connectionLimit + ' connection(s)');

		// base, translation and account
		this.base = new Base(pool);
		this.translation = new Translation(pool);
		this.account = new Account(pool);

		// fe configuration
		this.list = new List(pool);
		this.form = new Form(pool);

		// event
		this.event = new Event(pool);
		this.order = new Order(pool);

	}

};

module.exports = MySql;
