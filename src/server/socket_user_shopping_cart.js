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
		this.onSetTicket();
		this.onAddTicket();
		this.onAddSeat();
		this.onAddSpecial();
		this.onDel();
		this.onEmpty();
		this.onCheckout();
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
	 * add ticket
	 * @example
	 * socket.on('shopping-cart-add-ticket', (res)=>{console.log(res);});
	 * socket.on('shopping-cart-add-ticket-err', (err)=>{console.log(err);});
	 * socket.emit('shopping-cart-add-ticket', {
	 * });
	 */
	onAddTicket() {
		const evt = 'shopping-cart-add-ticket';
		this._client.on(evt, req => {
			const shoppingCart = new UserShoppingCart(this._client.id);
			shoppingCart.addTicket(req).then(res => {
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
	 * socket.on('shopping-cart-add-seat', (res)=>{console.log(res);});
	 * socket.on('shopping-cart-add-seat-err', (err)=>{console.log(err);});
	 * socket.emit('shopping-cart-add-seat', SeatID);
	 */
	onAddSeat() {
		const evt = 'shopping-cart-add-seat';
		this._client.on(evt, SeatID => {
			const shoppingCart = new UserShoppingCart(this._client.id);
			shoppingCart.addSeat(SeatID).then(res => {
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
	onAddSpecial() {
		const evt = 'shopping-cart-add-special';
		this._client.on(evt, req => {
			const shoppingCart = new UserShoppingCart(this._client.id);
			shoppingCart.addSpecial(req).then(res => {
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
			this._client.emit(evt, res);
			this.logSocketMessage(this._client.id, evt, res);
		});
	}
}

module.exports = SocketShoppingCart;
