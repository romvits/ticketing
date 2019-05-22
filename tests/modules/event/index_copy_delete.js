import Socket from '../../socket';
import _ from 'lodash';
import randtoken from "rand-token";

class Event extends Socket {

	constructor() {
		super();

		const runtime = 5000;
		setTimeout(() => {
			process.exit(0);
		}, runtime);

		this.EventID = null;

		console.log('test runtime ' + runtime);

		this.socketClient[0].on('event-copy', (res) => {
			console.log(this._splitter);
			console.log('event-copy');
			console.log(res);
			this.EventID = res;

			setTimeout(() => {
				this.delete();
			}, 2000);

		});

		this.socketClient[0].on('event-copy-err', (res) => {
			console.log(this._splitter);
			console.log('event-copy-err', res);
		});

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

	copy() {
		this.socketClient[0].emit('event-copy', {
			EventID: 'e5821450bb75617820180730092850',
			EventPrefix: randtoken.generate(5).toUpperCase(),
			EventSubdomain: 'event-2019-' + randtoken.generate(10)
		});
	}

	delete() {
		this.socketClient[0].emit('event-delete', this.EventID);
	}
}

const event = new Event();
event.copy();


