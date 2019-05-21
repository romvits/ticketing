import Socket from '../../socket';
import _ from 'lodash';
import randtoken from "rand-token";

class Event extends Socket {

	constructor() {
		super();

		const runtime = 10000;
		setTimeout(() => {
			process.exit(0);
		}, runtime);

		console.log('test runtime ' + runtime);

		this.socketClient[0].on('event-fetch-detail', (res) => {
			console.log(this._splitter);
			console.log('event-fetch-detail');
			//console.log(res);
			if (_.size(res)) {
				_.each(res.Seating, floor => {
					console.log("==================================================================");
					//console.log(floor);
					_.each(floor.Room, room => {
						console.log("-------------------------------------------------------------------");
						console.log("ROOM:");
						//console.log(room);
						console.log("SEATs:");
						_.each(room.Seat, seat => {
							//console.log(seat);
						});
						console.log("TABLESs:");
						_.each(room.Table, table => {
							//console.log(table);
							console.log("SEATs:");
							_.each(table.Seat, seat => {
								//console.log(seat);
							});
						});
					});
				});
			}
		});

		this.socketClient[0].on('event-fetch-detail-err', (res) => {
			console.log(this._splitter);
			console.log('event-fetch-detail-err', res);
		});

	}

	fetchDetail(id) {
		this.socketClient[0].emit('event-fetch-detail', id);
	}

}

const event = new Event();
event.fetchDetail('sdLODAm1kYL5xWjIU155844212021294');


