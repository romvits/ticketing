import Socket from './../socket';
import _ from 'lodash';

class Order extends Socket {

	constructor(props) {
		super();

		const runtime = 1000; // 60000
		setTimeout(() => {
			process.exit(0);
		}, runtime);

		console.log('test runtime ' + runtime);

		this.socketClient[0].on('order-create', (res) => {

			console.log(this._splitter);
			console.log('order-create', res);

			let id = _.clone(res.data.OrderID);

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
		let req = {
			OrderID: null,
			OrderEventID: '0178249e81238d7c20160912182049', 	// Musterball 2017 [PRÄFI01]
			OrderSpecialOfferID: null,							// if there is a special offer for this event/order (comes from page)

			OrderType: 'order',
			OrderState: 'open',
			OrderPayment: 'cash',

			OrderFrom: 'intern',
			OrderFromUserID: '111111111111111111111111111111',
			OrderUserID: '111111111111111111111111111111',

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

			//OrderHandlingFeeGross: 7.0, // optional and only internal allowed
			//OrderShippingCostGross: 2.0, // optinal and only internal allowed

			OrderDetail: [
				{OrderDetailTypeID: '3ff688f42eb7d80720160924132806', OrderDetailType: 'ticket', Amount: 2},
				{OrderDetailTypeID: 'NOT_VALID', OrderDetailType: 'ticket', Amount: 2},
				{OrderDetailTypeID: '0f66445b815002e320160924132559', OrderDetailType: 'ticket', Amount: 2, OrderDetailGrossDiscount: 5.23},
				{OrderDetailTypeID: '37b7d8065e5f5d2c20160913133226', OrderDetailType: 'seat'},
				{OrderDetailTypeID: 'ab0ca694294b9d7020160925154908', OrderDetailType: 'special', Amount: 2},
				{OrderDetailType: 'shippingcost', OrderDetailGrossDiscount: 2.50},
				{OrderDetailType: 'handlingfee', OrderDetailGrossDiscount: 1.50}
			]







			/*
			OrderDetail: [
				{
					OrderDetailTypeID: '0f66445b815002e320160924132559', 	// Eintrittskarte
					OrderDetailType: 'ticket',								// type
				}, {
					OrderDetailTypeID: '0f66445b815002e320160924132559', 	// Eintrittskarte
					OrderDetailType: 'ticket',								// type
				}, {
					OrderDetailTypeID: '0f66445b815002e320160924132559', 	// Eintrittskarte
					OrderDetailType: 'ticket',								// type
				}, {
					OrderDetailTypeID: '0f66445b815002e320160924132559', 	// Eintrittskarte
					OrderDetailType: 'ticket',								// type
				}, {
					OrderDetailTypeID: '3ff688f42eb7d80720160924132806', 	// Jugendkarte
					OrderDetailType: 'ticket',								// type
					Amount: 4												// optional (if 'Amount' is set this amount of tickets is used OR you can specify one entry for each ticket)
				}, {
					OrderDetailTypeID: '5b8827178719b65020160924133019', 	// Komiteekarte
					OrderDetailType: 'ticket', 							  	// type
					OrderDetailGrossDiscount: 5.12							// if is set => this ticket gets a discount (only available if order is created with 'OrderFrom' = 'intern' AND 'OrderFromUserID' = is NOT NULL else this will be ignored
				}, {
					OrderDetailTypeID: 'ab0ca694294b9d7020160925154908', 	// Tortengarantie
					OrderDetailType: 'special', 								// type
				}, {
					OrderDetailTypeID: 'd703218103f7842a20160924132939',	// Mitarbeiterkarte
					OrderDetailType: 'ticket', 								// type
				}, {
					OrderDetailTypeID: '37b7d8065e5f5d2c20160913133226',	// type id
					OrderDetailType: 'seat', 								// type
				}, {
					OrderDetailTypeID: 'ab0ca694294b9d7020160925154908', 	// type id
					OrderDetailType: 'special', 							// type
					OrderDetailGrossDiscount: 2.00 							// if is set => this ticket gets a discount (only available if order is created with 'OrderFrom' = 'intern' AND 'OrderFromUserID' = is NOT NULL else this will be ignored
				}, {
					OrderDetailTypeID: 'ab0ca694294b9d7020160925154908', 	// type id
					OrderDetailType: 'special',		 						// type
				}, {
					OrderDetailType: 'shippingcost', 						// type
					OrderDetailGrossDiscount: 2.50 							// if is set => this ticket gets a discount (only available if order is created with 'OrderFrom' = 'intern' AND 'OrderFromUserID' = is NOT NULL else this will be ignored
				}, {
					OrderDetailType: 'handlingfee', 						// type
					OrderDetailGrossDiscount: 1.50 							// if is set => this ticket gets a discount (only available if order is created with 'OrderFrom' = 'intern' AND 'OrderFromUserID' = is NOT NULL else this will be ignored
				}

			]

			 */
		}

		console
			.log(req);

		this
			.socketClient
			[0]
			.emit(
				'order-create'
				,
				req
			)
		;
	}
}

const order = new Order();
order.create();
