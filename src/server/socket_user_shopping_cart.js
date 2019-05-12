import Helpers from './helpers';
import mpay24 from 'mpay24-node';
import randtoken from "rand-token";
import UserShoppingCart from './modules/user/shopping_cart';

/**
 * shopping cart
 * @public
 * @class
 * @memberof Socket
 * @example
 * // global events if a shopping cart event is triggered<br>
 * // if some of this events fires => update on frontend is necessary (eg update amount of available tickets or block/release seats)
 * socket.on('shopping-cart-update-event', (res)=>{console.log(res);}); // returns => { EventAvailableVisitors: 123 }
 * socket.on('shopping-cart-update-ticket', (res)=>{console.log(res);}); // returns => { TicketID: 'TicketID', TicketType: 'ticket', TicketAvailable: 24 }
 * socket.on('shopping-cart-update-seat', (res)=>{console.log(res);}); // returns => { SeatID: 'SeatID', SeatState: 'blocked' } or { SeatID: 'SeatID', SeatState: 'free' }
 */
class SocketShoppingCart extends Helpers {

	/**
	 * constructor for list socket events<br>
	 * @param client {Object} socket.io connection object
	 */
	constructor(client) {
		super();
		this._client = client;
		this.onSetUser();
		this.onSetTicket();
		this.onAddSeat();
		this.onAddSpecialOffer();
		this.onSetDiscount();
		this.onSetUser();
		this.onSetPayment();
		this.onDel();
		this.onEmpty();
		this.onCheckout();
		this.onMpay24Seamless();
		this.onPayIntern();
	}

	/**
	 * set user for internal connections ('admin' or 'promoter' is logged in)
	 * @example
	 * socket.on('shopping-cart-set-user', (res)=>{console.log(res);});
	 * socket.on('shopping-cart-set-user-err', (err)=>{console.log(err);});
	 * socket.emit('shopping-cart-set-user', UserID); // UserID is one id from database table 'User'
	 */
	onSetUser() {
		const evt = 'shopping-cart-set-user';
		this._client.on(evt, UserID => {
			if (this._client.userdata.User) {
				const shoppingCart = new UserShoppingCart(this._client.id);
				shoppingCart.setUser(req).then(res => {
					this.logSocketMessage(this._client.id, evt, req);
					this._client.emit(evt, res);
				}).catch(err => {
					this._client.emit(evt + '-err', err);
					this.logSocketError(this._client.id, evt + '-err', err);
				});
			} else {
				let err = 'user not logged in';
				this._client.emit(evt + '-err', err);
				this.logSocketError(this._client.id, evt + '-err', err);
			}
		});
	}

	/**
	 * set ticket
	 * @example
	 * socket.on('shopping-cart-set-ticket', (res)=>{console.log(res);});
	 * socket.on('shopping-cart-set-ticket-err', (err)=>{console.log(err);});
	 * socket.emit('shopping-cart-set-ticket', {
	 * 	ID: TicketID
	 * 	Amount: 4
	 * });
	 */
	onSetTicket() {
		const evt = 'shopping-cart-set-ticket';
		this._client.on(evt, req => {
			const shoppingCart = new UserShoppingCart(this._client.id);
			shoppingCart.setTicket(req).then(res => {
				this.logSocketMessage(this._client.id, evt, req);
				this._client.emit(evt, res);
			}).catch(err => {
				this._client.emit(evt + '-err', err);
				this.logSocketError(this._client.id, evt + '-err', err);
			});
		});
	}

	/**
	 * add seat
	 * @example
	 * socket.on('shopping-cart-set-seat', (res)=>{console.log(res);});
	 * socket.on('shopping-cart-set-seat-err', (err)=>{console.log(err);});
	 * socket.emit('shopping-cart-set-seat', SeatID);
	 */
	onAddSeat() {
		const evt = 'shopping-cart-set-seat';
		this._client.on(evt, req => {
			const shoppingCart = new UserShoppingCart(this._client.id);
			shoppingCart.setSeat(req).then(res => {
				this.logSocketMessage(this._client.id, evt, req);
				this._client.emit(evt, res);
			}).catch(err => {
				this._client.emit(evt + '-err', err);
				this.logSocketError(this._client.id, evt + '-err', err);
			});
		});
	}

	/**
	 * add special
	 * @example
	 * socket.on('shopping-cart-add-special', (res)=>{console.log(res);});
	 * socket.on('shopping-cart-add-special-err', (err)=>{console.log(err);});
	 * socket.emit('shopping-cart-add-special', {
	 * 	ID: SpecialOfferID
	 * 	Code: Code			// Code is used if the special offer is user related and can only be used one time
	 * });
	 */
	onAddSpecialOffer() {
		const evt = 'shopping-cart-add-special-offer';
		this._client.on(evt, req => {
			const shoppingCart = new UserShoppingCart(this._client.id);
			shoppingCart.addSpecialOffer(req).then(res => {
				this.logSocketMessage(this._client.id, evt, req);
				this._client.emit(evt, res);
			}).catch(err => {
				this._client.emit(evt + '-err', err);
				this.logSocketError(this._client.id, evt + '-err', err);
			});
		});
	}

	/**
	 * set discount
	 * @example
	 * socket.on('shopping-cart-set-discount', (res)=>{console.log(res);});
	 * socket.on('shopping-cart-set-discount-err', (err)=>{console.log(err);});
	 * socket.emit('shopping-cart-set-discount', {
	 *     ID: 'ShoppingCartDetailID',
	 *     Discount: 1.23
	 * });
	 */
	onSetDiscount() {
		const evt = 'shopping-cart-set-discount';
		this._client.on(evt, req => {
			if (this._client.userdata.intern && this._client.userdata.User.UserType && this._client.userdata.Event) {
				const shoppingCart = new UserShoppingCart(this._client.id);
				shoppingCart.setDiscount(req).then(res => {
					this.logSocketMessage(this._client.id, evt, req);
					this._client.emit(evt, res);
				}).catch(err => {
					this._client.emit(evt + '-err', err);
					this.logSocketError(this._client.id, evt + '-err', err);
				});
			} else {
				this.logSocketError(this._client.id, evt, 'user no admin or no event selected?');
				this.logSocketError(this._client.id, evt, this._client.userdata.User);
				this.logSocketError(this._client.id, evt, this._client.userdata.Event);
			}
		});
	}

	/**
	 * set user
	 * @example
	 * socket.on('shopping-cart-set-user', (res)=>{console.log(res);});
	 * socket.on('shopping-cart-set-user-err', (err)=>{console.log(err);});
	 * socket.emit('shopping-cart-set-user', UserID);
	 */
	onSetUser() {
		const evt = 'shopping-cart-set-user';
		this._client.on(evt, req => {
			const shoppingCart = new UserShoppingCart(this._client.id);
			shoppingCart.setUser(req).then(res => {
				this.logSocketMessage(this._client.id, evt, req);
				this._client.emit(evt, res);
			}).catch(err => {
				this._client.emit(evt + '-err', err);
				this.logSocketError(this._client.id, evt + '-err', err);
			});
		});
	}

	/**
	 * set payment
	 * @example
	 * socket.on('shopping-cart-set-payment', (res)=>{console.log(res);});
	 * socket.on('shopping-cart-set-payment-err', (err)=>{console.log(err);});
	 * socket.emit('shopping-cart-set-payment', 'mpay'); // 'cash' || 'mpay' || 'paypal' || 'transfer'
	 */
	onSetPayment() {
		const evt = 'shopping-cart-set-payment';
		this._client.on(evt, req => {
			const shoppingCart = new UserShoppingCart(this._client.id);
			shoppingCart.setPayment(req).then(res => {
				this.logSocketMessage(this._client.id, evt, req);
				this._client.emit(evt, res);
			}).catch(err => {
				this._client.emit(evt + '-err', err);
				this.logSocketError(this._client.id, evt + '-err', err);
			});
		});
	}


	/**
	 * del
	 * @example
	 * socket.on('shopping-cart-del', (res)=>{console.log(res);});
	 * socket.on('shopping-cart-del-err', (err)=>{console.log(err);});
	 * socket.emit('shopping-cart-del', DetailID);
	 */
	onDel() {
		const evt = 'shopping-cart-del';
		this._client.on(evt, req => {
			const shoppingCart = new UserShoppingCart(this._client.id);
			shoppingCart.del(req).then(res => {
				this.logSocketMessage(this._client.id, evt, req);
				this._client.emit(evt, res);
			}).catch(err => {
				this._client.emit(evt + '-err', err);
				this.logSocketError(this._client.id, evt + '-err', err);
			});
		});
	}

	/**
	 * empty
	 * @example
	 * socket.on('shopping-cart-empty', (res)=>{console.log(res);});
	 * socket.emit('shopping-cart-empty');
	 */
	onEmpty() {
		const evt = 'shopping-cart-empty';
		this._client.on(evt, req => {
			const shoppingCart = new UserShoppingCart(this._client.id);
			shoppingCart.empty().then(res => {
				this.logSocketMessage(this._client.id, evt, req);
				this._client.emit(evt, res);
			}).catch(err => {
				this._client.emit(evt + '-err', err);
				this.logSocketError(this._client.id, evt + '-err', err);
			});
		});
	}

	/**
	 * checkout
	 * @example
	 * socket.on('shopping-cart-checkout', (res)=>{console.log(res);});
	 * socket.on('shopping-cart-checkout-err', (err)=>{console.log(err);});
	 * socket.emit('shopping-cart-checkout');
	 */
	onCheckout() {
		const evt = 'shopping-cart-checkout';
		this._client.on(evt, req => {
			this.logSocketMessage(this._client.id, evt, req);
			this._client.emit(evt, this._client.userdata.ShoppingCart);
		});
	}

	/**
	 * mpay24 system ONLY CREDIT CARD (seamless integration)<br>
	 * seamless payment:<br>
	 * https://docs.mpay24.com/docs/get-started
	 * @example
	 * // init mpay payment system
	 * socket.on('shopping-cart-mpay24-seamless-init', (res)=>{console.log(res);});        // returns URL for iframe payment system
	 * socket.on('shopping-cart-mpay24-seamless-init-err', (err)=>{console.log(err);});
	 * socket.emit('shopping-cart-mpay24-seamless-init', {
	 * 	acceptGTC: true															// accept standard business terms (german = AGB)
	 * });
	 *
	 * // pay mpay payment system
	 * socket.on('shopping-cart-mpay24-seamless-pay', (res)=>{console.log(res);});
	 * socket.on('shopping-cart-mpay24-seamless-pay-err', (err)=>{console.log(err);});
	 * socket.emit('shopping-cart-mpay24-seamless-pay');
	 */
	onMpay24Seamless() {
		const evtInit = 'shopping-cart-mpay24-init';
		this._client.on(evtInit, req => {
			this._client.userdata.ShoppingCart.OrderAcceptGTC = (this._userdata.intern) ? 1 : (req.acceptGTC) ? 1 : 0;
			if (req.acceptGTC) {
				mpay24.init('91098', 'Toy@+3yE3z', 'TEST').then(res => {
					mpay24.createPaymentToken({
						pType: 'CC',
						templateSet: 'DEFAULT',
					}).then(result => {
						this.logSocketMessage(this._client.id, evtInit, req);
						this._client.userdata.ShoppingCart.mpayToken = result;
						this._client.emit(evtInit, result);
					}).catch(err => {
						console.trace(err);
						reject(err);
					});

				});
			} else {

			}
		});

		const evtPay = 'shopping-cart-mpay24-pay';
		this._client.on(evtPay, req => {
			mpay24.init('91098', 'Toy@+3yE3z', 'TEST').then(res => {
				let OrderNumberText = 'ZBB20-123456';
				let tid = OrderNumberText.replace(/-/g, '');
				const payReq = {
					tid: tid,
					pType: 'TOKEN',
					payment: {
						amount: 100,
						currency: 'EUR',
						token: this._client.userdata.ShoppingCart.mpayToken,
					}
				};
				mpay24.acceptPayment(payReq).then(function(result) {
					resolve({payReq: payReq, result: result});
				}).catch(err => {
					console.log(err);
					console.trace(err);
					reject(err);
				});
			});

		});
	}

	/**
	 * check payment type and resolve payment
	 * @example
	 * socket.on('shopping-cart-pay-intern', (res)=>{console.log(res);});
	 * socket.on('shopping-cart-pay-intern-err', (err)=>{console.log(err);});
	 * socket.emit('shopping-cart-pay-intern');
	 */
	onPayIntern() {
		const evt = 'shopping-cart-pay-intern';
		this._client.on(evt, req => {
			this._client.userdata.ShoppingCart.OrderAcceptGTC = 1;
			const shoppingCart = new UserShoppingCart(this._client.id);
			shoppingCart.save().then(() => {
				this.logSocketMessage(this._client.id, req);
				this._client.emit(evt, true);
			}).catch(err => {
				this._client.emit(evt + '-err', err);
				this.logSocketError(this._client.id, evt + '-err', err);
			});
		});
	}

}

module.exports = SocketShoppingCart;
