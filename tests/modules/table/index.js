import Socket from '../../socket';
import _ from 'lodash';

class Table extends Socket {

	constructor() {
		super();

		const runtime = 10000;
		setTimeout(() => {
			process.exit(0);
		}, runtime);

		console.log('test runtime ' + runtime);

		this.socketClient[0].on('table-create', (res) => {

			console.log(this._splitter);
			console.log('table-create', res);

			let id = _.clone(res.data.TableID);

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

		this.socketClient[0].on('table-fetch', (res) => {
			console.log(this._splitter);
			console.log('table-fetch', res);
		});

		this.socketClient[0].on('table-update', (res) => {
			console.log(this._splitter);
			console.log('table-update', res);
		});

		this.socketClient[0].on('table-delete', (res) => {
			console.log(this._splitter);
			console.log('table-delete', res);
		});

	}

	create() {
		const req = {
			'TableID': null,
			'TableFloorID': '00',
			'TableRoomID': '00',
			'TableNumber': 11,
			'TableName': 'Table',
			'TableLabel': '§§TABLE',
			'TableSettings': {} // json object of svg or canvas settings for this table
		};
		setTimeout(() => {
			this.socketClient[0].emit('table-create', req);
		}, this.randTimeout());
	}

	fetch(id) {
		this.socketClient[0].emit('table-fetch', id);
	}

	update(id) {
		const req = {
			'TableID': id,
			'TableFloorID': '00',
			'TableRoomID': '00',
			'TableNumber': 11,
			'TableName': 'Table',
			'TableLabel': '§§TABLE',
			'TableSettings': {} // json object of svg or canvas settings for this table
		};
		this.socketClient[0].emit('table-update', req);
	}

	delete(id) {
		this.socketClient[0].emit('table-delete', id);
	}

}

const table = new Table();
table.create();
