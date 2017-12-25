import io from 'socket.io-client';
import Events from 'tiny-emitter';

export default class Socket {

	constructor(config) {
		this.config = config;
		this.events = new Events();
	}

	connect() {
		this.conn = io.connect(this.config.url);

		this.conn.on('init', (data) => {
			console.log(data);
		});

		this.conn.on('connect', () => {
			this.events.emit('connect');
			console.log("event connected triggered");
		});

	}
}