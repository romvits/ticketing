import Https from './modules/https';
import Socket from './modules/socket';
import RmLog from "rm-log";

const log = new RmLog({'datePattern': 'yyyy/mm/dd HH:MM:ss'});
const logPrefix = 'SERVER  ';

log.msg(logPrefix, 'startup in 1 seconds');

setTimeout(() => {
	const https = new Https();
	new Socket(https.getServer());
	https.start();
}, 1000);
