class Floor {
	constructor() {
		socketClient.on('floor-create', (res) => {
			console.log('floor-create', res);
		});

	}

	create(req) {
		socketClient.emit('floor-create', req);
	}

}

module.exports = Floor;