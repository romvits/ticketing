import Io from 'socket.io';
import randtoken from 'rand-token';
import Helpers from './helpers';
import _ from 'lodash';

import SocketTranslation from './socket_translation';

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

			this.onSetIntern(client);
			this.onSetEvent(client);
			this.onSetEventSubdomain(client);
			this.onSetLanguage(client);

			new SocketTranslation(client);

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
				intern: false,
				User: null,
				Event: null,
				ShoppingCart: null
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
	 * set if connection is internal (administration zone)
	 * only allowed for connection which are logged in and has 'UserType' = 'admin' | 'promoter'
	 * @example
	 * socket.on('set-intern', (res)=>{console.log(res);}); // set state of connection ("callback")
	 * socket.on('set-intern-err', (err)=>{console.log(err);}); // set state of connection error ("callback")
	 * socket.emit('set-intern', true | false); // sets the actual state of connection
	 * @param client {Object} socket.io connection object
	 */
	onSetIntern(client) {
		const evt = 'set-intern';
		client.on(evt, (state) => {
			client.userdata.intern = false;
			if (client.userdata.User) {
				let table = 'memClientConn';
				let where = {ClientConnID: client.id};
				let data = {ClientConnType: 'page'};
				if (state && client.userdata.User.UserType === null) {
					client.emit(evt + '-err', false);
					this.logSocketError(client.id, evt + '-err', 'user with ID: \'' + client.userdata.User.UserID + '\' is not allowed to set intern TRUE');
				} else {
					data.ClientConnType = client.userdata.User.UserType;
					DB.promiseUpdate(table, data, where).then(res => {
						this.logSocketMessage(client.id, evt, state);
						client.userdata.intern = true;
						client.emit(evt, state);
					}).catch((err) => {
						client.emit(evt + '-err', err);
						this.logSocketError(client.id, evt + '-err', err);
					});
				}
			} else {
				client.emit(evt + '-err', false);
				this.logSocketError(client.id, evt + '-err', 'user not logged in');
			}
		});
	}

	/**
	 * set actual event by ID and join room for broadcast socket-server event EVENT´S to all users in this event
	 * @example
	 * socket.on('set-event', (res)=>{console.log(res);}); // the event for this client was set
	 * socket.on('set-event-err', (err)=>{console.log(err);}); // the event was not set a error occurred
	 * socket.emit('set-event', EventSubdomain); // sets the actual event for this connected client
	 * @param client {Object} socket.io connection object
	 */
	onSetEvent(client) {
		const evt = 'set-event';
		client.on(evt, EventID => {
			let table = 'innoEvent';
			let fields = null;
			let where = {EventID: EventID};
			if (EventID) {
				DB.promiseSelect(table, fields, where).then(res => {
					if (_.size(res)) {
						this.logSocketMessage(client.id, evt, EventID);
						client.userdata.Event = res[0];
						client.join(client.userdata.Event.EventID); // join room for this event (for broadcast to all users in this room/event)
						client.emit(evt, true);
					} else {
						client.userdata.Event = null;
						client.emit(evt, false);
						this.logSocketError(client.id, evt + '-err', 'no event with ID ' + EventID + ' available!');
					}
				}).catch((err) => {
					client.emit(evt + '-err', err);
					this.logSocketError(client.id, evt + '-err', err);
				});
			} else {
				this.logSocketMessage(client.id, evt, null);
				client.userdata.Event = null;
			}
		});
	}

	/**
	 * set actual event by Subdomain and join room for broadcast socket-server event EVENT´S to all users in this event
	 * @example
	 * socket.on('set-event-subdomain', (res)=>{console.log(res);}); // the event for this client was set
	 * socket.on('set-event-subdomain-err', (err)=>{console.log(err);}); // the event was not set a error occurred
	 * socket.emit('set-event-subdomain', EventSubdomain); // sets the actual event for this connected client
	 * @param client {Object} socket.io connection object
	 */
	onSetEventSubdomain(client) {
		const evt = 'set-event-subdomain';
		client.on(evt, EventSubdomain => {
			let table = 'innoEvent';
			let fields = null;
			let where = {EventSubdomain: EventSubdomain};
			if (EventSubdomain) {
				DB.promiseSelect(table, fields, where).then(res => {
					if (_.size(res)) {
						this.logSocketMessage(client.id, evt, EventSubdomain);
						client.userdata.Event = res[0];
						client.join(client.userdata.Event.EventID); // join room for this event (for broadcast to all users in this room/event)
						client.emit(evt, true);
					} else {
						client.userdata.Event = null;
						client.emit(evt, false);
						this.logSocketError(client.id, evt + '-err', 'no event with Subdomain ' + EventSubdomain + ' available!');
					}
				}).catch((err) => {
					client.emit(evt + '-err', err);
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
			client.userdata.LangCode = LangCode;
			DB.promiseUpdate('memClientConn', {ClientConnLangCode: LangCode}, {ClientConnID: client.id}).then(res => {
				this.logSocketMessage(client.id, evt, LangCode);
				client.emit(evt, true);
			}).catch(err => {
				client.emit(evt + '-err', err);
				this.logSocketError(client.id, evt + '-err', 'error set language');
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
