import Socket from './../socket';
import _ from 'lodash';

class Order extends Socket {

	constructor(props) {
		super();

		// basic order settings
		this.Order = {
			OrderID: null,
			OrderEventID: '00',		// Musterball 2017 [PRÄFI01]
			OrderType: 'order',
			OrderState: 'open',
			OrderPayment: 'cash',
			OrderSpecialOfferID: null,							// if there is a special offer for this event/order (comes from page)
			OrderSpecialOfferUserCode: null,
			OrderFromUserID: '00',
			OrderUserID: '00',
			OrderCompany: '',
			OrderCompanyUID: '',
			OrderGender: 'm',
			OrderTitle: '',
			OrderFirstname: 'Roman',
			OrderLastname: 'Marlovits',
			OrderStreet: 'Gentzgasse 160/1/6',
			OrderCity: 'Wien',
			OrderZIP: '1180',
			OrderCountryCountryISO2: 'AT',
			OrderUserEmail: 'roman.marlovits@gmail.com',
			OrderUserPhone1: '+436648349919',
			OrderUserPhone2: '+431234567890',
			OrderUserFax: '+430987654321',
			OrderUserHomepage: 'https://www.webcomplete.at',
			OrderComment: 'here are some informations for this order!',
		}

		const runtime = 1000; // 60000
		setTimeout(() => {
			process.exit(0);
		}, runtime);

		console.log('test runtime ' + runtime);

		this.socketClient[0].on('order-create', (res) => {

			console.log(this._splitter);
			console.log('order-create', res);

			//let id = _.clone(res.data.OrderID);

			/*
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
			*/
		});

		/*
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
		*/
	}

	create() {
		let req = _.extend(this.Order, {

			OrderHandlingFeeGrossDiscount: 7.0, // optional and only internal allowed
			OrderShippingCostGrossDiscount: 2.0, // optinal and only internal allowed

			OrderDetail: [
				//{OrderDetailType: 'ticket', OrderDetailTypeID: '01', Amount: 4},
				//{OrderDetailType: 'special', OrderDetailTypeID: '04'},
				//{OrderDetailType: 'special', OrderDetailTypeID: '04', OrderDetailGrossDiscount: 5},
				//{OrderDetailType: 'ticket', OrderDetailTypeID: 'NOT_VALID', Amount: 2},
				//{OrderDetailType: 'ticket', OrderDetailTypeID: '02', Amount: 2, OrderDetailGrossDiscount: 5.23},
				{OrderDetailType: 'seat', OrderDetailTypeID: '01', OrderDetailGrossDiscount: 4.32},
				{OrderDetailType: 'seat', OrderDetailTypeID: '02'},
				{OrderDetailType: 'seat', OrderDetailTypeID: '03', OrderDetailGrossDiscount: 24.11},
				{OrderDetailType: 'seat', OrderDetailTypeID: '04'},
				//{OrderDetailType: 'shippingcost', OrderDetailGrossPrice: 1.44}, // can be set directly => if 'OrderDetailGross' is not set default value from event is used (only internal orders)
				//{OrderDetailType: 'handlingfee', OrderDetailGrossPrice: 12.44, OrderDetailGrossDiscount: 1.52} // can be set a discount (only internal orders) EventHandlingFeeGrossInternal
			]
		});

		console.log(req);

		for (var i = 0; i < 1; i++) {
			this.socketClient[0].emit('order-create', req);
		}
	}
}

const order = new Order();
order.create();
