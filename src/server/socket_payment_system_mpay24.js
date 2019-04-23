import Helpers from './helpers';
import PaymentSystemMPAY24 from './payment_systems/mpay24/mpay24'

/**
 * payment system mpay24
 * @public
 * @class
 * @memberof Socket
 */
class SocketPaymentSystemMPAY24 extends Helpers {

	/**
	 * constructor for list socket payment sysstem mpay24<br>
	 * @param client {Object} socket.io connection object
	 */
	constructor(client) {
		super();
		this._client = client;
		this.onInit();
		this.onPay();
	}


	onInit() {
		const evt = 'payment-system-mpay24-init';
		this._client.on(evt, (req) => {
			const paymentSystemMPAY24 = new PaymentSystemMPAY24(this._client.id);
			paymentSystemMPAY24.init(req).then((res) => {
				this._client.emit(evt, res.location);
				this.logSocketMessage(this._client.id, evt, res);
			}).catch((err) => {
				this._client.emit(evt + '-err', err);
				this.logSocketError(this._client, evt, err);
			});
		});
	}

	onPay() {
		const evt = 'payment-system-mpay24-pay';
		this._client.on(evt, (req) => {
			const paymentSystemMPAY24 = new PaymentSystemMPAY24(this._client.id);
			paymentSystemMPAY24.pay(req).then((res) => {
				this._client.emit(evt, res.location);
				this.logSocketMessage(this._client.id, evt, res);
			}).catch((err) => {
				this._client.emit(evt + '-err', err);
				this.logSocketError(this._client, evt, err);
			});
		});
	}

}

module.exports = SocketPaymentSystemMPAY24;
