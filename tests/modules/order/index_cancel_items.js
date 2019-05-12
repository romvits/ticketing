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

		// order fetch
		this.socketClient[0].on('order-fetch', (Order) => {
			console.log(this._splitter);
			console.log('order-fetch');
			let Scancode = [];
			let ticket = false;
			let seat = false;
			_.each(Order.OrderDetail, (Detail) => {
				if (Detail.OrderDetailState !== 'canceled') {
					console.log(Detail.OrderDetailScanCode, Detail.OrderDetailTypeID, Detail.OrderDetailType);
					if (Detail.OrderDetailType === 'ticket' && !ticket) {
						//Scancode.push(Detail.OrderDetailScanCode);
						ticket = true;
					}
					if (Detail.OrderDetailType === 'seat' && !seat) {
						//Scancode.push(Detail.OrderDetailScanCode);
						seat = true;
					}
					Scancode.push(Detail.OrderDetailScanCode);
				}
			});
			this.socketClient[0].emit('order-cancel-item', {OrderID: Order.OrderID, Scancodes: Scancode});
		});
		this.socketClient[0].on('order-fetch-err', (err) => {
			console.log(this._splitter);
			console.log('order-fetch-err');
			console.log(err);
		});

		// order fetch all
		this.socketClient[0].on('order-fetch-all', (res) => {
			console.log(this._splitter);
			console.log('order-fetch-all');
			console.log(res[0]);
			this.socketClient[0].emit('order-fetch', res[0].OrderID);
		});
		this.socketClient[0].on('order-fetch-all-err', (err) => {
			console.log(this._splitter);
			console.log('order-fetch-all-err');
			console.log(err);
		});

		// order cancel item
		this.socketClient[0].on('order-cancel-item', (res) => {
			console.log(this._splitter);
			console.log('order-cancel-item');
			console.log(res);
		});
		this.socketClient[0].on('order-cancel-item-err', (err) => {
			console.log(this._splitter);
			console.log('order-cancel-item-err');
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
