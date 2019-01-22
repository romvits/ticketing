const Https = require('./modules/https');
const Socket = require('./modules/socket');

const https = new Https();
const socket = new Socket(https.getServer());

https.start();
