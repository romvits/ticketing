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
	 * @param ConnID {String} client connection ID. stored for each client connection in database table `memClientConn`
	 * @param values {Object} object of connection information
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
	 * @param ConnID {String} client connection ID. stored for each client connection in database table `memClientConn`
	 */
	disconnect(ConnID) {
		return db.promiseDelete('memClientConn', {
			'ClientConnID': ConnID
		});
	}

	/**
	 * set language for a connection
	 * @param ConnID {String} client connection ID. stored for each client connection in database table `memClientConn`
	 * @param LangCode {String} the new language code for this connection
 	 * @returns {Promise<any>}
	 */
	setConnectionLanguage(ConnID, LangCode) {
		return new Promise((resolve, reject) => {
			let LangCode = (LangCode) ? LangCode.substring(0, 5) : null;

			let table = 'feLang';
			let where = {'LangCode': LangCode};
			let fields = 'COUNT(LangCode) AS count';

			db.promiseCount(table, where, fields).then((res) => {
				if (!_.size(res)) {
					throw this.getError('0010', {'§§LangCode': LangCode});
				} else {
					let table = 'memClientConn';
					let data = {'ClientConnLangCode': LangCode};
					let where = {'ClientConnID': ConnID};
					return db.promiseUpdate(table, data, where);
				}
			}).then((res) => {
				resolve(res);
			}).catch((err => {
				console.log(err);
				reject(err);
			}));
		});
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
