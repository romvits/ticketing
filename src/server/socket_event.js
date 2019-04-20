import Helpers from './helpers';
import Event from './modules/event/event'

/**
 * event events
 * @public
 * @class
 * @memberof Socket
 */
class SocketEvent extends Helpers {

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
		this.onCheckPrefix();
	}

	/**
	 * create new event
	 * @example
	 * socket.on('event-create', (res)=>{console.log(res);});
	 * socket.on('event-create-err', (err)=>{console.log(err);});
	 * socket.emit('event-create', {
	 *	'EventID': null,
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
	onCreate() {
		const evt = 'event-create';
		this._client.on(evt, (req) => {
			const event = new Event(this._client.id, this._client.userdata.UserID);
			event.create(req).then((res) => {
				this._client.emit(evt, res);
				this.logSocketMessage(this._client.id, this._client.userdata.UserID, evt, res);
			}).catch((err) => {
				this._client.emit(evt + '-err', err);
				this.logSocketError(this._client, evt, err);
			});
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
	onUpdate() {
		const evt = 'event-update';
		this._client.on(evt, (req) => {
			const event = new Event(this._client.id, this._client.userdata.UserID);
			event.update(req).then((res) => {
				this._client.emit(evt, res);
				this.logSocketMessage(this._client.id, this._client.userdata.UserID, evt, res);
			}).catch((err) => {
				this._client.emit(evt + '-err', err);
				this.logSocketError(this._client, evt, err);
			});
		});
	}

	/**
	 * delete existing event
	 * @example
	 * socket.on('event-delete', (res)=>{console.log(res);});
	 * socket.on('event-delete-err', (err)=>{console.log(err);});
	 * socket.emit('event-delete', EventID);
	 */
	onDelete() {
		const evt = 'event-delete';
		this._client.on(evt, (id) => {
			const event = new Event(this._client.id, this._client.userdata.UserID);
			event.delete(id).then((res) => {
				this._client.emit(evt, id);
				this.logSocketMessage(this._client.id, this._client.userdata.UserID, evt, res);
			}).catch((err) => {
				this._client.emit(evt + '-err', err);
				this.logSocketError(this._client, evt, err);
			});
		});
	}

	/**
	 * fetch event
	 * @example
	 * socket.on('event-fetch', (res)=>{console.log(res);});
	 * socket.on('event-fetch-err', (err)=>{console.log(err);});
	 * socket.emit('event-fetch', EventID);
	 */
	onFetch() {
		const evt = 'event-fetch';
		this._client.on(evt, (id) => {
			const event = new Event(this._client.id, this._client.userdata.UserID);
			event.fetch(id).then((res) => {
				this._client.emit(evt, res);
				this.logSocketMessage(this._client.id, this._client.userdata.UserID, evt, res);
			}).catch((err) => {
				this._client.emit(evt + '-err', err);
				this.logSocketError(this._client, evt, err);
			});
		});
	}

	/**
	 * delete existing event
	 * @example
	 * socket.on('event-check-prefix', (res)=>{console.log(res);});
	 * socket.on('event-check-prefix-err', (err)=>{console.log(err);});
	 * socket.emit('event-check-prefix', Prefix);
	 */
	onCheckPrefix() {
		const evt = 'event-check-prefix';
		this._client.on(evt, (prefix) => {
			const event = new Event(this._client.id, this._client.userdata.UserID);
			event.checkPrefix(prefix).then((res) => {
				console.log('SEARCH FOR onCheckPrefix TO FIND THIS COMMENT!');
				console.log('check the result of a count promise query ', res[0].count);
				let ret = (res[0].count) ? false : true;
				this._client.emit(evt, ret);
				this.logSocketMessage(this._client.id, this._client.userdata.UserID, evt, res);
			}).catch((err) => {
				this._client.emit(evt + '-err', err);
				this.logSocketError(this._client, evt, err);
			});
		});
	}
}

module.exports = SocketEvent;
