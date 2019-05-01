import Index from './index';
import _ from 'lodash';

let data = {
	User: {
		eMail: 'admin@admin.tld',
		PW: 'admin'
	},
	EventSubdomain: 'demo01',
	Ticket1ID: '01',
	Ticket2ID: null,
	SpecialTicket1ID: '04',
	Seat1ID: '101',
	Seat2ID: '103',
}

data = {
	User: {
		eMail: 'admin@admin.tld',
		PW: 'admin'
	},
	EventSubdomain: 'ZBB18',
	Ticket1ID: '8132d4bd9e45413120170910224129',
	Ticket2ID: '2057df901f6223b420170910224052',
	SpecialTicket1ID: 'f4305c8d20e69ee920170910232852',
	Seat1ID: '20c7ae38d114e72020170806093326',
	Seat2ID: '3832b0d8df5ebcf120170806093326',
}


class ShoppingCart extends Index {

	constructor(props) {
		super();

		const runtime = 15000; // 60000
		setTimeout(() => {
			process.exit(0);
		}, runtime);
		console.log('test runtime ' + runtime);

		this.shoppingCart = [];

		this.login(data.User.eMail, data.User.PW);

		setTimeout(() => {
			this.setIntern(true);
		}, 100);

		setTimeout(() => {
			this.setEvent(data.EventSubdomain);
		}, 250);

		setTimeout(() => {
			this.logout();
		}, runtime - 500);

		setTimeout(() => {
			this.setTicket(data.Ticket1ID, 4);
		}, this.randTimeout() + 300);

		setTimeout(() => {
			this.setTicket(data.SpecialTicket1ID, 2);
		}, this.randTimeout() + 450);

		setTimeout(() => {
			//this.addSeat(data.Seat1ID);
			//this.addSeat(data.Seat2ID);
		}, this.randTimeout() + 2000);

		setTimeout(() => {
			this.checkout();
		}, this.randTimeout() + 5000);

	}

}

const order = new ShoppingCart();
