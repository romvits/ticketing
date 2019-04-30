import Socket from '../../socket';
import _ from 'lodash';
import sha256 from 'sha256';
import md5 from 'md5';

function cryptPassword(UserPassword) {
	return (md5(sha256(UserPassword)));
}


// not used but could be in future :)
let data = {
	User: {
		eMail:'',
		PW: ''
	},
	EventSubdomain: 'demo01',
	Ticket1ID: '01',
	Ticket2ID: null,
	SpecialTicket1ID: '04',
	Seat1ID: '101',
	Seat2ID: '103',
}

data = {
	User: {
		eMail:'',
		PW: ''
	},
	EventSubdomain: 'ZBB18',
	Ticket1ID: '8132d4bd9e45413120170910224129',
	Ticket2ID: '2057df901f6223b420170910224052',
	SpecialTicket1ID: 'f4305c8d20e69ee920170910232852',
	Seat1ID: '20c7ae38d114e72020170806093326',
	Seat2ID: '3832b0d8df5ebcf120170806093326',
}


class ShoppingCart extends Socket {

	constructor(props) {
		super();

		const runtime = 15000; // 60000
		setTimeout(() => {
			process.exit(0);
		}, runtime);
		console.log('test runtime ' + runtime);

		this.shoppingCart = [];

		this.socketClient[0].on('user-login', (res) => {
			console.log(this._splitter);
			console.log('user-login');
			console.log(res);

			//this.socketClient[0].emit('set-event', 'demoerr');

			setTimeout(() => {
				this.socketClient[0].emit('set-event', data.EventSubdomain);
			}, 200);

			setTimeout(() => {
				this.socketClient[0].emit('user-logout');
			}, runtime - 500);

		});

		this.socketClient[0].on('set-event', (res) => {
			console.log(this._splitter);
			console.log('set-event');
			console.log(res);

			if (res) {

				// set ticket
				setTimeout(() => {
					this.setTicket(data.Ticket1ID, 4);
				}, this.randTimeout() + 300);

				// set special ticket
				setTimeout(() => {
					this.setTicket(data.SpecialTicket1ID, 2);
				}, this.randTimeout() + 450);

				// add seat
				setTimeout(() => {
					//this.addSeat(data.Seat1ID);
					//this.addSeat(data.Seat2ID);
				}, this.randTimeout() + 2000);

				setTimeout(() => {
					this.checkout();
				}, this.randTimeout() + 5000);


				//setTimeout(() => {
				//	this.empty();
				//}, this.randTimeout() + 5000);

			}
		});

		// ticket (set)
		this.socketClient[0].on('shopping-cart-set-ticket', (res) => {
			console.log(this._splitter);
			console.log('shopping-cart-set-ticket');
			console.log(res);
			this.shoppingCart = res;
		});
		this.socketClient[0].on('shopping-cart-set-ticket-err', (res) => {
			console.log(this._splitter);
			console.log('shopping-cart-set-ticket-err');
			console.log(res);
		});

		// seat
		this.socketClient[0].on('shopping-cart-add-seat', (res) => {
			console.log(this._splitter);
			console.log('shopping-cart-add-seat');
			console.log(res);
			this.shoppingCart = res;
		});
		this.socketClient[0].on('shopping-cart-add-seat-err', (res) => {
			console.log(this._splitter);
			console.log('shopping-cart-add-seat-err');
			console.log(res);
		});

		// speacial
		this.socketClient[0].on('shopping-cart-add-special-offer', (res) => {
			console.log(this._splitter);
			console.log('shopping-cart-add-special-offer');
			console.log(res);
			this.shoppingCart = res;
		});
		this.socketClient[0].on('shopping-cart-add-special-offer-err', (res) => {
			console.log(this._splitter);
			console.log('shopping-cart-add-special-offer-err');
			console.log(res);
		});


		// DELETE
		this.socketClient[0].on('shopping-cart-del', (res) => {
			console.log(this._splitter);
			console.log('shopping-cart-del');
			console.log(res);
			this.shoppingCart = res;
		});
		this.socketClient[0].on('shopping-cart-del-err', (res) => {
			console.log(this._splitter);
			console.log('shopping-cart-del-err');
			console.log(res);
		});

		// shipping cost
		this.socketClient[0].on('shopping-cart-shipping-cost', (res) => {
			console.log(this._splitter);
			console.log('shopping-cart-shipping-cost');
			console.log(res);
			this.shoppingCart = res;
		});
		this.socketClient[0].on('shopping-cart-shipping-cost-err', (res) => {
			console.log(this._splitter);
			console.log('shopping-cart-shipping-cost-err');
			console.log(res);
		});

		// handling fee
		this.socketClient[0].on('shopping-cart-handling-fee', (res) => {
			console.log(this._splitter);
			console.log('shopping-cart-handling-fee');
			console.log(res);
			this.shoppingCart = res;
		});
		this.socketClient[0].on('shopping-cart-handling-fee-err', (res) => {
			console.log(this._splitter);
			console.log('shopping-cart-handling-fee-err');
			console.log(res);
		});

		// handling fee
		this.socketClient[0].on('shopping-cart-empty', (res) => {
			console.log(this._splitter);
			console.log('shopping-cart-empty');
			console.log(res);
			this.shoppingCart = res;
		});
		this.socketClient[0].on('shopping-cart-empty-err', (res) => {
			console.log(this._splitter);
			console.log('shopping-cart-empty-err');
			console.log(res);
		});

	}

	login() {
		const req = {'UserEmail': 'customer@domain.tld', 'UserPassword': cryptPassword('admin')};
		this.socketClient[0].emit('user-login', req);
	}

	/*
	let req = _.extend(this.Order, {

		OrderDetail: [
			{OrderDetailType: 'ticket', OrderDetailTypeID: data.Ticket1ID, Amount: 4},
			{OrderDetailType: 'special', OrderDetailTypeID: '04'},
			{OrderDetailType: 'special', OrderDetailTypeID: '04', OrderDetailGrossDiscount: 5},
			//{OrderDetailType: 'ticket', OrderDetailTypeID: 'NOT_VALID', Amount: 2},
			{OrderDetailType: 'ticket', OrderDetailTypeID: '02', Amount: 2},
			{OrderDetailType: 'seat', OrderDetailTypeID: '101', OrderDetailGrossDiscount: 4.32},
			{OrderDetailType: 'seat', OrderDetailTypeID: '102'},
			{OrderDetailType: 'seat', OrderDetailTypeID: '103', OrderDetailGrossDiscount: 24.11},
			{OrderDetailType: 'seat', OrderDetailTypeID: '104'},
			{OrderDetailType: 'shippingcost', OrderDetailGrossPrice: 1.44}, // can be set directly => if 'OrderDetailGross' is not set default value from event is used (only internal orders)
			{OrderDetailType: 'handlingfee', OrderDetailGrossPrice: 12.44, OrderDetailGrossDiscount: 1.52} // can be set a discount (only internal orders) EventHandlingFeeGrossInternal
		]
	});
	*/

	setShippingCost(GrossPrice) {
		this.socketClient[0].emit('shopping-cart-shipping-cost', GrossPrice);
	}

	setHandlingFee(GrossPrice) {
		this.socketClient[0].emit('shopping-cart-handling-fee', GrossPrice);
	}

	setTicket(ID = null, Amount = 1) {
		this.socketClient[0].emit('shopping-cart-set-ticket', {
			ID: ID,
			Ammount: Amount
		});
	}

	addSeat(ID = null) {
		this.socketClient[0].emit('shopping-cart-add-seat', ID);
	}

	addSpecialOffer(ID = null, Code = null) {
		this.socketClient[0].emit('shopping-cart-add-special-offer', {
			ID: ID,
			Code: Code
		});
	}

	setDiscount(DetailID, Discount) {
		this.socketClient[0].emit('shopping-cart-set-discount', {
			ID: DetailID,
			Discount: Discount
		});
	}

	del(DetailID) {
		this.socketClient[0].emit('shopping-cart-del', DetailID);
	}

	empty() {
		this.socketClient[0].emit('shopping-cart-empty');
	}

	checkout() {
		this.socketClient[0].emit('shopping-cart-checkout');
	}


}

const order = new ShoppingCart();
order.login();
