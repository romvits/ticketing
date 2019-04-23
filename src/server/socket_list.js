import Helpers from './helpers';
import List from './modules/list/list'

/**
 * list events
 * @public
 * @class
 * @memberof Socket
 */
class SocketList extends Helpers {

	/**
	 * constructor for list socket events<br>
	 * @param client {Object} socket.io connection object
	 */
	constructor(client) {
		super();
		this._client = client;
		this.onCreate();
		this.onUpdate();
		this.onDelete();
		this.onInit();
		this.onFetch();
	}

	/**
	 * list create<br>
	 * create new list
	 * @example
	 * socket.on('list-create', (res)=>{console.log(res);});
	 * socket.on('list-create-err', (err)=>{console.log(err);});
	 * socket.emit('list-create', {
	 *	'ListName': 'Name',
	 *	'ListLabel': '§§LISTNAME',
	 *	'ListTable': 'database Table Name',
	 *	'ListPK': 'Name',
	 *	'ListMaskID': 'MaskID',
	 *	'ListLimit': 100,
	 *	'ListJSON': {"orderby": [{"FieldName1": ""}, {"FieldName2": "desc"}, {"FieldName3": ""}], "editable": 0},
	 *	'ListColumn': [{
	 *		'ListColumnOrder': 1,
	 *		'ListColumnName': 'Column_1',
	 *		'ListColumnType': 'text',
	 *		'ListColumnWidth': 150,
	 *		'ListColumnEditable': 0,
	 *		'ListColumnLabel': '§§Column1',
	 *		'ListColumnJSON': '{}'
	 *	}, {
	 *		'ListColumnOrder': 2,
	 *		'ListColumnName': 'Column_2',
	 *		'ListColumnType': 'text',
	 *		'ListColumnWidth': 150,
	 *		'ListColumnEditable': 0,
	 *		'ListColumnLabel': '§§Column2',
	 *		'ListColumnJSON': '{}'
	 *	}
	 * });
	 * @param client {Object} socket.io connection object
	 */
	onCreate() {
		const evt = 'list-create';
		this._client.on(evt, (req) => {
			const list = new List(this._client.id);
			list.create(req).then((res) => {
				this._client.emit(evt, res);
				this.logSocketMessage(this._client.id, evt, res);
			}).catch((err) => {
				this._client.emit(evt + '-err', err);
				this.logSocketError(this._client.id, evt, err);
			});
		});
	}

	/**
	 * list update<br>
	 * update existing list
	 * @example
	 * socket.on('list-update', (res)=>{console.log(res);});
	 * socket.on('list-update-err', (err)=>{console.log(err);});
	 * socket.emit('list-update', {
	 *	'ListID': 'ID of existing list',
	 *	'ListName': 'Name',
	 *	'ListTable': 'database Table Name',
	 *	'ListPK': 'Name',
	 *	'ListMaskID': 'MaskID',
	 *	'ListLimit': 100,
	 *	'ListJSON': {"orderby": [{"FieldName1": ""}, {"FieldName2": "desc"}, {"FieldName3": ""}], "editable": 0},
	 *	'ListColumn': [{
	 *		'ListColumnOrder': 1,
	 *		'ListColumnName': 'Column 1',
	 *		'ListColumnType': 'text',
	 *		'ListColumnWidth': 150,
	 *		'ListColumnEditable': 0,
	 *		'ListColumnLabel': '§§Column1',
	 *		'ListColumnJSON': '{}'
	 *	}, {
	 *		'ListColumnOrder': 2,
	 *		'ListColumnName': 'Column 2',
	 *		'ListColumnType': 'text',
	 *		'ListColumnWidth': 150,
	 *		'ListColumnEditable': 0,
	 *		'ListColumnLabel': '§§Column2',
	 *		'ListColumnJSON': '{}'
	 *	}
	 * });
	 * @param client {Object} socket.io connection object
	 */
	onUpdate() {
		const evt = 'list-update';
		this._client.on(evt, (req) => {
			const list = new List(this._client.id);
			list.update(req).then((res) => {
				this._client.emit(evt, res);
				this.logSocketMessage(this._client.id, evt, res);
			}).catch((err) => {
				this._client.emit(evt + '-err', err);
				this.logSocketError(this._client.id, evt, err);
			});
		});
	}

	/**
	 * list delete<br>
	 * delete existing list
	 * @example
	 * socket.on('list-delete', (res)=>{console.log(res);});
	 * socket.on('list-delete-err', (err)=>{console.log(err);});
	 * socket.emit('list-delete', 'ID of existing List');
	 * @param client {Object} socket.io connection object
	 */
	onDelete() {
		const evt = 'list-delete';
		this._client.on(evt, (id) => {
			const list = new List(this._client.id);
			list.delete(id).then((res) => {
				this._client.emit(evt, res);
				this.logSocketMessage(this._client.id, evt, res);
			}).catch((err) => {
				this._client.emit(evt + '-err', err);
				this.logSocketError(this._client.id, evt, err);
			});
		});
	}

	/**
	 * list init<br>
	 * request a list configuration<br>
	 * @example
	 * socket.on('list-init', (res)=>{console.log(res);}); // response (configuration of list and columns)
	 * socket.on('list-init-err', (err)=>{console.log(err);});
	 * socket.emit('list-init', ListID); // request a list configuration
	 * @param client {Object} socket.io connection object
	 */
	onInit() {
		const evt = 'list-init';
		this._client.on(evt, (ListID) => {
			const list = new List(this._client.id);
			list.init(ListID).then((res) => {
				this._client.emit(evt, res);
				this.logSocketMessage(this._client.id, evt);
			}).catch((err) => {
				this._client.emit(evt + '-err', err);
				this.logSocketError(this._client.id, evt, err);
			});
		});
	}

	/**
	 * list fetch<br>
	 * fetch list rows<br>
	 * @example
	 * socket.on('list-fetch', (res)=>{console.log(res);}); // response (configuration of list and columns)
	 * socket.on('list-fetch-err', (err)=>{console.log(err);});
	 * socket.emit('list-fetch', {"list-fetch", {
	 *	"ListID":"feList",
	 *	"from":0,
	 *	"orderby":null,
	 *	"orderdesc":false,
	 *	"filter":{
	 *	}
	 * }}); // request list rows
	 * @param client {Object} socket.io connection object
	 */
	onFetch() {
		const evt = 'list-fetch';
		this._client.on(evt, (req) => {
			req = {
				ListID: req.ListID,
				From: req.from,
				OrderBy: req.orderby,
				OrderDesc: req.orderdesc
			}
			const list = new List(this._client.id);
			list.fetch(req).then((res) => {
				this._client.emit(evt, res);
				this.logSocketMessage(this._client.id, evt);
			}).catch((err) => {
				this._client.emit(evt + '-err', err);
				this.logSocketError(this._client.id, evt, err);
			});
		});
	}

}

module.exports = SocketList;
