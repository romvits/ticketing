import Helpers from './../helpers';

class MySqlQuery extends Helpers {

	/**
	 * Real database actions like eg query
	 * @param pool {Object<>} Object of a mysql pool resource
	 */
	constructor(pool) {
		super();
		if (pool) {
			this._pool = pool;
		}
	}

	/**
	 * Query Database without a Promise
	 * @param sql
	 * @param values
	 * @private
	 */
	_query(sql, values = []) {
		this._pool.getConnection((err, db) => {
			if (!err && db) {
				db.query(sql, values, (err, res) => {
					if (err) {
						log.err(err);
					} else {
						log.msg(sql + ' ' + JSON.stringify(values));
					}
					db.release();
				});
			} else {
				log.err(err);
			}
		});
	}

	/**
	 * Query Database with a Promise
	 * @param sql
	 * @param values
	 * @returns {Promise<any>}
	 * @private
	 */
	_queryPromise(sql, values = []) {
		return new Promise((resolve, reject) => {
			this._pool.getConnection((err, db) => {
				if (!err && db) {
					db.query(sql, values, (err, res) => {
						if (err) {
							log.err(err);
							reject(err);
						} else {
							log.msg(sql + ' ' + JSON.stringify(values));
							resolve(res);
						}
						db.release();
					});
				} else {
					log.err(err);
					reject(err);
				}
			});
		});
	}

}

module.exports = MySqlQuery;
