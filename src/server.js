'use strict';

import express from 'express';
import http from 'http';
import SocketIO from 'socket.io';
import compression from 'compression';
import Log from 'rm-log';

/**
 * Basic Server Class
 * @author Roman Marlovits <roman.marlovits@gmail.com>
 * @version 0.0.1
 * @module Server
 */
class Server {

	/**
	 * Starts the Express Server and the socket.io Server
	 */
	constructor() {
		const app = express();
		const server = http.Server(app);
		const io = new SocketIO(server);
		const port = process.env.PORT || 80;
		const log = new Log();
		const publicPath = __dirname + '/public';

		let users = [];
		let sockets = {};


		app.use(compression({}));
		app.use(express['static'](publicPath));

		app.use(function (req, res, next) {
			//console.log(req, res);
			log.msg('info', 'publicPath: ' + publicPath);
			next();
		});

		io.on('connection', (socket) => {
			let nick = socket.handshake.query.nick;
			let currentUser = {
				id: socket.id,
				nick: nick
			};

			if (findIndex(users, currentUser.id) > -1) {
				log.msg('info', 'User ID is already connected, kicking.');
				socket.disconnect();
			} else if (!validNick(currentUser.nick)) {
				socket.disconnect();
			} else {
				console.log('[INFO] User ' + currentUser.nick + ' connected!');
				sockets[currentUser.id] = socket;
				users.push(currentUser);
				io.emit('userJoin', {nick: currentUser.nick});
				console.log('[INFO] Total users: ' + users.length);
			}

			socket.on('ding', () => {
				socket.emit('dong');
			});

			socket.on('disconnect', () => {
				if (findIndex(users, currentUser.id) > -1) users.splice(findIndex(users, currentUser.id), 1);
				console.log('[INFO] User ' + currentUser.nick + ' disconnected!');
				socket.broadcast.emit('userDisconnect', {nick: currentUser.nick});
			});

			socket.on('userChat', (data) => {
				let _nick = sanitizeString(data.nick);
				let _message = sanitizeString(data.message);
				let date = new Date();
				let time = ("0" + date.getHours()).slice(-2) + ("0" + date.getMinutes()).slice(-2);

				console.log('[CHAT] [' + time + '] ' + _nick + ': ' + _message);
				socket.broadcast.emit('serverSendUserChat', {nick: _nick, message: _message});
			});
		});

		server.listen(port, () => {
			log.msg('info', 'Listening on *:' + port);
			log.msg('info', 'publicPath: ' + publicPath);
		});
	}
}

new Server();

