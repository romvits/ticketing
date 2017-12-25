'use strict';

process.title = "ticketingserver";

import express from 'express';
import http from 'http';
import SocketIO from 'socket.io';
import compression from 'compression';
import Log from 'rm-log';
import ini from 'ini';
import fs from 'fs';

import Request from './classes/server/request';
import Socket from './classes/server/socket';

const log = new Log();
const configFile = __dirname + '/config.ini';

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
	constructor(config) {
		const app = express();
		const server = http.Server(app);
		const io = new SocketIO(server);
		const port = process.env.PORT || 8000;
		const request = new Request(config);
		const socket = new Socket(config);


		app.use(compression({}));
		app.use((req, res, next) => {
			request.received(req, res, next);
		});
		io.on('connection', () => {
			socket.received()
		});

		log.msg('info', 'configFile: ' + configFile);
		log.msg('conf', config);

		server.listen(port, () => {
			log.msg('info', 'Listening on *:' + port);
		});
	}
}

new Server(ini.parse(fs.readFileSync(configFile, 'utf-8')));
