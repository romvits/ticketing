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
		this.onChancelItem();
		this.onFetchOrder();
		this.onFetchAll();
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
			const order = new Order(this._client.id);
			order.create(req).then((res) => {
				this.logSocketMessage(this._client.id, evt, req);
				this._client.emit(evt, res);
			}).catch((err) => {
				this._client.emit(evt + '-err', err);
				this.logSocketError(this._client.id, evt, err);
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
			const order = new Order(this._client.id);
			order.update(req).then((res) => {
				this.logSocketMessage(this._client.id, evt, req);
				this._client.emit(evt, res);
			}).catch((err) => {
				this._client.emit(evt + '-err', err);
				this.logSocketError(this._client.id, evt, err);
			});
		});
	}

	/**
	 * cancel item(s) from order with given OrderID
	 * only allowed from internal user!
	 * @example
	 * socket.on('order-cancel-item', (res)=>{console.log(res);});
	 * socket.on('order-cancel-item-err', (err)=>{console.log(err);});
	 * socket.emit('order-cancel-item', {OrderID: OrderID, ScanCodes:[OrderDetailScanCode, OrderDetailScanCode]});
	 * @param client {Object} socket.io connection object
	 */
	onChancelItem(client) {
		const evt = 'order-cancel-item';
		this._client.on(evt, (req) => {
			const order = new Order(this._client.id);
			order.cancelItem(req.OrderID, req.Scancodes).then((res) => {
				this.logSocketMessage(this._client.id, evt, req);
				this._client.emit(evt, res);
			}).catch((err) => {
				this._client.emit(evt + '-err', err);
				this.logSocketError(this._client.id, evt, err);
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
	onFetchOrder(client) {
		const evt = 'order-fetch';
		this._client.on(evt, (req) => {
			const order = new Order(this._client.id);
			order.fetchOrder(req).then((res) => {
				this.logSocketMessage(this._client.id, evt, req);
				this._client.emit(evt, res);
			}).catch((err) => {
				this._client.emit(evt + '-err', err);
				this.logSocketError(this._client.id, evt, err);
			});
		});
	}

	/**
	 * fetch order
	 * @example
	 * socket.on('order-fetch-all', (res)=>{console.log(res);});
	 * socket.on('order-fetch-all-err', (err)=>{console.log(err);});
	 * socket.emit('order-fetch-all');
	 * @param client {Object} socket.io connection object
	 */
	onFetchAll(client) {
		const evt = 'order-fetch-all';
		this._client.on(evt, (req) => {
			if (this._client.userdata.User && this._client.userdata.Event) {
				const order = new Order(this._client.id);
				order.fetchAll(req).then((res) => {
					this.logSocketMessage(this._client.id, evt, req);
					this._client.emit(evt, res);
				}).catch((err) => {
					this._client.emit(evt + '-err', err);
					this.logSocketError(this._client.id, evt, err);
				});
			} else {
				this._client.emit(evt + '-err', {msg: 'no user or no event is set', user: this._client.userdata.User, event: this._client.userdata.Event});
			}
		});
	}


}

module.exports = SocketOrder;
