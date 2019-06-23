import Socket from '../socket';
import _ from 'lodash';

class Translate extends Socket {

	constructor() {
		super();

		this._data = [
			{Token: '§§TEST', LangCode: 'de-at', Value: 'test', TransID: '', Group: ''},
			{Token: '§§TEST', LangCode: 'de-at', Value: 'test neu', TransID: '', Group: ''},
			{Token: '§§TEST', LangCode: 'de-at', Value: 'yes it works', TransID: '', Group: ''},
			{Token: '§§MAIL_ORDER_CONTENT', LangCode: 'de-at', Value: 'yes it works', TransID: '00', Group: ''}
		]

		const runtime = 5000;
		setTimeout(() => {
			process.exit(0);
		}, runtime);

		console.log('test runtime ' + runtime);

		this.socketClient[0].on('translate-replace', (res) => {
			console.log(this._splitter);
			console.log('translate-replace', res);
		});

		this.socketClient[0].on('translate-replace-err', (err) => {
			console.log(this._splitter);
			console.log('translate-replace-err', err);
		});

	}

	create() {
		setTimeout(() => {
			console.log(this._data[0]);
			this.socketClient[0].emit('translate-replace', this._data[0]);
		}, this.randTimeout());

		setTimeout(() => {
			console.log(this._data[1]);
			this.socketClient[0].emit('translate-replace', this._data[1]);
		}, this.randTimeout() + 1000);

		setTimeout(() => {
			console.log(this._data[2]);
			this.socketClient[0].emit('translate-replace', this._data[2]);
		}, this.randTimeout() + 2000);

		setTimeout(() => {
			console.log(this._data[3]);
			this.socketClient[0].emit('translate-replace', this._data[3]);
		}, this.randTimeout() + 3000);
	}

}

const translate = new Translate();
translate.create();
