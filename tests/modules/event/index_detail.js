import Socket from '../../socket';
import _ from 'lodash';
import randtoken from "rand-token";

class Event extends Socket {

	constructor() {
		super();

		const runtime = 3000;
		setTimeout(() => {
			process.exit(0);
		}, runtime);

		console.log('test runtime ' + runtime);

		this.socketClient[0].on('event-fetch-detail', (res) => {
			console.log(this._splitter);
			console.log('event-fetch-detail');
			console.log('------------------------------------------------------------------');
			if (_.size(res)) {
				console.log("TICKET:");
				_.each(res.Ticket, ticket => {
					console.log(ticket);
				});
				console.log('------------------------------------------------------------------');
				_.each(res.Seating, floor => {
					console.log("FLOOR:");
					console.log(floor);
					console.log('------------------------------------------------------------------');
					_.each(floor.Room, room => {
						console.log("ROOM:");
						console.log(room);
						console.log('------------------------------------------------------------------');
						console.log("SEAT:");
						_.each(room.Seat, seat => {
							console.log(seat);
						});
						console.log('------------------------------------------------------------------');
						console.log("TABLES:");
						_.each(room.Table, table => {
							console.log(table);
							console.log('------------------------------------------------------------------');
							console.log("SEAT:");
							_.each(table.Seat, seat => {
								console.log(seat);
							});
						});
					});
				});
				console.log('------------------------------------------------------------------');
				console.log("TRANS:");
				_.each(res.Trans, (trans, index) => {
					console.log(index + ':', trans);
				});
				console.log('------------------------------------------------------------------');
			}
		});

		this.socketClient[0].on('event-fetch-detail-err', (res) => {
			console.log(this._splitter);
			console.log('event-fetch-detail-err', res);
		});

	}

	fetchDetail(id) {
		this.socketClient[0].emit('set-language', 'de-at');
		this.socketClient[0].emit('event-fetch-detail', id);
	}

}

const event = new Event();
event.fetchDetail('00');


