import Helpers from './helpers';
import Order from './modules/order/order'
import mpay24 from 'mpay24-node';

/**
 * order
 * @public
 * @class
 * @memberof Socket
 * @example
 * // global events if a shopping cart event is triggered<br>
 * // if some of this events fires => update on frontend is necessary (eg update amount of available tickets or block/release seats)
 * socket.on('order-update-event', (res)=>{console.log(res);}); // returns => { EventAvailableVisitors: 123 }
 * socket.on('order-update-ticket', (res)=>{console.log(res);}); // returns => { TicketID: 'TicketID', TicketType: 'ticket', TicketAvailable: 24 }
 * socket.on('order-update-seat', (res)=>{console.log(res);}); // returns => { SeatID: 'SeatID', SeatState: 'blocked' } or { SeatID: 'SeatID', SeatState: 'free' }
 */
class SocketOrder extends Helpers {

	/**
	 * constructor for list socket events<br>
	 * @param client {Object} socket.io connection object
	 */
	constructor(client) {
		super();
		this._client = client;
		this.onSave();
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
		this.onUpdate();
		this.onChancelItem();
		this.onFetchOrder();
		this.onFetchAll();
	}

	/**
	 * save actual shopping cart to order tables
	 * @example
	 * socket.on('order-save', (res)=>{console.log(res);});
	 * socket.on('order-save-err', (err)=>{console.log(err);});
	 * socket.emit('order-save');
	 * @param client {Object} socket.io connection object
	 */
	onSave(client) {
		const evt = 'order-save';
		this._client.on(evt, (req) => {
			const order = new Order(this._client.id);
			order.create(req).then((res) => {
				this.logSocketMessage(this._client.id, evt, req);
				this._client.emit(evt, res);
			}).catch((err) => {
				this._client.emit(evt + '-err', err);
				this.logSocketError(this._client.id, evt, err);
			});
		});
	}

	/**
	 * set user for internal connections ('admin' or 'promoter' is logged in)
	 * @example
	 * socket.on('order-set-user', (res)=>{console.log(res);});
	 * socket.on('order-set-user-err', (err)=>{console.log(err);});
	 * socket.emit('order-set-user', UserID); // UserID is one id from database table 'User'
	 */
	onSetUser() {
		const evt = 'order-set-user';
		this._client.on(evt, UserID => {
			if (this._client.userdata.User) {
				const order = new Order(this._client.id);
				order.setUser(req).then(res => {
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
	 * socket.on('order-set-ticket', (res)=>{console.log(res);});
	 * socket.on('order-set-ticket-err', (err)=>{console.log(err);});
	 * socket.emit('order-set-ticket', {
	 * 	ID: TicketID
	 * 	Amount: 4
	 * });
	 */
	onSetTicket() {
		const evt = 'order-set-ticket';
		this._client.on(evt, req => {
			const order = new Order(this._client.id);
			order.setTicket(req).then(res => {
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
	 * socket.on('order-set-seat', (res)=>{console.log(res);});
	 * socket.on('order-set-seat-err', (err)=>{console.log(err);});
	 * socket.emit('order-set-seat', SeatID);
	 */
	onAddSeat() {
		const evt = 'order-set-seat';
		this._client.on(evt, req => {
			const order = new Order(this._client.id);
			order.setSeat(req).then(res => {
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
	 * socket.on('order-add-special', (res)=>{console.log(res);});
	 * socket.on('order-add-special-err', (err)=>{console.log(err);});
	 * socket.emit('order-add-special', {
	 * 	ID: SpecialOfferID
	 * 	Code: Code			// Code is used if the special offer is user related and can only be used one time
	 * });
	 */
	onAddSpecialOffer() {
		const evt = 'order-add-special-offer';
		this._client.on(evt, req => {
			const order = new Order(this._client.id);
			order.addSpecialOffer(req).then(res => {
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
	 * socket.on('order-set-discount', (res)=>{console.log(res);});
	 * socket.on('order-set-discount-err', (err)=>{console.log(err);});
	 * socket.emit('order-set-discount', {
	 *     ID: 'ShoppingCartDetailID',
	 *     Discount: 1.23
	 * });
	 */
	onSetDiscount() {
		const evt = 'order-set-discount';
		this._client.on(evt, req => {
			if (this._client.userdata.intern && this._client.userdata.User.UserType && this._client.userdata.Event) {
				const order = new Order(this._client.id);
				order.setDiscount(req).then(res => {
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
	 * socket.on('order-set-user', (res)=>{console.log(res);});
	 * socket.on('order-set-user-err', (err)=>{console.log(err);});
	 * socket.emit('order-set-user', UserID);
	 */
	onSetUser() {
		const evt = 'order-set-user';
		this._client.on(evt, req => {
			const order = new Order(this._client.id);
			order.setUser(req).then(res => {
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
	 * socket.on('order-set-payment', (res)=>{console.log(res);});
	 * socket.on('order-set-payment-err', (err)=>{console.log(err);});
	 * socket.emit('order-set-payment', 'mpay'); // 'cash' || 'mpay' || 'paypal' || 'transfer'
	 */
	onSetPayment() {
		const evt = 'order-set-payment';
		this._client.on(evt, OrderPayment => {
			const order = new Order(this._client.id);
			order.setPayment(OrderPayment).then(res => {
				this.logSocketMessage(this._client.id, evt, OrderPayment);
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
	 * socket.on('order-del', (res)=>{console.log(res);});
	 * socket.on('order-del-err', (err)=>{console.log(err);});
	 * socket.emit('order-del', DetailID);
	 */
	onDel() {
		const evt = 'order-del';
		this._client.on(evt, req => {
			const order = new Order(this._client.id);
			order.del(req).then(res => {
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
	 * socket.on('order-empty', (res)=>{console.log(res);});
	 * socket.emit('order-empty');
	 */
	onEmpty() {
		const evt = 'order-empty';
		this._client.on(evt, req => {
			const order = new Order(this._client.id);
			order.empty().then(res => {
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
	 * socket.on('order-checkout', (res)=>{console.log(res);});
	 * socket.on('order-checkout-err', (err)=>{console.log(err);});
	 * socket.emit('order-checkout');
	 */
	onCheckout() {
		const evt = 'order-checkout';
		this._client.on(evt, req => {
			this.logSocketMessage(this._client.id, evt, req);
			this._client.emit(evt, this._client.userdata.Order);
		});
	}

	/**
	 * check payment type and resolve payment
	 * @example
	 * socket.on('order-pay-intern', (res)=>{console.log(res);});
	 * socket.on('order-pay-intern-err', (err)=>{console.log(err);});
	 * socket.emit('order-pay-intern', {'OrderPayment':'transfer || cash'});
	 */
	onPayIntern() {
		const evt = 'order-pay-intern';
		this._client.on(evt, req => {
			this._client.userdata.Order.OrderAcceptGTC = 1;
			if (req.OrderPayment) {
				this._client.userdata.Order.OrderPayment = req.OrderPayment;
			}
			if (this._client.userdata.Order.OrderPayment === 'cash') {
				this._client.userdata.Order.OrderPayedDateTimeUTC = this.getDateTime();
			}
			const order = new Order(this._client.id);
			order.save().then((OrderID) => {
				return order.createPDFs(OrderID);
			}).then(() => {
				this.logSocketMessage(this._client.id, evt);
				this._client.emit(evt, true);
			}).catch(err => {
				this._client.emit(evt + '-err', err);
				this.logSocketError(this._client.id, evt + '-err', err);
			});
		});
	}

	/**
	 * mpay24 system ONLY CREDIT CARD (seamless integration)<br>
	 * seamless payment:<br>
	 * https://docs.mpay24.com/docs/get-started
	 * @example
	 * // init mpay payment system
	 * socket.on('order-mpay24-seamless-init', (res)=>{console.log(res);});        // returns URL for iframe payment system
	 * socket.on('order-mpay24-seamless-init-err', (err)=>{console.log(err);});
	 * socket.emit('order-mpay24-seamless-init', {
	 * 	acceptGTC: true															// accept standard business terms (german = AGB)
	 * });
	 *
	 * // pay mpay payment system
	 * socket.on('order-mpay24-seamless-pay', (res)=>{console.log(res);});
	 * socket.on('order-mpay24-seamless-pay-err', (err)=>{console.log(err);});
	 * socket.emit('order-mpay24-seamless-pay');
	 */
	onMpay24Seamless() {
		const evtInit = 'order-mpay24-init';
		this._client.on(evtInit, req => {
			this._client.userdata.Order.OrderAcceptGTC = (this._userdata.intern) ? 1 : (req.acceptGTC) ? 1 : 0;
			if (req.acceptGTC) {
				mpay24.init('91098', 'Toy@+3yE3z', 'TEST').then(res => {
					mpay24.createPaymentToken({
						pType: 'CC',
						templateSet: 'DEFAULT',
					}).then(result => {
						this.logSocketMessage(this._client.id, evtInit, req);
						this._client.userdata.Order.mpayToken = result;
						this._client.emit(evtInit, result);
					}).catch(err => {
						console.trace(err);
						reject(err);
					});

				});
			} else {

			}
		});

		const evtPay = 'order-mpay24-pay';
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
						token: this._client.userdata.Order.mpayToken,
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
	 * update existing order
	 * @example
	 * socket.on('order-update', (res)=>{console.log(res);});
	 * socket.on('order-update-err', (err)=>{console.log(err);});
	 * socket.emit('order-update', {
	 *	'OrderID': null,
	 *	'OrderTableID': 'TableID | null', // null can be for location without table like cinema
	 *	'OrderNumber': '',
	 *	'OrderName': '',
	 *	'OrderSettings': {}, // json object of svg or canvas settings for this order
	 *	'OrderGrossPrice': 11.22,
	 *	'OrderTaxPercent': 20
	 * });
	 * @param client {Object} socket.io connection object
	 */
	onUpdate(client) {
		const evt = 'order-update';
		this._client.on(evt, (req) => {
			const order = new Order(this._client.id);
			order.update(req).then((res) => {
				this.logSocketMessage(this._client.id, evt, req);
				this._client.emit(evt, res);
			}).catch((err) => {
				this._client.emit(evt + '-err', err);
				this.logSocketError(this._client.id, evt, err);
			});
		});
	}

	/**
	 * cancel item(s) from order with given OrderID
	 * only allowed from internal user!
	 * @example
	 * socket.on('order-cancel-item', (res)=>{console.log(res);});
	 * socket.on('order-cancel-item-err', (err)=>{console.log(err);});
	 * socket.emit('order-cancel-item', {OrderID: OrderID, ScanCodes:[OrderDetailScanCode, OrderDetailScanCode]});
	 * @param client {Object} socket.io connection object
	 */
	onChancelItem(client) {
		const evt = 'order-cancel-item';
		this._client.on(evt, (req) => {
			const order = new Order(this._client.id);
			order.cancelItem(req.OrderID, req.Scancodes).then((res) => {
				this.logSocketMessage(this._client.id, evt, req);
				this._client.emit(evt, res);
			}).catch((err) => {
				this._client.emit(evt + '-err', err);
				this.logSocketError(this._client.id, evt, err);
			});
		});
	}

	/**
	 * fetch order
	 * @example
	 * socket.on('order-fetch', (res)=>{console.log(res);});
	 * socket.on('order-fetch-err', (err)=>{console.log(err);});
	 * socket.emit('order-fetch', OrderID);
	 * @param client {Object} socket.io connection object
	 */
	onFetchOrder(client) {
		const evt = 'order-fetch';
		this._client.on(evt, (req) => {
			const order = new Order(this._client.id);
			order.fetchOrder(req).then((res) => {
				this.logSocketMessage(this._client.id, evt, req);
				this._client.emit(evt, res);
			}).catch((err) => {
				this._client.emit(evt + '-err', err);
				this.logSocketError(this._client.id, evt, err);
			});
		});
	}

	/**
	 * fetch order
	 * @example
	 * socket.on('order-fetch-all', (res)=>{console.log(res);});
	 * socket.on('order-fetch-all-err', (err)=>{console.log(err);});
	 * socket.emit('order-fetch-all');
	 * @param client {Object} socket.io connection object
	 */
	onFetchAll(client) {
		const evt = 'order-fetch-all';
		this._client.on(evt, (req) => {
			if (this._client.userdata.User && this._client.userdata.Event) {
				const order = new Order(this._client.id);
				order.fetchAll(req).then((res) => {
					this.logSocketMessage(this._client.id, evt, req);
					this._client.emit(evt, res);
				}).catch((err) => {
					this._client.emit(evt + '-err', err);
					this.logSocketError(this._client.id, evt, err);
				});
			} else {
				this._client.emit(evt + '-err', {msg: 'no user or no event is set', user: this._client.userdata.User, event: this._client.userdata.Event});
			}
		});
	}

}

module.exports = SocketOrder;
