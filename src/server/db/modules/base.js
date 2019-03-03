import MySqlQuery from './../mysql_query';
import _ from 'lodash';

class Base extends MySqlQuery {

	/**
	 *
	 */
	init() {
		this._query('TRUNCATE TABLE memClientConn');
		return new Promise((resolve, reject) => {
			resolve();
		});
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

	/**
	 * set language for a connection
	 * @param values
	 * @returns {Promise<any>}
	 */
	setLanguage(values) {
		values.LangCode = (values.LangCode) ? values.LangCode.substring(0, 5) : null;
		return new Promise((resolve, reject) => {
			let sql = 'SELECT COUNT(LangCode) as count FROM feLang WHERE LangCode = ?';
			this._queryPromise(sql, [values.LangCode]).then((res) => {
				if (res[0].count) {
					sql = 'UPDATE memClientConn SET `ClientConnLang` = ? WHERE ClientConnID = ?';
					return this._queryPromise(sql, [(values.LangCode) ? values.LangCode : null, (values.ClientConnID) ? values.ClientConnID : null]);
				} else {
					reject({'nr': 1, 'message': 'Language Code not found'});
				}
			}).then((res) => {
				if (res.affectedRows) {
					resolve({'LangCode': values.LangCode});
				} else {
					reject({'nr': 2, 'message': 'Connection not found'});
				}
			}).catch((err) => {
				console.log(err);
				reject(err);
			});
		});
	}


	fetchLanguage(values) {
		return new Promise((resolve, reject) => {
			let sql = 'SELECT * FROM viewLang';
			this._queryPromise(sql, null).then((res) => {
				if (res.length) {
					resolve(res);
				} else {
					reject({'nr': 3, 'message': 'no languages found'});
				}
			}).catch((err) => {
				console.log(err);
				reject(err);
			});

		});
	}
}

module.exports = Base;
