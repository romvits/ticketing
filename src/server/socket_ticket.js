import Helpers from './helpers';
import Ticket from './modules/ticket/ticket'

/**
 * tocket events
 * @public
 * @class
 * @memberof Socket
 */
class SocketTicket extends Helpers {

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
	 * create a new ticket
	 * @example
	 * socket.on('ticket-create', (res)=>{console.log(res);});
	 * socket.on('ticket-create-err', (err)=>{console.log(err);});
	 * socket.emit('ticket-create', {
	 *	'TicketID': null,
	 *	'TicketEventID': null,
	 *	'TicketName': 'Ticket Name',
	 *	'TicketLabel': '§§TICKETLABEL',
	 *	'TicketType': 'ticket',
	 *	'TicketScanType': 'single',
	 *	'TicketQuota': 100,
	 *	'TicketQuotaPreprint': 20,
	 *	'TicketGrossPrice': 11.22,
	 *	'TicketTaxPercent': 12.34
	 * });
	 * @param client {Object} socket.io connection object
	 */
	onCreate(client) {
		const evt = 'ticket-create';
		this._client.on(evt, (req) => {
			const ticket = new Ticket(this._client.id);
			ticket.create(req).then((res) => {
				this._client.emit(evt, res);
				this.logSocketMessage(this._client.id, evt, res);
			}).catch((err) => {
				this._client.emit(evt + '-err', err);
				this.logSocketError(this._client.id, evt, err);
			});
		});
	}

	/**
	 * update existing ticket
	 * @example
	 * socket.on('ticket-update', (res)=>{console.log(res);});
	 * socket.on('ticket-update-err', (err)=>{console.log(err);});
	 * socket.emit('ticket-update', {
	 *	'TicketID': null,
	 *	'TicketEventID': null,
	 *	'TicketName': 'Ticket Name',
	 *	'TicketLabel': '§§TICKETLABEL',
	 *	'TicketType': 'ticket',
	 *	'TicketScanType': 'single',
	 *	'TicketQuota': 100,
	 *	'TicketQuotaPreprint': 20,
	 *	'TicketGrossPrice': 11.22,
	 *	'TicketTaxPercent': 12.34
	 * });
	 * @param client {Object} socket.io connection object
	 */
	onUpdate(client) {
		const evt = 'ticket-update';
		this._client.on(evt, (req) => {
			const ticket = new Ticket(this._client.id);
			ticket.update(req).then((res) => {
				this._client.emit(evt, res);
				this.logSocketMessage(this._client.id, evt, res);
			}).catch((err) => {
				this._client.emit(evt + '-err', err);
				this.logSocketError(this._client.id, evt, err);
			});
		});
	}

	/**
	 * delete existing ticket
	 * @example
	 * socket.on('ticket-delete', (res)=>{console.log(res);});
	 * socket.on('ticket-delete-err', (err)=>{console.log(err);});
	 * socket.emit('ticket-delete', TicketID);
	 * @param client {Object} socket.io connection object
	 */
	onDelete(client) {
		const evt = 'ticket-delete';
		this._client.on(evt, (id) => {
			const ticket = new Ticket(this._client.id);
			ticket.delete(id).then((res) => {
				this._client.emit(evt, id);
				this.logSocketMessage(this._client.id, evt, res);
			}).catch((err) => {
				this._client.emit(evt + '-err', err);
				this.logSocketError(this._client.id, evt, err);
			});
		});
	}

	/**
	 * fetch ticket
	 * @example
	 * socket.on('ticket-fetch', (res)=>{console.log(res);});
	 * socket.on('ticket-fetch-err', (err)=>{console.log(err);});
	 * socket.emit('ticket-fetch', TicketID);
	 * @param client {Object} socket.io connection object
	 */
	onFetch(client) {
		const evt = 'ticket-fetch';
		this._client.on(evt, (id) => {
			const ticket = new Ticket(this._client.id);
			ticket.fetch(id).then((res) => {
				this._client.emit(evt, res);
				this.logSocketMessage(this._client.id, evt, res);
			}).catch((err) => {
				this._client.emit(evt + '-err', err);
				this.logSocketError(this._client.id, evt, err);
			});
		});
	}

}

module.exports = SocketTicket;
