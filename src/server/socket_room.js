import Helpers from './helpers';
import Room from './modules/room/room'

/**
 * room events
 * @public
 * @class
 * @memberof Socket
 */
class SocketRoom extends Helpers {

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
	 * create new room
	 * @example
	 * socket.on('room-create', (res)=>{console.log(res);});
	 * socket.on('room-create-err', (err)=>{console.log(err);});
	 * socket.emit('room-create', {
	 *	'RoomID': null,
	 *	'RoomFloorID': null,
	 *	'RoomName': '',
	 *	'RoomLabel': '',
	 *	'RoomSVGShape': '10,20,30,40'
	 * });
	 * @param client {Object} socket.io connection object
	 */
	onCreate(client) {
		const evt = 'room-create';
		this._client.on(evt, (req) => {
			const room = new Room(this._client.id);
			room.create(req).then((res) => {
				this._client.emit(evt, res);
				this.logSocketMessage(this._client.id, evt, res);
			}).catch((err) => {
				this._client.emit(evt + '-err', err);
				this.logSocketError(this._client.id, evt, err);
			});
		});
	}

	/**
	 * update existing room
	 * @example
	 * socket.on('room-update', (res)=>{console.log(res);});
	 * socket.on('room-update-err', (err)=>{console.log(err);});
	 * socket.emit('room-update', {
	 *	'RoomID': null,
	 *	'RoomFloorID': null,
	 *	'RoomName': '',
	 *	'RoomLabel': '',
	 *	'RoomSVGShape': '10,20,30,40'
	 * });
	 * @param client {Object} socket.io connection object
	 */
	onUpdate(client) {
		const evt = 'room-update';
		this._client.on(evt, (req) => {
			const room = new Room(this._client.id);
			room.update(req).then((res) => {
				this._client.emit(evt, res);
				this.logSocketMessage(this._client.id, evt, res);
			}).catch((err) => {
				this._client.emit(evt + '-err', err);
				this.logSocketError(this._client.id, evt, err);
			});
		});
	}

	/**
	 * delete existing room
	 * @example
	 * socket.on('room-delete', (res)=>{console.log(res);});
	 * socket.on('room-delete-err', (err)=>{console.log(err);});
	 * socket.emit('room-delete', RoomID);
	 * @param client {Object} socket.io connection object
	 */
	onDelete(client) {
		const evt = 'room-delete';
		this._client.on(evt, (id) => {
			const room = new Room(this._client.id);
			room.delete(id).then((res) => {
				this._client.emit(evt, id);
				this.logSocketMessage(this._client.id, evt, res);
			}).catch((err) => {
				this._client.emit(evt + '-err', err);
				this.logSocketError(this._client.id, evt, err);
			});
		});
	}

	/**
	 * fetch room
	 * @example
	 * socket.on('room-fetch', (res)=>{console.log(res);});
	 * socket.on('room-fetch-err', (err)=>{console.log(err);});
	 * socket.emit('room-fetch', RoomID);
	 * @param client {Object} socket.io connection object
	 */
	onFetch(client) {
		const evt = 'room-fetch';
		this._client.on(evt, (id) => {
			const room = new Room(this._client.id);
			room.fetch(id).then((res) => {
				this._client.emit(evt, res);
				this.logSocketMessage(this._client.id, evt, res);
			}).catch((err) => {
				this._client.emit(evt + '-err', err);
				this.logSocketError(this._client.id, evt, err);
			});
		});
	}

}

module.exports = SocketRoom;
