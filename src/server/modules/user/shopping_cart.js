import Module from './../module';
import _ from 'lodash';

/**
 * user shopping cart actions
 * @extends Module
 */
class UserShoppingCart extends Module {

	/**
	 * constructor
	 * @param connID {String} 32 character string of connection ID from database table ``
	 */
	constructor(ClientConnID) {
		super(ClientConnID);
		this._userdata = SOCKET.io.sockets.connected[this._clientConnID].userdata;
	}

	/**
	 * set ticket - multiple tickets (especially for external usage parameter Amount can be used)
	 * @param values {Object} Object
	 * @example
	 * {ID:'TicketID', Amount: 2}
	 * @returns {Promise<any>}
	 */
	setTicket(values) {
		return new Promise((resolve, reject) => {
			let resCountTicketSold, rowTicket;
			let soldTicket = 0;
			let availableTicket = 0;
			let actualVisitors = 0;
			let maximumVisitors = this._userdata.Event.EventMaximumVisitors;

			DB.promiseSelect('viewCountEventTicketSold', null, {EventID: this._userdata.Event.EventID}).then(res => {
				resCountTicketSold = res;
				_.each(resCountTicketSold, rowCountTicketSold => {
					if (rowCountTicketSold.Type === 'ticket') {
						actualVisitors += rowCountTicketSold.count;
					}
					if (rowCountTicketSold.TicketID === values.ID) {
						soldTicket = rowCountTicketSold.count;
					}
				});
				return DB.promiseSelect('innoTicket', null, {TicketID: values.ID, TicketEventID: this._userdata.Event.EventID});
			}).then(res => {
				rowTicket = res[0];
				_.each(SOCKET.io.sockets.connected, client => {
					if (client.adapter.rooms[this._userdata.Event.EventID].sockets && client.userdata.ShoppingCart && client.userdata.ShoppingCart.Detail) {
						_.each(client.userdata.ShoppingCart.Detail, Detail => {
							if (Detail.TicketID === values.ID) {
								soldTicket++;
							}
						});
						console.log(client.userdata.ShoppingCart);
					}
				});
				availableTicket = rowTicket.TicketContingent - soldTicket;

				console.log('=====================================');
				console.log(rowTicket);
				console.log('actualVisitors', actualVisitors);
				console.log('maximumVisitors', maximumVisitors);
				console.log('soldTicket', soldTicket);
				console.log('availableTicket', availableTicket);
				console.log('=====================================');
				resolve({});
			}).catch(err => {
				console.log(err);
				reject();
			});
		});
	}

	/**
	 * add seat
	 * @param SeatID {String} 32 character string for ID of the seat
	 * @returns {Promise<any>}
	 */
	addSeat(SeatID) {
		return new Promise((resolve, reject) => {

			resolve(SeatID);
		});
	}

	/**
	 * add special offer to shopping cart (not a special ticket !!!)
	 * @param values {Object} arra
	 * @returns {Promise<any>}
	 */
	addSpecialOffer(values) {
		return new Promise((resolve, reject) => {
			resolve(values);
		});
	}

	/**
	 * set discount to shopping cart (order) item
	 * @param values {Object} Object
	 * @example
	 * {ID:'ShoppingCartDetailID', Discount: 1.23}
	 * @returns {Promise<any>}
	 */
	setDiscount(values) {

	}

	empty() {
		return new Promise((resolve, reject) => {
			resolve([]);
		});
	}

	del(DetailID) {
		return new Promise((resolve, reject) => {
			resolve(DetailID);
		});
	}

}

module.exports = UserShoppingCart;
