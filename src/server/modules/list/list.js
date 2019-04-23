import Module from './../module';
import _ from 'lodash';

class List extends Module {

	/**
	 * constructor for list
	 * @param connID {String} 32 character string of connection ID from database table ``
	 */
	constructor(ClientConnID) {
		super(ClientConnID);
		this.pk = 'ListID';
		this.table = 'feList';
		this.view = 'viewFeList';
		this.fields = {}
	}

	/**
	 * create a new list
	 * @param values {Object} object which key value pairs
	 */
	create(values) {
		let ListID = (values.ListID) ? values.ListID : this.generateUUID();
		_.extend(values, {'ListID': ListID});

		let valuesListColumn = _.clone(values.ListColumn);
		_.each(valuesListColumn, (column) => {
			_.extend(column, {
				'ListColumnID': (values.ListColumnID) ? values.ListColumnID : this.generateUUID(),
				'ListColumnListID': ListID
			});
		});
		delete values.ListColumn;

		return new Promise((resolve, reject) => {
			DB.promiseInsert('feList', values).then(() => {
				return DB.promiseInsert('feListColumn', valuesListColumn);
			}).then(() => {
				values.ListColumn = valuesListColumn;
				resolve(values);
			}).catch((err) => {
				console.log(err);
			});
		});
	}

	/**
	 * update a existing list
	 * @param values {Object} object which key value pairs
	 */
	update(values) {
		return new Promise((resolve, reject) => {
			this.delete(values.ListID).then(() => {
				return this.create(values);
			}).then((res) => {
				resolve(res);
			}).catch((err) => {
				console.log(err);
			});
		});
	}

	delete(id) {
		return new Promise((resolve, reject) => {
			DB.promiseDelete('feListColumn', {'ListColumnListID': id}).then((res) => {
				return DB.promiseDelete('feList', {'ListID': id});
			}).then((res) => {
				resolve(id);
			}).catch((err) => {
				reject(err);
			});
		});
	}

	/**
	 * List init load of configuration and columns
	 * @param ListID
	 * @param full
	 * @returns {Promise<any>}
	 */
	init(ListID, full = false) {

		let res = {};
		return new Promise((resolve, reject) => {
			this._promiseList(ListID, full).then((row) => {
				res = row;
				return this._promiseListColumn(ListID);
			}).then((rows) => {
				res.columns = rows;
				resolve(res);
			}).catch((err) => {
				reject(err);
			});
		});
	}

	/**
	 * List fetch data for a list
	 * @param values
	 * @returns {Promise<any>}
	 */
	fetch(req) {

		return new Promise((resolve, reject) => {

			let orderby = [];
			let orderdesc = (req.OrderDesc) ? true : false;

			this.init(req.ListID, true).then((row) => {
				if (!row) {
					throw 'need ID for this error!';
				}
				let columns = row.columns;
				let table = row.table;
				let limit = row.limit;
				let fields = [row.pk];

				orderby = [];
				let orderdir = (req.OrderDesc) ? 'desc' : 'asc';

				if (req.OrderBy) {
					let obj = {};
					obj[req.OrderBy] = orderdir;
					orderby.push(obj);
				}
				if ((row.json && row.json.orderby)) {
					_.each(row.json.orderby, (item) => {
						let key = Object.keys(item)[0];
						if (!req.OrderBy) {
							req.OrderBy = key;
						}
						item[key] = orderdir;
						orderby.push(item);
					});
				}

				_.each(columns, (column) => {
					fields.push(column.name);
				});

				return DB.promiseSelect(table, fields, null, orderby, req.From ? req.From : 0, 100);
			}).then((res) => {
				resolve({
					'orderby': (req.OrderBy) ? req.OrderBy : null,
					'orderdesc': (req.OrderDesc) ? true : false,
					'rows': res
				});
			}).catch((err) => {
				console.warn(err);
			});
		});
	}

	/**
	 * List Promise load for list configuration
	 * @param ListID
	 * @param full
	 * @returns {Promise<any>}
	 * @private
	 */
	_promiseList(ListID, full = false) {
		return new Promise((resolve, reject) => {

			let row = {};

			DB.promiseSelect('feList', null, {'ListID': ListID}).then((res) => {
				if (!_.size(res)) {
					throw this.getError(1100, {'§§ID': ListID});
				}
				row = {
					'label': res[0].ListName,
					'pk': res[0].ListPK,
					'mask_id': res[0].ListMaskID,
					'limit': res[0].ListLimit,
					'json': JSON.parse(res[0].ListJSON),
					'table': res[0].ListTable

				};
				let fields = 'COUNT(' + res[0].ListPK + ') AS count';
				return DB.promiseCount(res[0].ListTable, null, fields);
			}).then((res) => {
				if (!_.size(res)) {
					throw this.getError(1101, {'§§ID': ListID});
				}
				row.count = res[0].count;
				if (!full) {
					delete row.table;
					delete row.limit;
				}
				resolve(row);
			}).catch((err) => {
				reject(err);
			});
		});
	}

	/**
	 * List Promise load for list columns
	 * @param ListID
	 * @returns {Promise<any>}
	 * @private
	 */
	_promiseListColumn(ListID, full = false) {
		return new Promise((resolve, reject) => {

			let rows = [];

			let table = 'feListColumn';
			let fields = null;
			let where = {'ListColumnListID': ListID};
			let order = {'ListColumnOrder': 'asc'};

			DB.promiseSelect(table, fields, where, order).then((res) => {
				if (!_.size(res)) {
					throw this.getError();
				} else {
					_.each(res, (row, id) => {
						rows.push({
							'id': row.ListColumnID,
							'name': row.ListColumnName,
							'label': row.ListColumnLabel,
							'width': row.ListColumnWidth,
							'editable': row.ListColumnEditable,
							'type': row.ListColumnType,
							'json': JSON.parse(row.ListColumnJSON)
						});
					});
					resolve(rows);
				}
			}).catch((err) => {
				reject(err);
			});
		});
	}
}

module.exports = List;
