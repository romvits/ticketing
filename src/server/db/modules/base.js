import MySqlQuery from './../mysql_query';

class Base extends MySqlQuery {

	/**
	 *
	 */
	init() {
		this._query('TRUNCATE TABLE memClientConn');
	}

	/**
	 * Connect Promise to Database
	 * @param values
	 * @returns {Promise<any>}
	 */
	connection(values) {
		return new Promise((resolve, reject) => {
			let sql = 'INSERT INTO memClientConn (`ClientConnID`,`ClientConnToken`,`ClientConnAddress`,`ClientConnUserAgent`) VALUES (?,?,?,?)';
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
		let sql = 'DELETE FROM memClientConn WHERE ClientConnID = ?'
		this._query(sql, values);
	}
}

module.exports = Base;
