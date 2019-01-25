import mysql from 'mysql';
import RmLog from 'rm-log';
import EventEmitter from 'events';

import Login from './database/login';

const log = new RmLog({'datePattern': 'yyyy/mm/dd HH:MM:ss'});
const logPrefix = 'DB      ';

class Database extends EventEmitter {
	constructor(action, data) {
		super();

		if (action) {
			this.action = action;
			this.data = data;

			this.conn = mysql.createConnection({
				host: 'ticketing_mysql_dev',
				user: 'ticketing_user',
				password: 'h4G7f8OP',
				database: 'ticketing_db'
			});

		}
	}

	query() {
		this.conn.connect((err) => {
			if (err) {
				log.err(logPrefix, err.stack);
			} else {
				log.msg(logPrefix, 'connected id ' + this.conn.threadId);

				let sql, values;

				switch (this.action) {
					case 'login':
						sql = 'SELECT * FROM t_user WHERE (nickname = ? || email = ?) && password = ?';
						values = [this.data.username, this.data.username, this.data.password];
						this.conn.query(sql, values, (err, res) => {
							if (!this._err(err)) {
								this.emit('event', {'action': this.action, data: res});
							}
						});
						break;
					case 'list':
						sql = 'SELECT * FROM t_list WHERE list_id = ?';
						values = [this.data.list_id];
						this.conn.query(sql, values, (err, res) => {
							if (!this._err(err)) {
								this.emit('event', {'action': this.action, data: res});
							}
						});
						break;
					case 'list_content':

						break;
					default:
						break;
				}

				this.conn.end((err) => {
					if (err) {
						log.err(logPrefix, err.stack);
						return
					}
					log.msg(logPrefix, 'disconnected id ' + this.conn.threadId);
				});

			}
		});
	}

	_err(err) {
		var ret = false;
		if (err) {
			log.err(logPrefix, err);
			this.emit('err', err);
			ret = true;
		}
		return ret;
	}
};

module.exports = Database;
