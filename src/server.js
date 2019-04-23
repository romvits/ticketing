import MySql from './server/db/mysql';
import Http from './server/http';
import Socket from './server/socket';
import RmLog from "rm-log";
import yaml from 'js-yaml';
import fs from 'fs';
import _ from 'lodash';

let log, config = null;
const logPrefix = 'SERVER  ';

try {
	config = yaml.safeLoad(fs.readFileSync('./.config.yaml', 'utf8'));
	if (config.log) {
		log = new RmLog(config.log);
		log.msg(logPrefix, config);
	} else {
		config = null;
		console.error('no config for log found.');
	}
} catch (e) {
	console.error(e);
}

global.LOG = new RmLog(config.log);

if (config.server.db === 'mysql') {
	global.DB = new MySql(config.mysql);
}

function start() {
	if (config) {
		const http = new Http(config.http);
		global.SOCKET = new Socket(_.extend(config.socket, {'http': http.getServer()}));
		SOCKET.connections = 0;
		http.start();
	} else {
		log.err(logPrefix, 'no configuration found');
	}
}

setTimeout(() => {
	LOG.msg(logPrefix, 'sleep ' + (config.server.sleep / 1000) + ' second(s)');
	start();
}, config.server.sleep);

