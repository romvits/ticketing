import Socket from '../../socket';
import _ from 'lodash';

class Location extends Socket {

	constructor() {
		super();

		const runtime = 60000;
		setTimeout(() => {
			process.exit(0);
		}, runtime);

		console.log('test runtime ' + runtime);

		this.socketClient[0].on('location-create', (res) => {

			console.log(this._splitter);
			console.log('location-create', res);

			let id = _.clone(res.data.LocationID);

			setTimeout(() => {
				this.fetch(id);
			}, this.randTimeout() + 1000);

			setTimeout(() => {
				this.update(id);
			}, this.randTimeout() + 2000);

			setTimeout(() => {
				this.updateError(id);
			}, this.randTimeout() + 3000);

			setTimeout(() => {
				this.fetch(id);
			}, this.randTimeout() + 4000);

			setTimeout(() => {
				// this.delete(id);
			}, this.randTimeout() + runtime - 5000);
		});

		this.socketClient[0].on('location-fetch', (res) => {
			console.log(this._splitter);
			console.log('location-fetch', res);
		});

		this.socketClient[0].on('location-update', (res) => {
			console.log(this._splitter);
			console.log('location-update', res);
		});

		this.socketClient[0].on('location-delete', (res) => {
			console.log(this._splitter);
			console.log('location-delete', res);
		});
	}

	create() {
		const req = {
			'LocationID': null,
			'LocationName': 'Name',
			'LocationStreet': 'Street',
			'LocationCity': 'City',
			'LocationZIP': '123ZIP',
			'LocationCountryCountryISO2': 'AT',
			'LocationPhone1': '+43123',
			'LocationPhone2': '+43456',
			'LocationFax': '+43789',
			'LocationEmail': 'location.email@test.tld',
			'LocationHomepage': 'http://www.test.tld'
		};
		setTimeout(() => {
			this.socketClient[0].emit('location-create', req);
		}, this.randTimeout());
	}

	fetch(id) {
		this.socketClient[0].emit('location-fetch', id);
	}

	updateError(id) {

	}

	update(id) {
		const req = {
			'LocationID': id,
			'LocationName': 'Location Name Updated',
			'LocationCity': 'Wien',
		};
		this.socketClient[0].emit('location-update', req);
	}

	delete(id) {
		this.socketClient[0].emit('location-delete', id);
	}

}

const location = new Location();
location.create();
