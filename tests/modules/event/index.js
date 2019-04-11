import Socket from './../socket';
import _ from 'lodash';
import randtoken from "rand-token";

class Event extends Socket {

	constructor() {
		super();

		const runtime = 60000;
		setTimeout(() => {
			process.exit(0);
		}, runtime);

		console.log('test runtime ' + runtime);

		this.socketClient[0].on('event-create', (res) => {

			console.log(this._splitter);
			console.log('event-create', res);

			let id = _.clone(res.data.EventID);

			setTimeout(() => {
				this.fetch(id);
			}, this.randTimeout() + 1000);

			setTimeout(() => {
				this.update(id);
			}, this.randTimeout() + 2000);

			setTimeout(() => {
				this.updateError(id);
			}, this.randTimeout() + 3000);

			setTimeout(() => {
				this.fetch(id);
			}, this.randTimeout() + 4000);

			setTimeout(() => {
				// this.delete(id);
			}, this.randTimeout() +runtime - 5000);
		});

		this.socketClient[0].on('event-fetch', (res) => {
			console.log(this._splitter);
			console.log('event-fetch', res);
		});

		this.socketClient[0].on('event-update', (res) => {
			console.log(this._splitter);
			console.log('event-update', res);
		});

		this.socketClient[0].on('event-delete', (res) => {
			console.log(this._splitter);
			console.log('event-delete', res);
		});
	}

	create() {
		const req = {
			'EventID': null,
			'EventPromoterID': null,
			'EventLocationID': null,
			'EventName': 'Event Name',
			'EventPrefix': randtoken.generate(7).toUpperCase(),
			'EventPhone1': '+43123',
			'EventPhone2': '+43456',
			'EventFax': '+43789',
			'EventEmail': 'event.email@test.tld',
			'EventHomepage': 'http://eventhomepage.tld',
			'EventSubdomain': 'event-2019-' + randtoken.generate(10),
			'EventStartBillNumber': 1234,
			'EventMaximumSeats': 20,
			'EventStepSeats': 2,
			'EventDefaultTaxTicketPercent': 1.11,
			'EventDefaultTaxSeatPercent': 1.22,
			'EventStartDateTimeUTC': '2019-04-07 08:11:00',
			'EventEndDateTimeUTC': '2019-04-07 08:12:00',
			'EventSaleStartDateTimeUTC': '2019-04-07 08:13:00',
			'EventSaleEndDateTimeUTC': '2019-04-07 08:14:00',
			'EventScanStartDateTimeUTC': '2019-04-07 08:15:00',
			'EventScanEndDateTimeUTC': '2019-04-07 08:16:00',
			'EventInternalHandlingFeeGross': 2.11,
			'EventInternalHandlingFeeTaxPercent': 2.22,
			'EventInternalShippingCostGross': 2.33,
			'EventInternalShippingCostTaxPercent': 2.44,
			'EventExternalShippingCostGross': 2.55,
			'EventExternalShippingCostTaxPercent': 2.66,
			'EventExternalHandlingFeeGross': 2.77,
			'EventExternalHandlingFeeTaxPercent': 2.88,
			'EventSendMailAddress': 'event.email@test.tld',
			'EventSendMailServer': 'smtp.test.tld',
			'EventSendMailServerPort': 25,
			'EventSendMailUsername': 'username',
			'EventSendMailPassword': 'password',
			'EventSendMailSettingsJSON': '{"test":"value"}',
			'EventMpayTestFlag': 1,
			'EventMpayMerchantID': '1234567890',
			'EventMpaySoapPassword': 'passWD',
			'EventMpayTestMerchantID': '0987654321',
			'EventMpayTestSoapPassword': 'PASSwd'

		};
		this.socketClient[0].emit('event-create', req);
	}

	fetch(id) {
		this.socketClient[0].emit('event-fetch', id);
	}

	updateError(id) {

	}

	update(id) {
		const req = {
			'EventID': id,
			'EventName': 'Event Name Updated',
			'EventPrefix': randtoken.generate(7).toUpperCase(),
		};
		this.socketClient[0].emit('event-update', req);
	}

	delete(id) {
		this.socketClient[0].emit('event-delete', id);
	}

}

const event = new Event();
event.create();

