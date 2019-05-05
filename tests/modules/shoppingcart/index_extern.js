import Index from './index';
import _ from 'lodash';

class ShoppingCart extends Index {

	constructor(props) {
		super();

		const runtime = 10000; // 60000
		setTimeout(() => {
			process.exit(0);
		}, runtime);
		console.log('test runtime ' + runtime);

		setTimeout(() => {
			this.login(this.data.CustomerUser.eMail, this.data.CustomerUser.PW);
		}, 5000);

		setTimeout(() => {
			this.setEvent(this.data.EventSubdomain);
		}, 100);

		setTimeout(() => {
			this.logout();
		}, runtime - 500);

		setTimeout(() => {
			this.setTicket(this.data.Ticket1ID, 4);
		}, this.randTimeout() + 1000);

		setTimeout(() => {
			//this.setTicket(this.data.SpecialTicket1ID, 1);
		}, this.randTimeout() + 1500);

		setTimeout(() => {
			//this.setTicket(this.data.Ticket1ID, 2);
		}, this.randTimeout() + 4000);

		setTimeout(() => {
			//this.setTicket(this.data.SpecialTicket1ID, 2);
		}, this.randTimeout() + 3500);

		setTimeout(() => {
			//this.setTicket(this.data.Ticket1ID, 4);
		}, this.randTimeout() + 3500);

		setTimeout(() => {
			//this.setSeat(this.data.Seat1ID);
			//this.setSeat(this.data.Seat2ID);
			//this.setSeat(this.data.Seat3ID);
			//this.setSeat(this.data.Seat4ID);
		}, this.randTimeout() + 2000);

		setTimeout(() => {
			//this.setSeat(this.data.Seat2ID);
		}, this.randTimeout() + 3000);

		setTimeout(() => {
			this.checkout();
		}, this.randTimeout() + 7000);

	}

}

const order = new ShoppingCart();
