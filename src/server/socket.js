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
import SocketUserShoppingCart from './socket_user_shopping_cart';

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

			this.onSetEvent(client);
			this.onSetLanguage(client);

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
			new SocketUserShoppingCart(client);

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
				ConnToken: randtoken.generate(32),
				LangCode: this._detectLang(client.handshake),
				User: null,
				Event: null,
				Order: null
			}
		});

		let values = {
			ClientConnID: client.id,
			ClientConnToken: client.userdata.ConnToken,
			ClientConnLangCode: client.userdata.LangCode,
			ClientConnSubdomain: (client.handshake && client.handshake.headers && client.handshake.headers.host) ? client.handshake.headers.host.split('.')[0] : 'www',
			ClientConnAddress: (client.handshake && client.handshake.address) ? client.handshake.address : '',
			ClientConnUserAgent: (client.handshake && client.handshake.headers && client.handshake.headers["user-agent"]) ? client.handshake.headers["user-agent"] : ''
		};

		DB.promiseInsert('memClientConn', values).then((res) => {
			SOCKET.connections++;
			client.emit('connect', res);
			this.logSocketMessage(client.id, 'client connected', values.ClientConnSubdomain + ' => ' + client.handshake.time + ' => ' + client.handshake.address);
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
	 * set actual event by Subdomain and join room for broadcast socket-server event EVENT´S to all users in this event
	 * @example
	 * socket.on('set-event', (res)=>{console.log(res);}); // the event for this client was set
	 * socket.on('set-event-err', (err)=>{console.log(err);}); // the event was not set a error occurred
	 * socket.emit('set-event', EventSubdomain); // sets the actual event for this connected client
	 * @param client {Object} socket.io connection object
	 */
	onSetEvent(client) {
		const evt = 'set-event';
		client.on(evt, (EventSubdomain) => {
			let table = 'innoEvent';
			let fields = null;
			let where = {EventSubdomain: EventSubdomain};
			if (EventSubdomain) {
				DB.promiseSelect(table, fields, where).then(res => {
					if (_.size(res)) {
						client.userdata.Event = res[0];
						client.join(client.userdata.Event.EventID); // join room for this event (for broadcast to all users in this room/event)
						client.emit('set-event', true);
						this.logSocketMessage(client.id, evt, res[0]);
					} else {
						client.userdata.Event = null;
						client.emit('set-event', false);
						this.logSocketError(client.id, evt + '-err', 'no event with Subdomain ' + EventSubdomain + ' available!');
					}
				}).catch((err) => {
					client.emit('set-event-err', err);
					this.logSocketError(client.id, evt + '-err', err);
				});
			} else {
				this.logSocketMessage(client.id, evt, null);
				client.userdata.Event = null;
			}
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
	onSetLanguage(client) {
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
