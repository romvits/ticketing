import Io from 'socket.io';
import Helpers from './helpers';
import numeral from 'numeral';
import _ from 'lodash';
import SmtpClient from './mail/smtp_client';

import SocketBase from './socket_base';
import SocketEvent from './socket_event';
import SocketFloor from './socket_floor';
import SocketForm from './socket_form';
import SocketList from './socket_list';
import SocketLocation from './socket_location';
import SocketOrder from './socket_order';
import SocketPromoter from './socket_promoter';
import SocketRoom from './socket_room';
import SocketScan from './socket_scan';
import SocketSeat from './socket_seat';
import SocketTable from './socket_table';
import SocketTicket from './socket_ticket';
import SocketUser from './socket_user';

/**
 * socket.io server connections<br>
 * <br>
 * IMPORTANT INFORMATION!<br>
 * the examples which are shown here are for client side communication whith this server NOT for development<br>
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

			// initialize a new client connection
			new SocketBase(client);
			new SocketEvent(client);
			new SocketFloor(client);
			new SocketList(client);
			new SocketLocation(client);
			new SocketForm(client);
			new SocketOrder(client);
			new SocketPromoter(client);
			new SocketRoom(client);
			new SocketScan(client);
			new SocketSeat(client);
			new SocketTable(client);
			new SocketTicket(client);
			new SocketUser(client);

		});

	}


};

module.exports = Socket;
