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

		this.socketClient[0].on('event-copy', (res) => {
			console.log(this._splitter);
			console.log('event-copy');
			console.log(res);

		});

		this.socketClient[0].on('event-copy-err', (res) => {
			console.log(this._splitter);
			console.log('event-copy-err', res);
		});

	}

	copy() {
		this.socketClient[0].emit('event-copy', {
			EventID: 'e5821450bb75617820180730092850',
			EventPrefix: randtoken.generate(5).toUpperCase(),
			EventSubdomain: 'event-2019-' + randtoken.generate(10)
		});
	}
}

const event = new Event();
event.copy();


