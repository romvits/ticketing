import mpay24 from 'mpay24-node';
import randtoken from "rand-token";


/**
 * payment system mpay24
 * @public
 * @class
 * @memberof Socket
 */
class SocketPaymentSystemMPAY24 {

	/**
	 * payment system mpay24
	 * @param client {Object} socket.io connection object
	 */
	constructor() {
		this._token = null;
		this._pType = 'CC';
	}

	init() {
		return new Promise((resolve, reject) => {
			mpay24.init('91098', 'Toy@+3yE3z', 'TEST').then(res => {
				mpay24.createPaymentToken({
					pType: this._pType,
					templateSet: 'DEFAULT',
				}).then(result => {
					resolve(result);
				}).catch(err => {
					console.trace(err);
					reject(err);
				});

			});
		});
	}

	pay() {
		return new Promise((resolve, reject) => {
			mpay24.init('91098', 'Toy@+3yE3z', 'TEST').then(res => {
				let OrderNumberText = 'ZBB20-123456';
				let tid = OrderNumberText.replace(/-/g, '');
				const payReq = {
					tid: tid,
					pType: 'TOKEN',
					payment: {
						amount: 100,
						currency: 'EUR',
						token: this._token,
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

}

module.exports = SocketPaymentSystemMPAY24;
