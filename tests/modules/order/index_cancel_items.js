import Socket from '../../socket';
import _ from 'lodash';

class Order extends Socket {

	constructor(props) {
		super();

		const runtime = 10000; // 60000
		setTimeout(() => {
			process.exit(0);
		}, runtime);
		console.log('test runtime ' + runtime);

		// order fetch all
		this.socketClient[0].on('order-fetch-all', (res) => {
			console.log(this._splitter);
			console.log('order-fetch-all');
			console.log(res);
		});
		this.socketClient[0].on('order-fetch-all-err', (err) => {
			console.log(this._splitter);
			console.log('order-fetch-all-err');
			console.log(err);
		});



	}

	run() {
		this.login(this.data.AdminUser.eMail, this.data.AdminUser.PW);

		console.log(this.data);

		setTimeout(() => {
			this.setIntern(true);
		}, 100);

		setTimeout(() => {
			this.setEvent(this.data.EventSubdomain);
		}, 250);

		setTimeout(() => {
			this.fetchAll();
		}, 500);
	}

	fetchAll() {
		this.socketClient[0].emit('order-fetch-all');
	}
}

const order = new Order();
order.run();
