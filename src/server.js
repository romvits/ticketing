import Http from './server/http';
import Socket from './server/socket';
import mysql from 'mysql';
import RmLog from "rm-log";
import yaml from 'js-yaml';
import fs from 'fs';

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

let db = null;

function start() {
	db = mysql.createPool(config.db.pool);
	if (db) {
		if (config) {
			log.msg(logPrefix, 'startup in ' + (config.server.sleep / 1000) + ' second(s)');
			setTimeout(() => {
				const http = new Http({
					'log': log,
					'config': config.http
				});
				new Socket({
					'log': log,
					'config': config.socket,
					'http': http.getServer(),
					'db': db
				});
				http.start();
			}, config.server.sleep);
		} else {
			log.err(logPrefix, 'no configuration found');
		}
	} else {
		setTimeout(() => {
			log.err(logPrefix, 'no db connection restart in 5 seconds');
			start();
		}, 5000);
	}
}

start();
