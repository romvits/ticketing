const Https = require('./modules/https');
const Socket = require('./modules/socket');

const https = new Https();
new Socket(https.getServer());

https.start();
