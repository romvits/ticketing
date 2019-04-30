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

	setTicket(values) {
		return new Promise((resolve, reject) => {

			resolve(values);
		});
	}

	addTicket(values) {
		return new Promise((resolve, reject) => {
			resolve(values);
		});
	}

	addSeat(SeatID) {
		return new Promise((resolve, reject) => {

			resolve(SeatID);
		});
	}

	addSpecial(values) {
		return new Promise((resolve, reject) => {
			resolve(values);
		});
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
