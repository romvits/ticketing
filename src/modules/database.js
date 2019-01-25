import mysql from 'mysql';
import RmLog from 'rm-log';
import EventEmitter from 'events';

const log = new RmLog({'datePattern': 'yyyy/mm/dd HH:MM:ss'});
const logPrefix = 'DB      ';

class Database extends EventEmitter {
	constructor(action, data) {
		super();

		const connection = mysql.createConnection({
			host: 'ticketing_mysql_dev',
			user: 'ticketing_user',
			password: 'h4G7f8OP',
			database: 'ticketing_db'
		});

		connection.connect((err) => {
			if (err) {
				log.err(logPrefix, err.stack);
				return;
			}
			log.msg(logPrefix, 'connected id ' + connection.threadId);

			switch (action) {
				case 'login':
					break;
				case 'get_list':
					break;
				default:
					break;
			}

			connection.end((err) => {
				if (err) {
					log.err(logPrefix, err.stack);
					return
				}
				log.msg(logPrefix, 'disconnected id ' + connection.threadId);
			});
		});
	}
};

module.exports = Database;
