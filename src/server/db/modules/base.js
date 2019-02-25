import MySqlQuery from './../mysql_query';

class Base extends MySqlQuery {

	/**
	 *
	 */
	init() {
		this._query('TRUNCATE TABLE t_client_conns');
	}

	/**
	 * Connect Promise to Database
	 * @param values
	 * @returns {Promise<any>}
	 */
	connection(values) {
		return new Promise((resolve, reject) => {
			let sql = 'INSERT INTO t_client_conns (`client_id`,`client_token`,`address`,`user-agent`) VALUES (?,?,?,?)';
			this._queryPromise(sql, values).then((res) => {
				resolve(res);
			}).catch((err) => {
				console.log(err);
				reject(err);
			});
		});
	}

	/**
	 * Disconnect from Database
	 * @param values
	 */
	disconnect(values) {
		let sql = 'DELETE FROM t_client_conns WHERE client_id = ?'
		this._query(sql, values);
	}
}

module.exports = Base;
