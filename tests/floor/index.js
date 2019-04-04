import Socket from './../socket';

class Floor extends Socket {

	constructor() {
		super();
		/*
		setTimeout(() => {
			process.exit(0);
		}, 60000);
		*/
		this.socketClient[0].on('floor-create', (res) => {
			console.log(res);
			process.exit(0);
		});

	}

	create() {
		const req = {
			'FloorEventID': null,
			'FloorLocationID': null,
			'FloorName': 'FloorName',
			'FloorSVG': 'SVG'
		};
		this.socketClient[0].emit('floor-create', req);
	}

}

const floor = new Floor();
floor.create();


