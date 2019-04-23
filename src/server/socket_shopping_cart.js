import Helpers from './helpers';
import Event from './modules/shopping_cart/shopping_cart';

/**
 * event events
 * @public
 * @class
 * @memberof Socket
 */
class SocketShoppingCart extends Helpers {

	/**
	 * constructor for list socket events<br>
	 * @param client {Object} socket.io connection object
	 */
	constructor(client) {
		super();
		this._client = client;
		this.onSet();
		this.onEmpty();
		this.onCheckout();
	}

	/**
	 * set shopping cart values
	 * @example
	 * socket.on('shopping-cart-set', (res)=>{console.log(res);});
	 * socket.on('shopping-cart-set-err', (err)=>{console.log(err);});
	 * socket.emit('shopping-cart-set', {
	 *	'Ticket': [
	 *	   {ID: '01', GrossDiscount: 0.00},
	 *	   {ID: '01', GrossDiscount: 0.00},
	 *	   {ID: '02', GrossDiscount: 5.00}, // GrossDiscount is only allowed if comes with 'FromUserID'
	 *	   {ID: '02', GrossDiscount: 5.00}  // GrossDiscount is only allowed if comes with 'FromUserID'
	 *	],
	 *	'Seat': [
	 *	   {ID: '01', GrossDiscount: 0.00},
	 *	   {ID: '02', GrossDiscount: 0.00},
	 *	   {ID: '03', GrossDiscount: 5.00}  // GrossDiscount is only allowed if comes with 'FromUserID'
	 *	],
	 *	'SpecialOffer': {
	 *	   ID: '',
	 *	   UserCode: ''                     // if SpecialOfferUserCode is set than check if code was already used
	 *	}
	 * });
	 */
	onSet() {
		const evt = 'shopping-cart-ticket';
		this._client.on(evt, (req) => {
			this._client.userdata.shoppingCart = req;
			this._client.emit(evt, res);
			this.logSocketMessage(this._client.id, evt, res);
		});
	}

	/**
	 * update existing event
	 * @example
	 * socket.on('event-update', (res)=>{console.log(res);});
	 * socket.on('event-update-err', (err)=>{console.log(err);});
	 * socket.emit('event-update', {
	 *	'EventID': 'ID of existing event',
	 *	'EventPromoterID': 'PromoterID | null',
	 *	'EventLocationID': 'LocationID | null',
	 *	'EventName': 'Event Name',
	 *	'EventPrefix': 'EPRE',
	 *	'EventPhone1': '+43123',
	 *	'EventPhone2': '+43456',
	 *	'EventFax': '+43789',
	 *	'EventEmail': 'event.email@test.tld',
	 *	'EventHomepage': 'http://eventhomepage.tld',
	 *	'EventSubdomain': 'epre-event-2019',
	 *	'EventStartBillNumber': 1234,
	 *	'EventMaximumSeats': 20,
	 *	'EventStepSeats': 2,
	 *	'EventDefaultTaxTicketPercent': 1.11,
	 *	'EventDefaultTaxSeatPercent': 1.22,
	 *	'EventStartDateTimeUTC': '2019-04-07 08:11:00',
	 *	'EventEndDateTimeUTC': '2019-04-07 08:12:00',
	 *	'EventSaleStartDateTimeUTC': '2019-04-07 08:13:00',
	 *	'EventSaleEndDateTimeUTC': '2019-04-07 08:14:00',
	 *	'EventScanStartDateTimeUTC': '2019-04-07 08:15:00',
	 *	'EventScanEndDateTimeUTC': '2019-04-07 08:16:00',
	 *	'EventHandlingFeeName': 'Bearbeitungsgebühr',
	 *	'EventHandlingFeeLabel': '§§HANDLINGFEE',
	 *	'EventHandlingFeeGrossInternal': 12.44,
	 *	'EventHandlingFeeGrossExternal': 12.33,
	 *	'EventHandlingFeeTaxPercent': 2.66,
	 *	'EventShippingCostName': 'Versandkosten',
	 *	'EventShippingCostLabel': '§§SHIPPINGCOST',
	 *	'EventShippingCostGross': 12.43,
	 *	'EventShippingCostTaxPercent': 2.88,
	 *	'EventSendMailAddress': 'event.email@test.tld',
	 *	'EventSendMailServer': 'smtp.test.tld',
	 *	'EventSendMailServerPort': 25,
	 *	'EventSendMailUsername': 'username',
	 *	'EventSendMailPassword': 'password',
	 *	'EventSendMailSettingsJSON': '{"test":"value"}',
	 *	'EventMpayTestFlag': 1,
	 *	'EventMpayMerchantID': '1234567890',
	 *	'EventMpaySoapPassword': 'passWD',
	 *	'EventMpayTestMerchantID': '0987654321',
	 *	'EventMpayTestSoapPassword': 'PASSwd'
	 * });
	 */
	onEmpty() {
		const evt = 'shopping-cart-seat';
		this._client.on(evt, (req) => {
			this._client.emit(evt, res);
			this.logSocketMessage(this._client.id, evt, res);
		});
	}

	/**
	 * update existing event
	 * @example
	 * socket.on('event-update', (res)=>{console.log(res);});
	 * socket.on('event-update-err', (err)=>{console.log(err);});
	 * socket.emit('event-update', {
	 *	'EventID': 'ID of existing event',
	 *	'EventPromoterID': 'PromoterID | null',
	 *	'EventLocationID': 'LocationID | null',
	 *	'EventName': 'Event Name',
	 *	'EventPrefix': 'EPRE',
	 *	'EventPhone1': '+43123',
	 *	'EventPhone2': '+43456',
	 *	'EventFax': '+43789',
	 *	'EventEmail': 'event.email@test.tld',
	 *	'EventHomepage': 'http://eventhomepage.tld',
	 *	'EventSubdomain': 'epre-event-2019',
	 *	'EventStartBillNumber': 1234,
	 *	'EventMaximumSeats': 20,
	 *	'EventStepSeats': 2,
	 *	'EventDefaultTaxTicketPercent': 1.11,
	 *	'EventDefaultTaxSeatPercent': 1.22,
	 *	'EventStartDateTimeUTC': '2019-04-07 08:11:00',
	 *	'EventEndDateTimeUTC': '2019-04-07 08:12:00',
	 *	'EventSaleStartDateTimeUTC': '2019-04-07 08:13:00',
	 *	'EventSaleEndDateTimeUTC': '2019-04-07 08:14:00',
	 *	'EventScanStartDateTimeUTC': '2019-04-07 08:15:00',
	 *	'EventScanEndDateTimeUTC': '2019-04-07 08:16:00',
	 *	'EventHandlingFeeName': 'Bearbeitungsgebühr',
	 *	'EventHandlingFeeLabel': '§§HANDLINGFEE',
	 *	'EventHandlingFeeGrossInternal': 12.44,
	 *	'EventHandlingFeeGrossExternal': 12.33,
	 *	'EventHandlingFeeTaxPercent': 2.66,
	 *	'EventShippingCostName': 'Versandkosten',
	 *	'EventShippingCostLabel': '§§SHIPPINGCOST',
	 *	'EventShippingCostGross': 12.43,
	 *	'EventShippingCostTaxPercent': 2.88,
	 *	'EventSendMailAddress': 'event.email@test.tld',
	 *	'EventSendMailServer': 'smtp.test.tld',
	 *	'EventSendMailServerPort': 25,
	 *	'EventSendMailUsername': 'username',
	 *	'EventSendMailPassword': 'password',
	 *	'EventSendMailSettingsJSON': '{"test":"value"}',
	 *	'EventMpayTestFlag': 1,
	 *	'EventMpayMerchantID': '1234567890',
	 *	'EventMpaySoapPassword': 'passWD',
	 *	'EventMpayTestMerchantID': '0987654321',
	 *	'EventMpayTestSoapPassword': 'PASSwd'
	 * });
	 */
	onCheckout() {
		const evt = 'shopping-cart-seat';
		this._client.on(evt, (req) => {
			this._client.emit(evt, res);
			this.logSocketMessage(this._client.id, evt, res);
		});
	}
}

module.exports = SocketShoppingCart;
