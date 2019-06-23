import Helpers from './helpers';

/**
 * translation events
 * @public
 * @class
 * @memberof Socket
 */
class SocketTranslation extends Helpers {

	/**
	 * constructor for translation socket events<br>
	 * @param client {Object} socket.io connection object
	 */
	constructor(client) {
		super();
		this._client = client;
		this.onReplace();
	}

	/**
	 * create or update translation
	 * @example
	 * socket.on('translate-replace', (res)=>{console.log(res);});
	 * socket.on('translate-replace-err', (err)=>{console.log(err);});
	 * socket.emit('translate-replace', {
	 *	'Token': '§§TOKEN',
	 *	'LangCode': 'de-at',
	 *	'Value': 'TEXT',
	 *	'TransID': 'EventID, TicketID, RoomID, ..., or null',
	 *	'Group': 'existing GroupID from table feTransGroup'
	 * });
	 * @param client {Object} socket.io connection object
	 */
	onReplace(client) {
		const evt = 'translate-replace';
		this._client.on(evt, req => {
			DB.promiseTranslateReplace(req).then(res => {
				this._client.emit(evt, res);
				this.logSocketMessage(this._client.id, evt, res);
			}).catch(err => {
				this._client.emit(evt + '-err', err);
				this.logSocketError(this._client.id, evt, err);
			});
		});
	}

}

module.exports = SocketTranslation;
