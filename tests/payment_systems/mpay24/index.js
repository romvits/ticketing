import Socket from '../../socket';
import _ from 'lodash';
import randtoken from "rand-token";

class PaymentSystemMPAY24 extends Socket {

	constructor() {
		super();

		const runtime = 10000;
		setTimeout(() => {
			process.exit(0);
		}, runtime);

		console.log('test runtime ' + runtime);

		this.socketClient[0].on('payment-system-mpay24-init', (res) => {

			console.log(this._splitter);
			console.log('payment-system-mpay24-init', res);

		});

	}

	init() {
		console.log('init');
		let req = {};
		this.socketClient[0].emit('payment-system-mpay24-init', req);
	}

}

const payment = new PaymentSystemMPAY24();
payment.init();
