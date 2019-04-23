import Helpers from './helpers';
import Seat from './modules/seat/seat'

/**
 * seat events
 * @public
 * @class
 * @memberof Socket
 */
class SocketSeat extends Helpers {

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
	 * create new seat
	 * @example
	 * socket.on('seat-create', (res)=>{console.log(res);});
	 * socket.on('seat-create-err', (err)=>{console.log(err);});
	 * socket.emit('seat-create', {
	 *	'SeatID': null,
	 *	'SeatFloorID': 'FloorID',
	 *	'SeatRoomID': 'RoomID',
	 *	'SeatTableID': 'TableID | null', // null can be for location without table like cinema
	 *	'SeatNumber': '',
	 *	'SeatName': '',
	 *	'SeatSettings': {}, // json object of svg or canvas settings for this seat
	 *	'SeatGrossPrice': 11.22,
	 *	'SeatTaxPercent': 20
	 * });
	 * @param client {Object} socket.io connection object
	 */
	onCreate(client) {
		const evt = 'seat-create';
		this._client.on(evt, (req) => {
			const seat = new Seat(this._client.id);
			seat.create(req).then((res) => {
				this._client.emit(evt, res);
				this.logSocketMessage(this._client.id, evt, res);
			}).catch((err) => {
				this._client.emit(evt + '-err', err);
				this.logSocketError(this._client.id, evt, err);
			});
		});
	}

	/**
	 * update existing seat
	 * @example
	 * socket.on('seat-update', (res)=>{console.log(res);});
	 * socket.on('seat-update-err', (err)=>{console.log(err);});
	 * socket.emit('seat-update', {
	 *	'SeatID': null,
	 *	'SeatFloorID': 'FloorID',
	 *	'SeatRoomID': 'RoomID',
	 *	'SeatTableID': 'TableID | null', // null can be for location without table like cinema
	 *	'SeatNumber': '',
	 *	'SeatName': '',
	 *	'SeatSettings': {}, // json object of svg or canvas settings for this seat
	 *	'SeatGrossPrice': 11.22,
	 *	'SeatTaxPercent': 20
	 * });
	 * @param client {Object} socket.io connection object
	 */
	onUpdate(client) {
		const evt = 'seat-update';
		this._client.on(evt, (req) => {
			const seat = new Seat(this._client.id);
			seat.update(req).then((res) => {
				this._client.emit(evt, res);
				this.logSocketMessage(this._client.id, evt, res);
			}).catch((err) => {
				this._client.emit(evt + '-err', err);
				this.logSocketError(this._client.id, evt, err);
			});
		});
	}

	/**
	 * delete existing seat
	 * @example
	 * socket.on('seat-delete', (res)=>{console.log(res);});
	 * socket.on('seat-delete-err', (err)=>{console.log(err);});
	 * socket.emit('seat-delete', SeatID);
	 * @param client {Object} socket.io connection object
	 */
	onDelete(client) {
		const evt = 'seat-delete';
		this._client.on(evt, (id) => {
			const seat = new Seat(this._client.id);
			seat.delete(id).then((res) => {
				this._client.emit(evt, id);
				this.logSocketMessage(this._client.id, evt, res);
			}).catch((err) => {
				this._client.emit(evt + '-err', err);
				this.logSocketError(this._client.id, evt, err);
			});
		});
	}

	/**
	 * fetch seat
	 * @example
	 * socket.on('seat-fetch', (res)=>{console.log(res);});
	 * socket.on('seat-fetch-err', (err)=>{console.log(err);});
	 * socket.emit('seat-fetch', SeatID);
	 * @param client {Object} socket.io connection object
	 */
	onFetch(client) {
		const evt = 'seat-fetch';
		this._client.on(evt, (id) => {
			const seat = new Seat(this._client.id);
			seat.fetch(id).then((res) => {
				this._client.emit(evt, res);
				this.logSocketMessage(this._client.id, evt, res);
			}).catch((err) => {
				this._client.emit(evt + '-err', err);
				this.logSocketError(this._client.id, evt, err);
			});
		});
	}

}

module.exports = SocketSeat;
