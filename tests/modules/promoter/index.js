import Socket from '../../socket';
import _ from 'lodash';

class Promoter extends Socket {

	constructor() {
		super();

		const runtime = 60000;
		setTimeout(() => {
			process.exit(0);
		}, runtime);

		console.log('test runtime ' + runtime);

		this.socketClient[0].on('promoter-create', (res) => {

			console.log(this._splitter);
			console.log('promoter-create', res);

			let id = _.clone(res.data.PromoterID);

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

		this.socketClient[0].on('promoter-fetch', (res) => {
			console.log(this._splitter);
			console.log('promoter-fetch', res);
		});

		this.socketClient[0].on('promoter-update', (res) => {
			console.log(this._splitter);
			console.log('promoter-update', res);
		});

		this.socketClient[0].on('promoter-delete', (res) => {
			console.log(this._splitter);
			console.log('promoter-delete', res);
		});
	}

	create() {
		const req = {
			'PromoterID': null,
			'PromoterName': 'Name',
			'PromoterStreet': 'Street',
			'PromoterCity': 'City',
			'PromoterZIP': '123ZIP',
			'PromoterCountryCountryISO2': 'AT',
			'PromoterPhone1': '+43123',
			'PromoterPhone2': '+43456',
			'PromoterFax': '+43789',
			'PromoterEmail': 'promoter.email@test.tld',
			'PromoterHomepage': 'http://www.test.tld',
			'PromoterLocations': 0,
			'PromoterEvents': 0,
			'PromoterEventsActive': 0
		};
		setTimeout(() => {
			this.socketClient[0].emit('promoter-create', req);
		}, this.randTimeout());
	}

	fetch(id) {
		this.socketClient[0].emit('promoter-fetch', id);
	}

	updateError(id) {

	}

	update(id) {
		const req = {
			'PromoterID': id,
			'PromoterName': 'Event Name Updated',
			'PromoterCity': 'Wien',
		};
		this.socketClient[0].emit('promoter-update', req);
	}

	delete(id) {
		this.socketClient[0].emit('promoter-delete', id);
	}

}

const promoter = new Promoter();
promoter.create();
