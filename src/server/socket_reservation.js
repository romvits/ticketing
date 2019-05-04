import Helpers from './helpers';
import Reservation from './modules/reservation/reservation'

/**
 * reservation events
 * @public
 * @class
 * @memberof Socket
 */
class SocketReservation extends Helpers {

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
	 * create new order
	 * @example
	 * socket.on('reservation-create', (res)=>{console.log(res);});
	 * socket.on('reservation-create-err', (err)=>{console.log(err);});
	 * socket.emit('reservation-create', {
	 *	'OrderID': null,
	 *	'OrderNumber': null,
	 *	'OrderNumberText': null,
	 *	'OrderEventID': null,
	 *	'OrderType': '', // 'order' | 'credit'
	 *	'OrderState': '', // 'open' | 'payed' | 'refunded'
	 *	'OrderPayment': '', // 'cash' | 'mpay' | 'paypal' | 'transfer'
	 *	'OrderCreditID': '',
	 *	'OrderDateTimeUTC': '',
	 *	'OrderPayedDateTimeUTC': '',
	 *	'OrderFrom': '', // 'extern' | 'intern'
	 *	'OrderFromUserID': null,
	 *	'OrderUserID': null,
	 *	'OrderUserCompany': '',
	 *	'OrderUserCompanyUID': '',
	 *	'OrderUserGender': '', // 'm' | 'f'
	 *	'OrderUserTitle': '',
	 *	'OrderUserFirstname': '',
	 *	'OrderUserLastname': '',
	 *	'OrderUserStreet': '',
	 *	'OrderUserCity': '',
	 *	'OrderUserZIP': '',
	 *	'OrderUserCountryCountryISO2': '',
	 *	'OrderUserEmail': '',
	 *	'OrderUserPhone1': '',
	 *	'OrderUserPhone2': '',
	 *	'OrderUserFax': '',
	 *	'OrderUserHomepage': '',
	 *	'OrderGrossPrice': '',
	 *	'OrderNetPrice': '',
	 *	'OrderDetail': [
	 *		{
	 *			'OrderDetailScanCode': null,
	 *			'OrderDetailScanType': '', // null | 'single' | 'multi' | 'inout' | 'test'
	 *			'OrderDetailOrderID': null,
	 *			'OrderDetailType': '', // null | 'ticket' | 'seat' | 'special' | 'shippingcost' | 'handlingfee'
	 *			'OrderDetailTypeID': '', // if given ticket details where fetched from database
	 *			'OrderDetailState': '', // null | 'sold' | 'canceled'
	 *			'OrderDetailEANRand': '',
	 *			'OrderDetailNumber': '',
	 *			'OrderDetailEANCheckDigit': '',
	 *			'OrderDetailText': '',
	 *			'OrderDetailGrossRegular': '',
	 *			'OrderDetailGrossDiscount': '',
	 *			'OrderDetailGrossPrice': '',
	 *			'OrderDetailTaxPercent': ''
	 *		}, {
	 *			'OrderDetailScanCode': null,
	 *			'OrderDetailScanType': '', // null | 'single' | 'multi' | 'inout' | 'test'
	 *			'OrderDetailOrderID': null,
	 *			'OrderDetailType': '', // null | 'ticket' | 'seat' | 'special' | 'shippingcost' | 'handlingfee'
	 *			'OrderDetailTypeID': '', // if given ticket details where fetched from database
	 *			'OrderDetailState': '', // null | 'sold' | 'canceled'
	 *			'OrderDetailEANRand': '',
	 *			'OrderDetailNumber': '',
	 *			'OrderDetailEANCheckDigit': '',
	 *			'OrderDetailText': '',
	 *			'OrderDetailGrossRegular': '',
	 *			'OrderDetailGrossDiscount': '',
	 *			'OrderDetailGrossPrice': '',
	 *			'OrderDetailTaxPercent': ''
	 *		}
	 *	]
	 * });
	 * @param client {Object} socket.io connection object
	 */
	onCreate(client) {
		const evt = 'reservation-create';
		this._client.on(evt, (req) => {
			const reservation = new Reservation(this._client.id);
			reservation.create(req).then((res) => {
				this._client.emit(evt, res);
				this.logSocketMessage(this._client.id, evt, res);
			}).catch((err) => {
				this._client.emit(evt + '-err', err);
				this.logSocketError(this._client.id, evt, err);
			});
		});
	}

	/**
	 * update existing order
	 * @example
	 * socket.on('reservation-update', (res)=>{console.log(res);});
	 * socket.on('reservation-update-err', (err)=>{console.log(err);});
	 * socket.emit('reservation-update', {
	 *	'OrderID': null,
	 *	'OrderTableID': 'TableID | null', // null can be for location without table like cinema
	 *	'OrderNumber': '',
	 *	'OrderName': '',
	 *	'OrderSettings': {}, // json object of svg or canvas settings for this order
	 *	'OrderGrossPrice': 11.22,
	 *	'OrderTaxPercent': 20
	 * });
	 * @param client {Object} socket.io connection object
	 */
	onUpdate(client) {
		const evt = 'reservation-update';
		this._client.on(evt, (req) => {
			const reservation = new Reservation(this._client.id);
			reservation.update(req).then((res) => {
				this._client.emit(evt, res);
				this.logSocketMessage(this._client.id, evt, res);
			}).catch((err) => {
				this._client.emit(evt + '-err', err);
				this.logSocketError(this._client.id, evt, err);
			});
		});
	}

	/**
	 * delete existing order
	 * @example
	 * socket.on('reservation-delete', (res)=>{console.log(res);});
	 * socket.on('reservation-delete-err', (err)=>{console.log(err);});
	 * socket.emit('reservation-delete', OrderID);
	 * @param client {Object} socket.io connection object
	 */
	onDelete(client) {
		const evt = 'reservation-delete';
		this._client.on(evt, (id) => {
			const reservation = new Reservation(this._client.id);
			reservation.delete(id).then((res) => {
				this._client.emit(evt, id);
				this.logSocketMessage(this._client.id, evt, res);
			}).catch((err) => {
				this._client.emit(evt + '-err', err);
				this.logSocketError(this._client.id, evt, err);
			});
		});
	}

	/**
	 * fetch order
	 * @example
	 * socket.on('reservation-fetch', (res)=>{console.log(res);});
	 * socket.on('reservation-fetch-err', (err)=>{console.log(err);});
	 * socket.emit('reservation-fetch', OrderID);
	 * @param client {Object} socket.io connection object
	 */
	onFetch(client) {
		const evt = 'reservation-fetch';
		this._client.on(evt, (id) => {
			const reservation = new Reservation(this._client.id);
			reservation.fetch(id).then((res) => {
				this._client.emit(evt, res);
				this.logSocketMessage(this._client.id, evt, res);
			}).catch((err) => {
				this._client.emit(evt + '-err', err);
				this.logSocketError(this._client.id, evt, err);
			});
		});
	}

}

module.exports = SocketReservation;
