import Helpers from './helpers';
import Scan from './modules/scan/scan'

/**
 * scan events
 * @public
 * @class
 * @memberof Socket
 */
class SocketScan extends Helpers {

	/**
	 * constructor for list socket events<br>
	 * @param client {Object} socket.io connection object
	 */
	constructor(client) {
		super();
		this._client = client;
		this.onCreate();
	}

	/**
	 * create new scan
	 * @param client {Object} socket.io connection object
	 */
	onCreate(client) {
		const evt = 'scan-create';
		this._client.on(evt, (req) => {
			const scan = new Scan(this._client.id);
			scan.create(req).then((res) => {
				this._client.emit(evt, res);
				this.logSocketMessage(this._client.id, evt, res);
			}).catch((err) => {
				this._client.emit(evt + '-err', err);
				this.logSocketError(this._client.id, evt, err);
			});
		});

	}

}

module.exports = SocketScan;
