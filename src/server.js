import Http from './modules/http';
import Socket from './modules/socket';
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
			'db': mysql.createPool(config.db.pool)
		});
		http.start();
	}, config.server.sleep);
}
