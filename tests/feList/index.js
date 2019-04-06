import Socket from './../socket';
import _ from 'lodash';

class FeList extends Socket {

	constructor() {
		super();

		const runtime = 6000;
		setTimeout(() => {
			process.exit(0);
		}, runtime);

		console.log('test runtime ' + runtime);

		this.socketClient[0].on('list-create', (res) => {

			let id = _.clone(res.ListID);

			console.log('list-create', res);

			setTimeout(() => {
				this.init(id);
			}, 1000);

			setTimeout(() => {
				this.fetch(id);
			}, 2000);

			setTimeout(() => {
				this.update(id);
			}, 3000);

			setTimeout(() => {
				this.delete(id);
			}, 5000);
		});

		this.socketClient[0].on('list-init', (res) => {
			console.log('list-init', res);
		});

		this.socketClient[0].on('list-fetch', (res) => {
			console.log('list-fetch', res);
		});

		this.socketClient[0].on('list-update', (res) => {
			console.log('list-update', res);
		});

		this.socketClient[0].on('list-delete', (res) => {
			console.log('list-delete', res);
		});
	}

	create() {
		console.log(this._splitter);
		const req = {
			'ListName': 'Name',
			'ListLabel': '§§Table',
			'ListTable': 'feList',
			'ListPK': 'ListID',
			'ListMaskID': 'MaskID',
			'ListLimit': 100,
			'ListJSON': '{"orderby": [{"ListID": ""}], "editable": 0}',
			'ListColumn': [{
				'ListColumnOrder': 1,
				'ListColumnName': 'ListID',
				'ListColumnType': 'text',
				'ListColumnWidth': 150,
				'ListColumnEditable': 0,
				'ListColumnLabel': '§§Column1',
				'ListColumnJSON': '{}'
			}, {
				'ListColumnOrder': 2,
				'ListColumnName': 'ListName',
				'ListColumnType': 'text',
				'ListColumnWidth': 150,
				'ListColumnEditable': 0,
				'ListColumnLabel': '§§Column2',
				'ListColumnJSON': '{}'
			}, {
				'ListColumnOrder': 3,
				'ListColumnName': 'ListLabel',
				'ListColumnType': 'text',
				'ListColumnWidth': 150,
				'ListColumnEditable': 0,
				'ListColumnLabel': '§§Column3',
				'ListColumnJSON': '{}'
			}]
		};
		this.socketClient[0].emit('list-create', req);
	}

	init(id) {
		console.log(this._splitter);
		this.socketClient[0].emit('list-init', id);
	}

	fetch(id) {
		console.log(this._splitter);
		this.socketClient[0].emit('list-fetch', {"ListID": id, "from": 0, "orderby": null, "orderdesc": false}); // request list rows
	}

	update(id) {
		console.log(this._splitter);
		const req = {
			'ListID': id,
			'ListName': 'Name update',
			'ListLabel': '§§TableUpdate',
			'ListTable': 'feForm',
			'ListPK': 'FormID',
			'ListMaskID': 'feForm',
			'ListLimit': 99,
			'ListJSON': '{"orderby": [{"FieldName4": ""}, {"FieldName5": "desc"}, {"FieldName6": ""}], "editable": 1}',
			'ListColumn': [{
				'ListColumnOrder': 1,
				'ListColumnName': 'Column 1 update',
				'ListColumnType': 'integer',
				'ListColumnWidth': 97,
				'ListColumnEditable': 0,
				'ListColumnLabel': '§§Column4',
				'ListColumnJSON': '{}'
			}, {
				'ListColumnOrder': 2,
				'ListColumnName': 'Column 2 update',
				'ListColumnType': 'datetime',
				'ListColumnWidth': 98,
				'ListColumnEditable': 0,
				'ListColumnLabel': '§§Column5',
				'ListColumnJSON': '{}'
			}, {
				'ListColumnOrder': 3,
				'ListColumnName': 'Column 3 update',
				'ListColumnType': 'colorpicker',
				'ListColumnWidth': 99,
				'ListColumnEditable': 1,
				'ListColumnLabel': '§§Column6',
				'ListColumnJSON': '{}'
			}]
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


