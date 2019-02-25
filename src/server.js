import MySql from './server/db/mysql';
import MsSQL from './server/db/mssql';
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

global.log = new RmLog(config.log);

if (config.server.db === 'mysql') {
	global.db = new MySql(config.mysql);
} else if (config.server.db === 'mssql') {
	global.db = new MsSql(config.mssql);
}

function start() {
	if (config) {
		const http = new Http(config.http);
		new Socket(_.extend(config.socket, {'http': http.getServer()}));
		http.start();
	} else {
		log.err(logPrefix, 'no configuration found');
	}
}

setTimeout(() => {
	global.log.msg(logPrefix, 'sleep ' + (config.server.sleep / 1000) + ' second(s)');
	start();
}, config.server.sleep);
