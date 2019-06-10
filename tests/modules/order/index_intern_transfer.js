import Index from './index';
import _ from 'lodash';

class ShoppingCart extends Index {

	constructor(props) {
		super();

		this.OrderPayment = 'transfer';

		const runtime = 10000; // 60000
		setTimeout(() => {
			process.exit(0);
		}, runtime);
		console.log('test runtime ' + runtime);

		this.login(this.data.AdminUser.eMail, this.data.AdminUser.PW);

		setTimeout(() => {
			this.setIntern(true);
		}, 100);

		setTimeout(() => {
			this.setEvent(this.data.EventSubdomain);
		}, 250);

		setTimeout(() => {
			this.setPayment('cash');
		}, 350);

		setTimeout(() => {
			this.logout();
		}, runtime - 500);

		setTimeout(() => {
			this.setTicket(this.data.Ticket1ID, 2);
		}, this.randTimeout() + 300);

		setTimeout(() => {
			this.setTicket(this.data.SpecialTicket1ID, 2);
		}, this.randTimeout() + 450);

		setTimeout(() => {
			this.setSeat(this.data.Seat1ID);
			this.setSeat(this.data.Seat2ID);
		}, this.randTimeout() + 500);

		setTimeout(() => {
			//this.setSeat(this.data.Seat2ID);
		}, this.randTimeout() + 2000);

		setTimeout(() => {
			_.each(this.shoppingCart.OrderDetail, Detail => {
				if (Detail.OrderDetailType === 'seat') {
					this.setDiscount(Detail.ShoppingCartID, 2.22);
				}
				if (Detail.OrderDetailTypeID === '04') {
					this.setDiscount(Detail.ShoppingCartID, 1.95);
				}
				if (Detail.OrderDetailType === 'handlingfee') {
					this.setDiscount(Detail.ShoppingCartID, 0.14);
				}
				if (Detail.OrderDetailType === 'shippingcost') {
					this.setDiscount(Detail.ShoppingCartID, 0.33);
				}
				if (Detail.OrderDetailType === 'shippingcost') {
					//this.del(Detail.ShoppingCartID);
				}
				if (Detail.OrderDetailType === 'handlingfee') {
					//this.del(Detail.ShoppingCartID);
				}
			});
		}, this.randTimeout() + 4000);

		setTimeout(() => {
			this.setUser(this.data.CustomerUser.ID);
		}, this.randTimeout() + 5000);

		setTimeout(() => {
			this.checkout();
		}, this.randTimeout() + 7000);

		setTimeout(() => {
			this.payIntern();
		}, this.randTimeout() + 8000);

	}

}

const order = new ShoppingCart();
