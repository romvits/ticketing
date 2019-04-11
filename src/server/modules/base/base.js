import Module from './../module';
import _ from 'lodash';

/**
 * base actions
 * @module
 */
class Base extends Module {

	/**
	 * initialize tasks
	 */
	init() {
		return db.promiseQuery('TRUNCATE TABLE memClientConn');
	}


	/**
	 * new client connection
	 * @param values {Object} object of connection information
	 * @returns {Promise<any>}
	 */
	connection(values) {
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
	 * client is disconnected
	 */
	disconnect() {
		return db.promiseDelete('memClientConn', {
			'ClientConnID': this.getConnID()
		});
	}

	/**
	 * set language for a connection
	 * @param LangCode {String} the new language code for this connection
 	 * @returns {Promise<any>}
	 */
	setConnectionLanguage(LangCode) {
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
					let where = {'ClientConnID': this.getConnID()};
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


	fetchLanguage(values) {
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
