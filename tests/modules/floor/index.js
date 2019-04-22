import Socket from '../../socket';
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

			console.log(this._splitter);
			console.log('floor-create', res);

			let id = _.clone(res.data.FloorID);

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

		this.socketClient[0].on('floor-fetch', (res) => {
			console.log(this._splitter);
			console.log('floor-fetch', res);
		});

		this.socketClient[0].on('floor-update', (res) => {
			console.log(this._splitter);
			console.log('floor-update', res);
		});

		this.socketClient[0].on('floor-delete', (res) => {
			console.log(this._splitter);
			console.log('floor-delete', res);
		});

	}

	create() {
		const req = {
			'FloorID': null,
			'FloorEventID': null,
			'FloorLocationID': null,
			'FloorName': 'FloorName',
			'FloorLabel': '§§TokenTranslatedLabel',
			'FloorSVG': 'SVG'
		};
		setTimeout(() => {
			this.socketClient[0].emit('floor-create', req);
		}, this.randTimeout());
	}

	fetch(id) {
		this.socketClient[0].emit('floor-fetch', id);
	}

	update(id) {
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
		this.socketClient[0].emit('floor-delete', id);
	}

}

const floor = new Floor();
floor.create();
