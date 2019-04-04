import Socket from './../socket';
import _ from 'lodash';

class FeList extends Socket {

	constructor() {
		super();

		const runtime = 2000;

		console.log('test runtime ' + runtime);

		setTimeout(() => {
			process.exit(0);
		}, runtime);

		this.socketClient[0].on('list-create', (res) => {

			console.log('list-create', res);

			let id = _.clone(res.data.FloorID);

			/*
			setTimeout(() => {
				this.fetch(id);
			}, 1000);

			setTimeout(() => {
				this.update(id);
			}, 2000);

			setTimeout(() => {
				this.fetch(id);
			}, 3000);

			setTimeout(() => {
				this.delete(id);
			}, 9000);
			*/
		});

		/*
		this.socketClient[0].on('list-fetch', (res) => {
			console.log('list-fetch', res);
		});

		this.socketClient[0].on('list-update', (res) => {
			console.log('list-update', res);
		});

		this.socketClient[0].on('list-delete', (res) => {
			console.log('list-delete', res);
		});
		*/

	}

	create() {
		console.log(this._splitter);
		const req = {
			'ListName': 'Name',
			'ListTable': 'database Table Name',
			'ListPK': 'Name',
			'ListMaskID': 'MaskID',
			'ListLimit': 100,
			'ListJSON': '{"orderby": [{"FieldName1": ""}, {"FieldName2": "desc"}, {"FieldName3": ""}], "editable": 0}',
			'ListColumns': []
		};
		this.socketClient[0].emit('list-create', req);
	}

	fetch(id) {
		console.log(this._splitter);
		this.socketClient[0].emit('list-fetch', id);
	}

	update(id) {
		console.log(this._splitter);
		const req = {
			'FloorID': id,
			'FloorEventID': null,
			'FloorLocationID': null,
			'FloorName': 'FloorName neu',
			'FloorSVG': 'SVG neu'
		};
		this.socketClient[0].emit('list-update', req);
	}

	delete(id) {
		console.log(this._splitter);
		this.socketClient[0].emit('list-delete', id);
	}

}

const feList = new FeList();
feList.create();


