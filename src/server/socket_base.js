import Helpers from './helpers';
import randtoken from 'rand-token';
import Base from './modules/base/base'

/**
 * basic events
 * @public
 * @class
 * @memberof Socket
 */
class SocketBase extends Helpers {

	/**
	 * constructor for base socket events<br>
	 * @param client {Object} socket.io connection object
	 */
	constructor(client) {
		super();
		this._client = client;
		this.onConnect();
		this.onDisconnect();
		this.onSetLangCode();
	}

	/**
	 * connection<br>
	 * a new websocket client has connected to the server<br>
	 * update count and save connection data to database table `memClientConn`
	 * @param client {Object} socket.io connection object
	 */
	onConnect() {

		this._client.userdata = {
			UserID: null,
			ConnToken: randtoken.generate(32),
			LangCode: this._detectLang(this._client.handshake)
		}

		let values = {
			'ClientConnID': this._client.id,
			'ClientConnToken': this._client.userdata.ConnToken,
			'ClientConnLangCode': this._client.userdata.LangCode,
			'ClientConnAddress': (this._client.handshake && this._client.handshake.address) ? this._client.handshake.address : '',
			'ClientConnUserAgent': (this._client.handshake && this._client.handshake.headers && this._client.handshake.headers["user-agent"]) ? this._client.handshake.headers["user-agent"] : ''
		};

		const base = new Base(this._client.id, this._client.userdata.UserID);
		base.connection(values).then(() => {
			this._clients++;
			this.logSocketMessage(this._client, 'client connected', this._client.handshake);
		}).catch((err) => {
			this.logSocketError(this._client, 'connection', err);
		});
	}

	/**
	 * disconnect<br>
	 * client disconnected from server
	 * reduce number of connections and delete entry from database table `memClientConn`
	 * @param client {Object} socket.io connection object
	 */
	onDisconnect() {
		const evt = 'disconnect';
		this._client.on(evt, () => {
			const base = new Base(this._client.id, this._client.userdata.UserID);
			base.disconnect().then(() => {
				this._clients--;
				this.logSocketMessage(this._client, evt);
			}).catch((err) => {
				this.logSocketError(this._client, evt, err);
			});
		});
	}

	/**
	 * set language for connected client<br>
	 * available language are stored in database table `feLang`
	 * @example
	 * socket.on('set-language', (res)=>{console.log(res);}); // the language for this client was set
	 * socket.emit('set-language', langCode); // sets the actual language for this connected client
	 * @param client {Object} socket.io connection object
	 */
	onSetLangCode() {
		const evt = 'set-language';
		this._client.on(evt, (LangCode) => {
			const base = new Base(this._client.id, this._client.userdata.UserID);
			base.setConnectionLanguage(LangCode).then((res) => {
				this._client.emit(evt, true);
				this.logSocketMessage(this._client, evt, LangCode);
			}).catch((err) => {
				console.log(err);
			});
		});
	}

	/**
	 * detect browser language from connection handshake object
	 * @param handshake
	 * @returns {string}
	 * @private
	 */
	_detectLang(handshake) {
		let LangCode = 'en-gb';
		if (handshake && handshake.headers && handshake.headers["accept-language"]) {
			LangCode = handshake.headers["accept-language"];
		}
		return LangCode.toLowerCase().substr(0, 5);
	}


}

module.exports = SocketBase;
