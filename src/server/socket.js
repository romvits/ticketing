import Io from 'socket.io';
import randtoken from 'rand-token';
import Helpers from './helpers';
import _ from 'lodash';

import SocketEvent from './socket_event';
import SocketFloor from './socket_floor';
import SocketForm from './socket_form';
import SocketList from './socket_list';
import SocketLocation from './socket_location';
import SocketOrder from './socket_order';
import SocketPromoter from './socket_promoter';
import SocketRoom from './socket_room';
import SocketReservation from './socket_reservation';
import SocketScan from './socket_scan';
import SocketSeat from './socket_seat';
import SocketTable from './socket_table';
import SocketTicket from './socket_ticket';
import SocketUser from './socket_user';

import SocketPaymentSystemMPAY24 from './socket_payment_system_mpay24';

/**
 * socket.io server connections<br>
 * <br>
 * IMPORTANT INFORMATION!<br>
 * the examples which are shown here are for client side communication with this server NOT for development<br>
 * @namespace Socket
 * @extends Helpers
 * @example
 * // use this code in your website
 * <html>
 *    <head>
 *        <script type="text/javascript" src="/socket.io/socket.io.js"></script>
 *        <script type="text/javascript">
 *          socket = io('localhost', {
 *              transports: ['websocket']
 *          });
 *        </script>
 *    </head>
 * </html>
 */
class Socket extends Helpers {

	/**
	 * basic class for socket server
	 * @param config {Object} configuration settings from ./../.config.yaml
	 *
	 */
	constructor(config) {
		super();

		if (config) {
			this._config = config;
		}

		this.io = Io(this._config.http);
		this.io.on('connection', client => {

			this.onConnect(client);
			this.onDisconnect(client);


			new SocketEvent(client);
			new SocketFloor(client);
			new SocketList(client);
			new SocketLocation(client);
			new SocketForm(client);
			new SocketOrder(client);
			new SocketPromoter(client);
			new SocketRoom(client);
			new SocketReservation(client);
			new SocketScan(client);
			new SocketSeat(client);
			new SocketTable(client);
			new SocketTicket(client);
			new SocketUser(client);

			new SocketPaymentSystemMPAY24(client);

		});

	}

	/**
	 * connect<br>
	 * websocket client has connected to the server<br>
	 * update count and save connection data to database table `memClientConn`
	 * @param client {Object} socket.io connection object
	 */
	onConnect(client) {

		_.extend(client, {
			userdata: {
				UserID: null,
				ConnToken: randtoken.generate(32),
				LangCode: this._detectLang(client.handshake),
				ShoppingCart: {}
			}
		});

		let values = {
			'ClientConnID': client.id,
			'ClientConnToken': client.userdata.ConnToken,
			'ClientConnLangCode': client.userdata.LangCode,
			'ClientConnAddress': (client.handshake && client.handshake.address) ? client.handshake.address : '',
			'ClientConnUserAgent': (client.handshake && client.handshake.headers && client.handshake.headers["user-agent"]) ? client.handshake.headers["user-agent"] : ''
		};

		DB.promiseInsert('memClientConn', values).then((res) => {
			SOCKET.connections++;
			client.emit('connect', res);
			this.logSocketMessage(client.id, 'client connected', client.handshake);
		}).catch((err) => {
			client.emit('connect-err', err);
			this.logSocketError(client.id, 'connection', err);
		});
	}

	/**
	 * disconnect
	 * websocket client has disconnected from the server<br>
	 * update count and remove connection data from database table `memClientConn`
	 * @param client {Object} socket.io connection object
	 */
	onDisconnect(client) {
		client.on('disconnect', () => {
			DB.promiseDelete('memClientConn', {
				'ClientConnID': client.id
			}).then((res) => {
				SOCKET.connections--;
				this.logSocketMessage(client.id, 'client disconnected');
			}).catch((err) => {
				this.logSocketError(client.id, 'client disconnected', err);
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
	onSetLangCode(client) {
		const evt = 'set-language';
		client.on(evt, (LangCode) => {
			const base = new Base(client.id);
			base.setConnectionLanguage(LangCode).then((res) => {
				client.emit(evt, true);
				this.logSocketMessage(client.id, evt, LangCode);
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


};

module.exports = Socket;
