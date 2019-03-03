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
			let sql = 'INSERT INTO memClientConn (`ClientConnID`,`ClientConnToken`,`ClientConnLang`,`ClientConnAddress`,`ClientConnUserAgent`) VALUES (?,?,?,?,?)';
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

	setConnLanguageCode(values) {
		values.lang = (values.lang) ? values.lang.substring(0, 5) : null;
		return new Promise((resolve, reject) => {
			let sql = 'SELECT COUNT(LangCode) as count FROM feLang WHERE LangCode = ?';
			this._queryPromise(sql, [values.lang]).then((res) => {
				if (res.length) {
					sql = 'UPDATE memClientConn SET `ClientConnLang` = ? WHERE ClientConnID = ?';
					return this._queryPromise(sql, [(values.Lang) ? values.lang : null, (values.ClientConnID) ? values.ClientConnID : null]);
				} else {
					reject({'nr': 1, 'message': 'Language Code not found'});
				}
			}).then((res) => {
				if (res.affectedRows) {
					resolve();
				} else {
					reject({'nr': 2, 'message': 'Connection not found'});
				}
			}).catch((err) => {
				console.log(err);
				reject(err);
			});
		});
	}
}

module.exports = Base;
