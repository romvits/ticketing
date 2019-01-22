import sql from 'mssql';
import RmLog from 'rm-log';
import EventEmitter from 'events';

import Explorer from './database/explorer';
import Ils from './database/ils';

const log = new RmLog();

class Database extends EventEmitter {
	constructor(config) {
		super();
		new sql.ConnectionPool(config)
			.connect()
			.then(pool => {
				this._pool = pool;
			})
			.catch(err => {
				console.log('Database Connection Failed! Bad Config: ', err);
			});
	}

	ils(client) {
		new Ils(this._pool, client);
	}

	explorer(client) {
		new Explorer(this._pool, client);
	}
};

module.exports = Database;
