import Socket from '../../socket';
import _ from 'lodash';
import randtoken from "rand-token";

class Event extends Socket {

	constructor() {
		super();

		const runtime = 10000;
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
			}, this.randTimeout() + 1500);

			setTimeout(() => {
				this.updateError(id);
			}, this.randTimeout() + 2000);

			setTimeout(() => {
				this.fetch(id);
			}, this.randTimeout() + 2500);

			setTimeout(() => {
				this.checkPrefixFalse('DEMO1');
			}, this.randTimeout() + 3000);

			setTimeout(() => {
				this.checkPrefixTrue('ABCDE');
			}, this.randTimeout() + 3500);

			setTimeout(() => {
				// this.delete(id);
			}, this.randTimeout() + runtime - 5000);
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

		this.socketClient[0].on('event-check-prefix', (res) => {
			console.log(this._splitter);
			console.log('event-check-prefix', res);
		});

	}

	create() {
		const req = {
			'EventID': null,
			'EventPromoterID': '00',
			'EventLocationID': '00',
			'EventName': 'Event Name',
			'EventPrefix': randtoken.generate(5).toUpperCase(),
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

			'EventHandlingFeeName': 'Bearbeitungsgebühr',
			'EventHandlingFeeLabel': '§§HANDLINGFEE',
			'EventHandlingFeeGrossInternal': 12.44,
			'EventHandlingFeeGrossExternal': 12.33,
			'EventHandlingFeeTaxPercent': 2.66,
			'EventShippingCostName': 'Versandkosten',
			'EventShippingCostLabel': '§§SHIPPINGCOST',
			'EventShippingCostGrossInternal': 12.43,
			'EventShippingCostGrossExternal': 43.21,
			'EventShippingCostTaxPercent': 2.88,

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
			'EventPrefix': randtoken.generate(5).toUpperCase(),
		};
		this.socketClient[0].emit('event-update', req);
	}

	delete(id) {
		this.socketClient[0].emit('event-delete', id);
	}

	checkPrefixTrue(prefix) {
		this.socketClient[0].emit('event-check-prefix', prefix);
	}

	checkPrefixFalse(prefix) {
		this.socketClient[0].emit('event-check-prefix', prefix);
	}
}

const event = new Event();
event.create();


