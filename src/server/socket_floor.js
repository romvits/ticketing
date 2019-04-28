import Helpers from './helpers';
import Floor from './modules/floor/floor'

/**
 * floor events
 * @public
 * @class
 * @memberof Socket
 */
class SocketFloor extends Helpers {

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
	 * floor create<br>
	 * create a new floor
	 * @example
	 * socket.on('floor-create', (res)=>{console.log(res);});
	 * socket.on('floor-create-err', (err)=>{console.log(err);});
	 * socket.emit('floor-create', {
	 *	'FloorID': null,
	 *	'FloorEventID': 'EventID | null',
	 *	'FloorLocationID': 'LocationID | null',
	 *	'FloorName': 'Name',
	 *	'FloorLabel': '§§TOKEN',
	 *	'FloorSVG': 'SVG String | null'
	 * });
	 * @param client {Object} socket.io connection object
	 */
	onCreate(client) {
		const evt = 'floor-create';
		this._client.on(evt, req => {
			const floor = new Floor(this._client.id);
			floor.create(req).then(res =>  {
				this._client.emit(evt, res);
				this.logSocketMessage(this._client.id, evt, res);
			}).catch(err =>  {
				this._client.emit(evt + '-err', err);
				this.logSocketError(this._client.id, evt, err);
			});
		});
	}

	/**
	 * floor update<br>
	 * update existing floor
	 * @example
	 * socket.on('floor-update', (res)=>{console.log(res);});
	 * socket.on('floor-update-err', (err)=>{console.log(err);});
	 * socket.emit('floor-update', {
	 *	'FloorID': 'ID of existing floor',
	 *	'FloorEventID': 'EventID | null',
	 *	'FloorLocationID': 'LocationID | null',
	 *	'FloorName': 'Name',
	 *	'FloorLabel': '§§TOKEN',
	 *	'FloorSVG': 'SVG String | null'
	 * });
	 * @param client {Object} socket.io connection object
	 */
	onUpdate(client) {
		const evt = 'floor-update';
		this._client.on(evt, req => {
			const floor = new Floor(this._client.id);
			floor.update(req).then(res =>  {
				this._client.emit(evt, res);
				this.logSocketMessage(this._client.id, evt, res);
			}).catch(err =>  {
				this._client.emit(evt + '-err', err);
				this.logSocketError(this._client.id, evt, err);
			});
		});
	}

	/**
	 * floor delete<br>
	 * delete existing floor
	 * @example
	 * socket.on('floor-delete', (res)=>{console.log(res);});
	 * socket.on('floor-delete-err', (err)=>{console.log(err);});
	 * socket.emit('floor-delete', FloorID);
	 * @param client {Object} socket.io connection object
	 */
	onDelete(client) {
		const evt = 'floor-delete';
		this._client.on(evt, (id) => {
			const floor = new Floor(this._client.id);
			floor.delete(id).then(res =>  {
				this._client.emit(evt, id);
				this.logSocketMessage(this._client.id, evt, res);
			}).catch(err =>  {
				this._client.emit(evt + '-err', err);
				this.logSocketError(this._client.id, evt, err);
			});
		});
	}

	/**
	 * floor fetch<br>
	 * fetch floor
	 * @example
	 * socket.on('floor-fetch', (res)=>{console.log(res);});
	 * socket.on('floor-fetch-err', (err)=>{console.log(err);});
	 * socket.emit('floor-fetch', FloorID);
	 * @param client {Object} socket.io connection object
	 */
	onFetch(client) {
		const evt = 'floor-fetch';
		this._client.on(evt, (id) => {
			const floor = new Floor(this._client.id);
			floor.fetch(id).then(res =>  {
				this._client.emit(evt, res);
				this.logSocketMessage(this._client.id, evt, res);
			}).catch(err =>  {
				this._client.emit(evt + '-err', err);
				this.logSocketError(this._client.id, evt, err);
			});
		});
	}

}

module.exports = SocketFloor;
