import Socket from '../../socket';
import _ from 'lodash';

class Room extends Socket {

	constructor() {
		super();

		const runtime = 60000;
		setTimeout(() => {
			process.exit(0);
		}, runtime);

		console.log('test runtime ' + runtime);

		this.socketClient[0].on('room-create', (res) => {

			console.log(this._splitter);
			console.log('room-create', res);

			let id = _.clone(res.data.RoomID);

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

		this.socketClient[0].on('room-fetch', (res) => {
			console.log(this._splitter);
			console.log('room-fetch', res);
		});

		this.socketClient[0].on('room-update', (res) => {
			console.log(this._splitter);
			console.log('room-update', res);
		});

		this.socketClient[0].on('room-delete', (res) => {
			console.log(this._splitter);
			console.log('room-delete', res);
		});

	}

	create() {
		const req = {
			'RoomID': null,
			'RoomFloorID': null,
			'RoomName': 'Room Name',
			'RoomLabel': '§§TOKENNAME',
			'RoomSVGShape': '10,20,30,40'
		};
		setTimeout(() => {
			this.socketClient[0].emit('room-create', req);
		}, this.randTimeout());
	}

	fetch(id) {
		this.socketClient[0].emit('room-fetch', id);
	}

	update(id) {
		const req = {
			'RoomID': id,
			'RoomFloorID': null,
			'RoomName': 'Room Name',
			'RoomLabel': '§§TOKENNAME',
			'RoomSVGShape': '10,20,30,40'
		};
		this.socketClient[0].emit('room-update', req);
	}

	delete(id) {
		this.socketClient[0].emit('room-delete', id);
	}

}

const room = new Room();
room.create();
