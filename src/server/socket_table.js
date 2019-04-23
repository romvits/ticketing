import Helpers from './helpers';
import Table from './modules/table/table'

/**
 * table events
 * @public
 * @class
 * @memberof Socket
 */
class SocketTable extends Helpers {

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
		this.onFetch();
	}

	/**
	 * create a new table
	 * @example
	 * socket.on('table-create', (res)=>{console.log(res);});
	 * socket.on('table-create-err', (err)=>{console.log(err);});
	 * socket.emit('table-create', {
	 *	'TableID': null,
	 *	'TableRoomID': 'RoomID | null',
	 *	'TableNumber': 11,
	 *	'TableName': 'Name',
	 *	'TableLabel': '§§TOKEN',
	 *	'TableSettings': {} // json object of svg or canvas settings for this table
	 * });
	 * @param client {Object} socket.io connection object
	 */
	onCreate(client) {
		const evt = 'table-create';
		this._client.on(evt, (req) => {
			const table = new Table(this._client.id);
			table.create(req).then((res) => {
				this._client.emit(evt, res);
				this.logSocketMessage(this._client.id, evt, res);
			}).catch((err) => {
				this._client.emit(evt + '-err', err);
				this.logSocketError(this._client.id, evt, err);
			});
		});
	}

	/**
	 * update existing table
	 * @example
	 * socket.on('table-update', (res)=>{console.log(res);});
	 * socket.on('table-update-err', (err)=>{console.log(err);});
	 * socket.emit('table-update', {
	 *	'TableID': 'ID of existing table',
	 *	'TableRoomID': 'RoomID | null',
	 *	'TableNumber': 11,
	 *	'TableName': 'Name',
	 *	'TableLabel': '§§TOKEN',
	 *	'TableSettings': {} // json object of svg or canvas settings for this table
	 * });
	 * @param client {Object} socket.io connection object
	 */
	onUpdate(client) {
		const evt = 'table-update';
		this._client.on(evt, (req) => {
			const table = new Table(this._client.id);
			table.update(req).then((res) => {
				this._client.emit(evt, res);
				this.logSocketMessage(this._client.id, evt, res);
			}).catch((err) => {
				this._client.emit(evt + '-err', err);
				this.logSocketError(this._client.id, evt, err);
			});
		});
	}

	/**
	 * delete existing table
	 * @example
	 * socket.on('table-delete', (res)=>{console.log(res);});
	 * socket.on('table-delete-err', (err)=>{console.log(err);});
	 * socket.emit('table-delete', TableID);
	 * @param client {Object} socket.io connection object
	 */
	onDelete(client) {
		const evt = 'table-delete';
		this._client.on(evt, (id) => {
			const table = new Table(this._client.id);
			table.delete(id).then((res) => {
				this._client.emit(evt, id);
				this.logSocketMessage(this._client.id, evt, res);
			}).catch((err) => {
				this._client.emit(evt + '-err', err);
				this.logSocketError(this._client.id, evt, err);
			});
		});
	}

	/**
	 * fetch table
	 * @example
	 * socket.on('table-fetch', (res)=>{console.log(res);});
	 * socket.on('table-fetch-err', (err)=>{console.log(err);});
	 * socket.emit('table-fetch', TableID);
	 * @param client {Object} socket.io connection object
	 */
	onFetch(client) {
		const evt = 'table-fetch';
		this._client.on(evt, (id) => {
			const table = new Table(this._client.id);
			table.fetch(id).then((res) => {
				this._client.emit(evt, res);
				this.logSocketMessage(this._client.id, evt, res);
			}).catch((err) => {
				this._client.emit(evt + '-err', err);
				this.logSocketError(this._client.id, evt, err);
			});
		});
	}

}

module.exports = SocketTable;
