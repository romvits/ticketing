import Socket from '../../socket';
import _ from 'lodash';

class Index extends Socket {

	constructor(props) {
		super(props);

		this.shoppingCart = {};

		// check results for order
		setTimeout(() => {
			console.log('RESULT CHECK:');
			let sumRegular = 0;
			let sumDiscount = 0;
			let sumGross = 0;
			let sumTax = 0;
			let sumTaxPrice = 0;
			let sumNet = 0;
			_.each(this.shoppingCart.OrderDetail, Detail => {
				sumDiscount += Detail.OrderDetailGrossDiscount * 100;
				sumRegular += Detail.OrderDetailGrossRegular * 100;
				sumGross += Detail.OrderDetailGrossPrice * 100;
				sumNet += Detail.OrderDetailNetPrice * 100;
				sumTax += Detail.OrderDetailTaxPrice * 100;
			});
			_.each(this.shoppingCart.OrderTax, (TaxPrice, TaxPercent) => {
				sumTaxPrice += TaxPrice * 100;
			});
			console.log('Regular', this.shoppingCart.OrderGrossRegular, sumRegular / 100);
			console.log('Discount', this.shoppingCart.OrderGrossDiscount, sumDiscount / 100);
			console.log('Net', this.shoppingCart.OrderNetPrice, sumNet / 100);
			console.log('Tax', this.shoppingCart.OrderTaxPrice, sumTax / 100, sumTaxPrice / 100);
			console.log('Gross', this.shoppingCart.OrderGrossPrice, sumGross / 100);
		}, this.randTimeout() + 8000);

		// ticket (set)
		this.socketClient[0].on('shopping-cart-set-ticket', (res) => {
			console.log(this._splitter);
			console.log('shopping-cart-set-ticket');
			this.shoppingCart = res;
		});
		this.socketClient[0].on('update-ticket', (res) => {
			console.log(this._splitter);
			console.log('update-ticket');
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
			this.shoppingCart = res;
		});
		this.socketClient[0].on('shopping-cart-add-seat-err', (res) => {
			console.log(this._splitter);
			console.log('shopping-cart-add-seat-err');
			console.log(res);
		});
		this.socketClient[0].on('update-seat', (res) => {
			console.log(this._splitter);
			console.log('update-seat');
			console.log(res);
			this.shoppingCart = res;
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

		// set discount
		this.socketClient[0].on('shopping-cart-set-discount', (res) => {
			console.log(this._splitter);
			console.log('shopping-cart-set-discount');
			this.shoppingCart = res;
		});
		this.socketClient[0].on('shopping-cart-set-discount-err', (res) => {
			console.log(this._splitter);
			console.log('shopping-cart-set-discount-err');
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

		// payment
		this.socketClient[0].on('shopping-cart-set-payment', (res) => {
			console.log(this._splitter);
			console.log('shopping-cart-set-payment');
			console.log(res);
		});
		this.socketClient[0].on('shopping-cart-set-payment-err', (res) => {
			console.log(this._splitter);
			console.log('shopping-cart-set-payment-err');
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

		// checkout
		this.socketClient[0].on('shopping-cart-checkout', (res) => {
			console.log(this._splitter);
			console.log('shopping-cart-checkout');
			console.log(res);
			this.shoppingCart = res;
		});
		this.socketClient[0].on('shopping-cart-checkout-err', (res) => {
			console.log(this._splitter);
			console.log('shopping-cart-checkout-err');
			console.log(res);
		});

	}

	setShippingCost(GrossPrice) {
		this.socketClient[0].emit('shopping-cart-shipping-cost', GrossPrice);
	}

	setHandlingFee(GrossPrice) {
		this.socketClient[0].emit('shopping-cart-handling-fee', GrossPrice);
	}

	setTicket(ID = null, Amount = 1) {
		console.log('shopping-cart-set-ticket: ', ID, Amount);
		this.socketClient[0].emit('shopping-cart-set-ticket', {
			ID: ID,
			Amount: Amount
		});
	}

	addSeat(ID = null) {
		console.log('shopping-cart-add-seat', ID);
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

	setUser(UserID) {
		console.log('shopping-cart-set-user', UserID);
		this.socketClient[0].emit('shopping-cart-set-user', UserID);
	}

	setPayment(Payment) {
		this.socketClient[0].emit('shopping-cart-set-payment', Payment);
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

module.exports = Index;
