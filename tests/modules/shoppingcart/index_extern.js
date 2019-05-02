import Index from './index';
import _ from 'lodash';

let data = {
	User: {
		eMail: 'customer@domain.tld',
		PW: 'admin'
	},
	EventSubdomain: 'demo01',
	Ticket1ID: '01',
	Ticket2ID: null,
	SpecialTicket1ID: '04',
	Seat1ID: '101',
	Seat2ID: '102',
	Seat3ID: '103',
	Seat4ID: '104',
}

if (1 == 2) {
	data = {
		User: {
			eMail: 'customer@domain.tld',
			PW: 'admin'
		},
		EventSubdomain: 'ZBB18',
		Ticket1ID: '8132d4bd9e45413120170910224129',
		Ticket2ID: '2057df901f6223b420170910224052',
		SpecialTicket1ID: 'f4305c8d20e69ee920170910232852',
		Seat1ID: '20c7ae38d114e72020170806093326',
		Seat2ID: '3832b0d8df5ebcf120170806093326',
		Seat3ID: '00cc2f7d9494476120170806093326',
		Seat4ID: '00bf22a67814ea3f20170806093326'
	}
}

class ShoppingCart extends Index {

	constructor(props) {
		super();

		const runtime = 10000; // 60000
		setTimeout(() => {
			process.exit(0);
		}, runtime);
		console.log('test runtime ' + runtime);

		this.shoppingCart = [];

		//this.login(data.User.eMail, data.User.PW);

		setTimeout(() => {
			this.setEvent(data.EventSubdomain);
		}, 100);

		setTimeout(() => {
			this.logout();
		}, runtime - 500);

		setTimeout(() => {
			this.setTicket(data.Ticket1ID, 4);
		}, this.randTimeout() + 1000);

		setTimeout(() => {
			//this.setTicket(data.SpecialTicket1ID, 1);
		}, this.randTimeout() + 1500);

		setTimeout(() => {
			//this.setTicket(data.Ticket1ID, 2);
		}, this.randTimeout() + 4000);

		setTimeout(() => {
			//this.setTicket(data.SpecialTicket1ID, 2);
		}, this.randTimeout() + 3500);

		setTimeout(() => {
			//this.setTicket(data.Ticket1ID, 4);
		}, this.randTimeout() + 3500);

		setTimeout(() => {
			//this.addSeat(data.Seat1ID);
			//this.addSeat(data.Seat2ID);
			//this.addSeat(data.Seat3ID);
			//this.addSeat(data.Seat4ID);
		}, this.randTimeout() + 2000);

		setTimeout(() => {
			//this.addSeat(data.Seat2ID);
		}, this.randTimeout() + 3000);

		setTimeout(() => {
			this.checkout();
		}, this.randTimeout() + 7000);

	}

}

const order = new ShoppingCart();
