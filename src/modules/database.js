import mysql from 'mysql';
import RmLog from 'rm-log';
import EventEmitter from 'events';

const log = new RmLog();

class Database extends EventEmitter {
	constructor(action, data) {
		super();
		this.conn = mysql.createConnection({
			host: 'localhost',
			user: 'ticketing_user',
			password: 'h4G7f8OP',
			database: 'ticketing_db'
		});
		this.conn.connect();
		switch (action) {
			case 'login':
				break;
			case 'get_list':
				break;
			default:
				break;
		}
	}

};

module.exports = Database;
