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
	constructor(client) {
		this._client = client;
		this.onInit();
		this.onPay();
		this._token = null;
		this._pType = 'CC';
	}

	onInit(merchantID = '91098', password = 'Toy@+3yE3z') {
		const evt = 'payment-system-mpay24-init';
		this._client.on(evt, (req) => {
			mpay24.init('91098', 'Toy@+3yE3z', 'TEST').then(res => {
				mpay24.createPaymentToken({
					pType: this._pType,
					templateSet: 'DEFAULT',
				}).then(result => {
					this._token = result.token;
					this._client.emit(evt, result.location);
				}).catch(err => {
					console.trace(err);
				});

			});
		});
	}

	onPay(merchantID = '91098', password = 'Toy@+3yE3z') {
		const evt = 'payment-system-mpay24-pay';
		this._client.on(evt, (req) => {
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
				console.log(payReq);
				mpay24.acceptPayment(payReq).then(function(result) {
					console.log(result);
					console.log(result.returnCode);
					console.log(payReq);
				}).catch(err => {
					console.log(err);
				});
			});
		});
	}

}

module.exports = SocketPaymentSystemMPAY24;
