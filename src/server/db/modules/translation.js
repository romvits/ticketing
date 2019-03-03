import MySqlQuery from './../mysql_query';
import _ from 'lodash';

class Translation extends MySqlQuery {

	/**
	 *
	 * @returns {Promise<any>}
	 */
	init() {
		this._trans = {};
		return new Promise((resolve, reject) => {
			let sql = 'SELECT TransLangCode, TransToken, TransValue FROM feTrans';
			this._queryPromise(sql, null).then((res) => {
				_.each(res, (row) => {
					this._trans[row.TransLangCode] ? null : this._trans[row.TransLangCode] = {};
					this._trans[row.TransLangCode][row.TransToken] = row.TransValue;
				});
				resolve();
			}).catch((err) => {
				console.log(err);
				reject(err);
			});
		});
	}

	/**
	 *
	 * @param LangCode
	 * @param Token
	 * @param Value
	 */
	set(LangCode, LangGroupID, Token, Value) {
		this._trans[LangCode] ? null : this._trans[LangCode] = {};
		this._trans[LangCode][Token] = Value;
		let sql = 'INSERT INTO feTrans (TransLangCode, TransLangGroupID, TansToken, TransValue) VALUES (?,?,?,?) ON DUPLICATE KEY UPDATE TransValue = ?';
		this._query(sql, [LangCode, LangGroupID, Token, Value, Value]);
	}

	/**
	 *
	 * @param LangCode
	 * @param Token
	 * @returns {*}
	 */
	get(LangCode, Token) {
		let value = Token;
		if (this._trans[LangCode] && this._trans[LangCode][Token]) {
			value = this._trans[LangCode][Token];
		} else if (this._trans[LangCode.substr(0, 2)] && this._trans[LangCode.substr(0, 2)][Token]) {
			value = this._trans[LangCode.substr(0, 2)][Token];
		}
		return value;
	}

	/**
	 *
	 * @param LangCode
	 * @returns {null}
	 */
	fetch(LangCode) {
		if (this._trans[LangCode]) {
			return this._trans[LangCode];
		} else if (this._trans[LangCode.substr(0, 2)]) {
			return this._trans[LangCode.substr(0, 2)];
		} else {
			return null;
		}
	}

	/**
	 * fetch specific group for translation
	 * @param LangCode
	 * @param TransGroupID
	 * @returns {Promise<any>}
	 */
	fetchGroup(LangCode, TransGroupID) {
		return new Promise((resolve, reject) => {
			if (LangCode) {
				var values = [LangCode];
				let sql = 'SELECT TransToken AS token, TransValue AS value FROM feTrans WHERE TransLangCode = ?';
				if (TransGroupID) {
					values.push(TransGroupID);
					sql += ' AND TransTransGroupID = ?';
				} else {
					sql += ' AND TransTransGroupID IS NULL';
				}
				this._queryPromise(sql, values).then((res) => {
					resolve(res);
				}).catch((err) => {
					console.log(err);
					reject(err);
				});
			} else {
				reject({'nr': 4, 'message': 'no language code is set'});
			}
		});
	}
}

module.exports = Translation;
