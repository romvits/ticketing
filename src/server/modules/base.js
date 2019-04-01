import Module from './../module';
import _ from 'lodash';

class Base extends Module {

	/**
	 *
	 */
	init() {
		return db.promiseQuery('TRUNCATE TABLE memClientConn');
	}


	/**
	 * Connect Promise to Database
	 * @param values
	 * @returns {Promise<any>}
	 */
	connection(ConnID, values) {
		return new Promise((resolve, reject) => {
			db.promiseInsert('memClientConn', values).then((res) => {
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
	disconnect(ConnID) {
		return db.promiseDelete('memClientConn', {
			'ClientConnID': ConnID
		});
	}

	/**
	 * set language for a connection
	 * @param values
	 * @returns {Promise<any>}
	 */
	setConnectionLanguage(ConnID, values) {
		return new Promise((resolve, reject) => {
			let LangCode = (values.LangCode) ? values.LangCode.substring(0, 5) : null;
			let ClientConnID = values.ClientConnID;

			let table = 'feLang';
			let where = {'LangCode': LangCode};
			let fields = 'COUNT(LangCode) AS count';

			db.promiseCount(table, where, fields).then((res) => {
				if (!_.size(res)) {
					throw this.getError('0010', {'§§LangCode': LangCode});
				} else {
					let table = 'memClientConn';
					let data = {'ClientConnLangCode': LangCode};
					let where = {'ClientConnID': ClientConnID};
					return db.promiseUpdate(table, data, where);
				}
			}).then((res) => {
				resolve(res);
			}).catch((err => {
				reject(err);
			}));
		});

		/*
		return new Promise((resolve, reject) => {
			let sql = 'SELECT COUNT(LangCode) as count FROM feLang WHERE LangCode = ?';
			this._queryPromise(sql, [values.LangCode]).then((res) => {
				if (res[0].count) {
					sql = 'UPDATE memClientConn SET `ClientConnLangCode` = ? WHERE ClientConnID = ?';
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
		*/
	}


	fetchLanguage(ConnID, values) {
		/*
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
		 */
	}
}

module.exports = Base;
