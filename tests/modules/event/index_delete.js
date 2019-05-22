import Socket from '../../socket';
import _ from 'lodash';
import randtoken from "rand-token";

class Event extends Socket {

	constructor() {
		super();

		const runtime = 2000;
		setTimeout(() => {
			process.exit(0);
		}, runtime);

		console.log('test runtime ' + runtime);

		this.socketClient[0].on('event-delete', (res) => {
			console.log(this._splitter);
			console.log('event-delete');
			console.log(res);

		});

		this.socketClient[0].on('event-delete-err', (res) => {
			console.log(this._splitter);
			console.log('event-delete-err', res);
		});

	}

	delete() {
		this.socketClient[0].emit('event-delete', 'a8nJfnTTCFUcvsax5155853271703619');
	}
}

const event = new Event();
event.delete();


