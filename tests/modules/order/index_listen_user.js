import Index from './index';
import _ from 'lodash';

class ShoppingCart extends Index {

	constructor(props) {
		super();

		const runtime = 15000; // 60000
		setTimeout(() => {
			process.exit(0);
		}, runtime);
		console.log('test runtime ' + runtime);

		setTimeout(() => {
			this.setEvent(this.data.EventSubdomain);
		}, 100);

	}

}

const order = new ShoppingCart();
