import Socket from '../../socket';
import _ from 'lodash';

class Ticket extends Socket {

	constructor() {
		super();

		const runtime = 60000;
		setTimeout(() => {
			process.exit(0);
		}, runtime);

		console.log('test runtime ' + runtime);

		this.socketClient[0].on('ticket-create', (res) => {

			console.log(this._splitter);
			console.log('ticket-create', res);

			let id = _.clone(res.data.TicketID);

			setTimeout(() => {
				this.fetch(id);
			}, this.randTimeout() + 1000);

			setTimeout(() => {
				this.update(id);
			}, this.randTimeout() + 2000);

			setTimeout(() => {
				this.fetch(id);
			}, this.randTimeout() + 3000);

			setTimeout(() => {
				// this.delete(id);
			}, this.randTimeout() + runtime - 5000);

		});

		this.socketClient[0].on('ticket-fetch', (res) => {
			console.log(this._splitter);
			console.log('ticket-fetch', res);
		});

		this.socketClient[0].on('ticket-update', (res) => {
			console.log(this._splitter);
			console.log('ticket-update', res);
		});

		this.socketClient[0].on('ticket-delete', (res) => {
			console.log(this._splitter);
			console.log('ticket-delete', res);
		});

	}

	create() {
		const req = {
			'TicketID': null,
			'TicketEventID': null,
			'TicketName': 'Ticket Name',
			'TicketLable': '§§TICKETLABEL',
			'TicketType': 'ticket',
			'TicketScanType': 'single',
			'TicketQuota': 100,
			'TicketQuotaPreprint': 20,
			'TicketGrossPrice': 11.22,
			'TicketTaxPercent': 12.34
		};
		setTimeout(() => {
			this.socketClient[0].emit('ticket-create', req);
		}, this.randTimeout());
	}

	fetch(id) {
		this.socketClient[0].emit('ticket-fetch', id);
	}

	update(id) {
		const req = {
			'TicketID': id,
			'TicketEventID': null,
			'TicketName': 'Ticket Name Update',
			'TicketLable': '§§TICKETLABELUPDATE',
			'TicketType': 'special',
			'TicketScanType': 'inout',
			'TicketQuota': 20,
			'TicketQuotaPreprint': 30,
			'TicketGrossPrice': 22.11,
			'TicketTaxPercent': 43.21
		};
		this.socketClient[0].emit('ticket-update', req);
	}

	delete(id) {
		this.socketClient[0].emit('ticket-delete', id);
	}

}

const ticket = new Ticket();
ticket.create();
