import Helpers from './helpers';
import Order from './modules/order/order'

/**
 * order events
 * @public
 * @class
 * @memberof Socket
 */
class SocketOrder extends Helpers {

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
	 * socket.on('order-create', (res)=>{console.log(res);});
	 * socket.on('order-create-err', (err)=>{console.log(err);});
	 * socket.emit('order-create', {
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
	 *	'OrderCompany': '',
	 *	'OrderCompanyUID': '',
	 *	'OrderGender': '', // 'm' | 'f'
	 *	'OrderTitle': '',
	 *	'OrderFirstname': '',
	 *	'OrderLastname': '',
	 *	'OrderStreet': '',
	 *	'OrderCity': '',
	 *	'OrderZIP': '',
	 *	'OrderCountryCountryISO2': '',
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
		const evt = 'order-create';
		this._client.on(evt, (req) => {
			const order = new Order(this._client.id, this._client.userdata.UserID);
			order.create(req).then((res) => {
				this._client.emit(evt, res);
				this.logSocketMessage(this._client, evt, res);
			}).catch((err) => {
				this._client.emit(evt + '-err', err);
				this.logSocketError(this._client, evt, err);
			});
		});
	}

	/**
	 * update existing order
	 * @example
	 * socket.on('order-update', (res)=>{console.log(res);});
	 * socket.on('order-update-err', (err)=>{console.log(err);});
	 * socket.emit('order-update', {
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
		const evt = 'order-update';
		this._client.on(evt, (req) => {
			const order = new Order(this._client.id, this._client.userdata.UserID);
			order.update(req).then((res) => {
				this._client.emit(evt, res);
				this.logSocketMessage(this._client, evt, res);
			}).catch((err) => {
				this._client.emit(evt + '-err', err);
				this.logSocketError(this._client, evt, err);
			});
		});
	}

	/**
	 * delete existing order
	 * @example
	 * socket.on('order-delete', (res)=>{console.log(res);});
	 * socket.on('order-delete-err', (err)=>{console.log(err);});
	 * socket.emit('order-delete', OrderID);
	 * @param client {Object} socket.io connection object
	 */
	onDelete(client) {
		const evt = 'order-delete';
		this._client.on(evt, (id) => {
			const order = new Order(this._client.id, this._client.userdata.UserID);
			order.delete(id).then((res) => {
				this._client.emit(evt, id);
				this.logSocketMessage(this._client, evt, res);
			}).catch((err) => {
				this._client.emit(evt + '-err', err);
				this.logSocketError(this._client, evt, err);
			});
		});
	}

	/**
	 * fetch order
	 * @example
	 * socket.on('order-fetch', (res)=>{console.log(res);});
	 * socket.on('order-fetch-err', (err)=>{console.log(err);});
	 * socket.emit('order-fetch', OrderID);
	 * @param client {Object} socket.io connection object
	 */
	onFetch(client) {
		const evt = 'order-fetch';
		this._client.on(evt, (id) => {
			const order = new Order(this._client.id, this._client.userdata.UserID);
			order.fetch(id).then((res) => {
				this._client.emit(evt, res);
				this.logSocketMessage(this._client, evt, res);
			}).catch((err) => {
				this._client.emit(evt + '-err', err);
				this.logSocketError(this._client, evt, err);
			});
		});
	}

}

module.exports = SocketOrder;
