import Socket from '../../socket';
import _ from 'lodash';

class Seat extends Socket {

	constructor() {
		super();

		const runtime = 10000;
		setTimeout(() => {
			process.exit(0);
		}, runtime);

		console.log('test runtime ' + runtime);

		this.socketClient[0].on('seat-create', (res) => {

			console.log(this._splitter);
			console.log('seat-create', res);

			let id = _.clone(res.data.SeatID);

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

		this.socketClient[0].on('seat-fetch', (res) => {
			console.log(this._splitter);
			console.log('seat-fetch', res);
		});

		this.socketClient[0].on('seat-update', (res) => {
			console.log(this._splitter);
			console.log('seat-update', res);
		});

		this.socketClient[0].on('seat-delete', (res) => {
			console.log(this._splitter);
			console.log('seat-delete', res);
		});

	}

	create() {
		const req = {
			'SeatID': null,
			'SeatFloorID': '00',
			'SeatRoomID': '00',
			'SeatTableID': null,
			'SeatNumber': '2',
			'SeatName': 'Sitzplatz',
			'SeatSettings': {},
			'SeatGrossPrice': 11.22,
			'SeatTaxPercent': 20
		};
		setTimeout(() => {
			this.socketClient[0].emit('seat-create', req);
		}, this.randTimeout());
	}

	fetch(id) {
		this.socketClient[0].emit('seat-fetch', id);
	}

	update(id) {
		const req = {
			'SeatID': id,
			'SeatFloorID': '00',
			'SeatRoomID': '00',
			'SeatTableID': null,
			'SeatNumber': '2',
			'SeatName': 'Sitzplatz',
			'SeatSettings': {},
			'SeatGrossPrice': 11.22,
			'SeatTaxPercent': 20
		};
		this.socketClient[0].emit('seat-update', req);
	}

	delete(id) {
		this.socketClient[0].emit('seat-delete', id);
	}

}

const seat = new Seat();
seat.create();
