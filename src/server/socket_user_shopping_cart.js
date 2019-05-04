import Helpers from './helpers';
import UserShoppingCart from './modules/user/shopping_cart';

/**
 * shopping cart
 * @public
 * @class
 * @memberof Socket
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
	}

	/**
	 * set user for internal connections ('admin' or 'promoter' is logged in)
	 * @example
	 * socket.on('shopping-cart-set-user', (res)=>{console.log(res);});
	 * socket.on('shopping-cart-set-user-err', (err)=>{console.log(err);});
	 * socket.emit('shopping-cart-set-user', 'UserID'); (UserID = one id from database table 'User')
	 */
	onSetUser() {
		const evt = 'shopping-cart-set-user';
		this._client.on(evt, UserID => {
			if (this._client.userdata.User) {
				const shoppingCart = new UserShoppingCart(this._client.id);
				shoppingCart.setUser(UserID).then(res => {
					this._client.emit(evt, res);
					this.logSocketMessage(this._client.id, evt, res);
				}).catch(err => {
					this._client.emit(evt + '-err', err);
					this.logSocketError(this._client.id, evt, err);
				});
			} else {
				let err = 'user not logged in';
				this._client.emit(evt + '-err', err);
				this.logSocketError(this._client.id, evt, err);
			}
		});
	}


	/**
	 * set ticket
	 * @example
	 * socket.on('shopping-cart-set-ticket', (res)=>{console.log(res);});
	 * socket.on('shopping-cart-set-ticket-err', (err)=>{console.log(err);});
	 * socket.emit('shopping-cart-set-ticket', {
	 * });
	 */
	onSetTicket() {
		const evt = 'shopping-cart-set-ticket';
		this._client.on(evt, req => {
			const shoppingCart = new UserShoppingCart(this._client.id);
			shoppingCart.setTicket(req).then(res => {
				this._client.emit(evt, res);
				this.logSocketMessage(this._client.id, evt, res);
			}).catch(err => {
				this._client.emit(evt + '-err', err);
				this.logSocketError(this._client.id, evt, err);
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
		this._client.on(evt, SeatID => {
			const shoppingCart = new UserShoppingCart(this._client.id);
			shoppingCart.setSeat(SeatID).then(res => {
				this._client.emit(evt, res);
				this.logSocketMessage(this._client.id, evt, res);
			}).catch(err => {
				this._client.emit(evt + '-err', err);
				this.logSocketError(this._client.id, evt, err);
			});
		});
	}

	/**
	 * add special
	 * @example
	 * socket.on('shopping-cart-add-special', (res)=>{console.log(res);});
	 * socket.on('shopping-cart-add-special-err', (err)=>{console.log(err);});
	 * socket.emit('shopping-cart-add-special', {
	 * });
	 */
	onAddSpecialOffer() {
		const evt = 'shopping-cart-add-special-offer';
		this._client.on(evt, req => {
			const shoppingCart = new UserShoppingCart(this._client.id);
			shoppingCart.addSpecialOffer(req).then(res => {
				this._client.emit(evt, res);
				this.logSocketMessage(this._client.id, evt, res);
			}).catch(err => {
				this._client.emit(evt + '-err', err);
				this.logSocketError(this._client.id, evt, err);
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
			const shoppingCart = new UserShoppingCart(this._client.id);
			shoppingCart.setDiscount(req).then(res => {
				this._client.emit(evt, res);
				this.logSocketMessage(this._client.id, evt, res);
			}).catch(err => {
				this._client.emit(evt + '-err', err);
				this.logSocketError(this._client.id, evt, err);
			});
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
		this._client.on(evt, UserID => {
			const shoppingCart = new UserShoppingCart(this._client.id);
			shoppingCart.setUser(UserID).then(res => {
				this._client.emit(evt, res);
				this.logSocketMessage(this._client.id, evt, res);
			}).catch(err => {
				this._client.emit(evt + '-err', err);
				this.logSocketError(this._client.id, evt, err);
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
		this._client.on(evt, Paymanet => {
			const shoppingCart = new UserShoppingCart(this._client.id);
			shoppingCart.setPayment(Paymanet).then(res => {
				this._client.emit(evt, res);
				this.logSocketMessage(this._client.id, evt, res);
			}).catch(err => {
				this._client.emit(evt + '-err', err);
				this.logSocketError(this._client.id, evt, err);
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
		this._client.on(evt, DetailID => {
			const shoppingCart = new UserShoppingCart(this._client.id);
			shoppingCart.del(DetailID).then(res => {
				this._client.emit(evt, res);
				this.logSocketMessage(this._client.id, evt, res);
			}).catch(err => {
				this._client.emit(evt + '-err', err);
				this.logSocketError(this._client.id, evt, err);
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
				this._client.emit(evt, res);
				this.logSocketMessage(this._client.id, evt, res);
			}).catch(err => {
				this._client.emit(evt + '-err', err);
				this.logSocketError(this._client.id, evt, err);
			});
		});
	}

	/**
	 * checkout
	 * @example
	 * socket.on('shopping-cart-checkout', (res)=>{console.log(res);});
	 * socket.on('shopping-cart-checkout-err', (err)=>{console.log(err);});
	 * socket.emit('shopping-cart-checkout', {
	 * });
	 */
	onCheckout() {
		const evt = 'shopping-cart-checkout';
		this._client.on(evt, req => {
			this._client.emit(evt, this._client.userdata.ShoppingCart);
			this.logSocketMessage(this._client.id, evt, this._client.userdata.ShoppingCart);
		});
	}

}

module.exports = SocketShoppingCart;
