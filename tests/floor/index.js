import Socket from './../socket';
import _ from 'lodash';

class Floor extends Socket {

	constructor() {
		super();

		const runtime = 60000;
		setTimeout(() => {
			process.exit(0);
		}, runtime);

		console.log('test runtime ' + runtime);

		this.socketClient[0].on('floor-create', (res) => {

			console.log('floor-create', res);

			let id = _.clone(res.data.FloorID);

			setTimeout(() => {
				this.fetch(id);
			}, 1000);

			setTimeout(() => {
				this.update(id);
			}, 2000);

			setTimeout(() => {
				this.fetch(id);
			}, 3000);

			setTimeout(() => {
				this.delete(id);
			}, 9000);

		});

		this.socketClient[0].on('floor-fetch', (res) => {
			console.log('floor-fetch', res);
		});

		this.socketClient[0].on('floor-update', (res) => {
			console.log('floor-update', res);
		});

		this.socketClient[0].on('floor-delete', (res) => {
			console.log('floor-delete', res);
		});

	}

	create() {
		console.log(this._splitter);
		const req = {
			'FloorEventID': null,
			'FloorLocationID': null,
			'FloorName': 'FloorName',
			'FloorSVG': 'SVG'
		};
		this.socketClient[0].emit('floor-create', req);
	}

	fetch(id) {
		console.log(this._splitter);
		this.socketClient[0].emit('floor-fetch', id);
	}

	update(id) {
		console.log(this._splitter);
		const req = {
			'FloorID': id,
			'FloorEventID': null,
			'FloorLocationID': null,
			'FloorName': 'FloorName neu',
			'FloorSVG': 'SVG neu'
		};
		this.socketClient[0].emit('floor-update', req);
	}

	delete(id) {
		console.log(this._splitter);
		this.socketClient[0].emit('floor-delete', id);
	}

}

const floor = new Floor();
floor.create();


