import Socket from '../../socket';
import _ from 'lodash';
import sha256 from 'sha256';
import md5 from 'md5';

function cryptPassword(UserPassword) {
	return (md5(sha256(UserPassword)));
}

class ShoppingCart extends Socket {

	constructor(props) {
		super();

		const runtime = 10000; // 60000
		setTimeout(() => {
			process.exit(0);
		}, runtime);
		console.log('test runtime ' + runtime);

		this.shoppingCart = [];

		this.socketClient[0].on('user-login', (res) => {
			console.log(this._splitter);
			console.log('user-login');
			console.log(res);

			this.socketClient[0].emit('set-event', 'demo01');

		});

		this.socketClient[0].on('set-event', (res) => {
			console.log(this._splitter);
			console.log('set-event');
			console.log(res);

			// set ticket
			setTimeout(() => {
				this.setTicket('01', 4);
			}, this.randTimeout() + 250);

			// set special
			setTimeout(() => {
				this.setTicket('04', 2);
			}, this.randTimeout() + 500);

			setTimeout(() => {
				this.addTicket('02', 2, 1.23);
			}, this.randTimeout() + 1000);

			// add seat
			setTimeout(() => {
				this.addSeat('101');
				this.addSeat('103');
			}, this.randTimeout() + 2000);

			setTimeout(() => {
				this.checkout();
			}, this.randTimeout() + 5000);


			//setTimeout(() => {
			//	this.empty();
			//}, this.randTimeout() + 5000);


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

		// ticket (add) => should only be possible by an admin or promoter
		this.socketClient[0].on('shopping-cart-add-ticket', (res) => {
			console.log(this._splitter);
			console.log('shopping-cart-add-ticket');
			console.log(res);
			this.shoppingCart = res;
		});
		this.socketClient[0].on('shopping-cart-add-ticket-err', (res) => {
			console.log(this._splitter);
			console.log('shopping-cart-add-ticket-err');
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
		this.socketClient[0].on('shopping-cart-add-special', (res) => {
			console.log(this._splitter);
			console.log('shopping-cart-add-special');
			console.log(res);
			this.shoppingCart = res;
		});
		this.socketClient[0].on('shopping-cart-add-special-err', (res) => {
			console.log(this._splitter);
			console.log('shopping-cart-add-special-err');
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
			{OrderDetailType: 'ticket', OrderDetailTypeID: '01', Amount: 4},
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

	addTicket(ID = null, Amount = 1, Discount = 0.00) { // should only be possible by admin or promoter
		this.socketClient[0].emit('shopping-cart-add-ticket', {
			ID: ID,
			Ammount: Amount,
			Discount: Discount
		});
	}

	addSeat(ID = null) {
		this.socketClient[0].emit('shopping-cart-add-seat', ID);
	}

	addSpecial(ID = null, Code = null) {
		this.socketClient[0].emit('shopping-cart-add-special', {
			ID: ID,
			Code: Code
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
