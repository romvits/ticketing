import Socket from '../../socket';
import _ from 'lodash';

class Index extends Socket {

	constructor(props) {
		super(props);

		this.shoppingCart = {};

		this.data = {
			AdminUser: {
				eMail: 'admin@admin.tld',
				PW: 'admin'
			},
			CustomerUser: {
				ID: '02',
				eMail: 'customer@domain.tld',
				PW: 'admin'
			},
			EventSubdomain: 'demo01',
			Ticket1ID: '01',
			Ticket2ID: null,
			SpecialTicket1ID: '04',
			Seat1ID: '101',
			Seat2ID: '102',
			Seat3ID: '103',
			Seat4ID: '104',
		}

		if (1 == 2) {
			this.data = {
				AdminUser: {
					eMail: 'admin@admin.tld',
					PW: 'admin'
				},
				CustomerUser: {
					ID: '02',
					eMail: 'customer@domain.tld',
					PW: 'admin'
				},
				EventSubdomain: 'ZBB18',
				Ticket1ID: '8132d4bd9e45413120170910224129',
				Ticket2ID: '2057df901f6223b420170910224052',
				SpecialTicket1ID: 'f4305c8d20e69ee920170910232852',
				Seat1ID: '20c7ae38d114e72020170806093326',
				Seat2ID: '3832b0d8df5ebcf120170806093326',
				Seat3ID: '00cc2f7d9494476120170806093326',
				Seat4ID: '00bf22a67814ea3f20170806093326'
			}
		}

		// check results for order
		setTimeout(() => {
			let sumRegular = 0;
			let sumDiscount = 0;
			let sumGross = 0;
			let sumTax = 0;
			let sumTaxPrice = 0;
			let sumNet = 0;
			_.each(this.shoppingCart.OrderDetail, Detail => {
				sumDiscount += Math.round(Detail.data.OrderDetailGrossDiscount * 100);
				sumRegular += Math.round(Detail.data.OrderDetailGrossRegular * 100);
				sumGross += Math.round(Detail.data.OrderDetailGrossPrice * 100);
				sumNet += Math.round(Detail.data.OrderDetailNetPrice * 100);
				sumTax += Math.round(Detail.data.OrderDetailTaxPrice * 100);
			});
			_.each(this.shoppingCart.OrderTax, (TaxPrice, TaxPercent) => {
				sumTaxPrice += TaxPrice * 100;
			});
			console.log(this._splitter);
			console.log('RESULT:');
			console.log('Regular  =>', this.shoppingCart.data.OrderGrossRegular, sumRegular / 100);
			console.log('Discount =>', this.shoppingCart.data.OrderGrossDiscount, sumDiscount / 100);
			console.log('Net      =>', this.shoppingCart.data.OrderNetPrice, sumNet / 100);
			console.log('Tax      =>', this.shoppingCart.data.OrderTaxPrice, sumTax / 100, sumTaxPrice / 100);
			console.log('Gross    =>', this.shoppingCart.data.OrderGrossPrice, sumGross / 100);
		}, this.randTimeout() + 7500);

		// ticket (set)
		this.socketClient[0].on('shopping-cart-set-ticket', (res) => {
			this.shoppingCart = res;
			console.log(this._splitter);
			console.log('shopping-cart-set-ticket');
			let ticket = _.filter(this.shoppingCart.OrderDetail, {OrderDetailType: 'ticket'});
			_.each(ticket, ticket => {
				//console.log(ticket.OrderDetailTypeID);
			});
			let special = _.filter(this.shoppingCart.OrderDetail, {OrderDetailType: 'special'});
			_.each(special, special => {
				//console.log(special.OrderDetailTypeID);
			});
		});
		this.socketClient[0].on('shopping-cart-update-ticket', (res) => {
			console.log(this._splitter);
			console.log('shopping-cart-update-ticket');
			console.log(res);
			this.shoppingCart = res;
		});
		this.socketClient[0].on('shopping-cart-set-ticket-err', (res) => {
			console.log(this._splitter);
			console.log('shopping-cart-set-ticket-err');
			console.log(res);
		});

		// seat
		this.socketClient[0].on('shopping-cart-set-seat', (res) => {
			console.log(this._splitter);
			console.log('shopping-cart-set-seat');
			this.shoppingCart = res;
		});
		this.socketClient[0].on('shopping-cart-set-seat-err', (res) => {
			console.log(this._splitter);
			console.log('shopping-cart-set-seat-err');
			console.log(res);
		});
		this.socketClient[0].on('shopping-cart-update-seat', (res) => {
			console.log(this._splitter);
			console.log('shopping-cart-update-seat');
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
			this.shoppingCart = res;
		});
		this.socketClient[0].on('shopping-cart-checkout-err', (res) => {
			console.log(this._splitter);
			console.log('shopping-cart-checkout-err');
			console.log(res);
		});

		// pay
		this.socketClient[0].on('shopping-cart-pay-intern', (res) => {
			console.log(this._splitter);
			console.log('shopping-cart-pay-intern');
			console.log(res);
		});
		this.socketClient[0].on('shopping-cart-pay-intern-err', (res) => {
			console.log(this._splitter);
			console.log('shopping-cart-pay-intern-err');
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

	setSeat(ID = null) {
		console.log('shopping-cart-set-seat', ID);
		this.socketClient[0].emit('shopping-cart-set-seat', ID);
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

	payIntern() {
		this.socketClient[0].emit('shopping-cart-pay-intern');
	}

}

module.exports = Index;
