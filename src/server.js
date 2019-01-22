const Https = require('./modules/https');
const Socket = require('./modules/socket');

/*
const Database = require('./modules/database');
let database = new Database({
	user: 'zak_experte',
	password: 'zak',
	server: 'il-mssql-server',
	database: 'ILMDEV',
	options: {
		encrypt: true // Use this if you're on Windows Azure
	}
});
*/


let https = new Https();
let socket = new Socket(https.getServer());
socket.on('connected', (client) => {
	//database.ils(client);
});

https.start();
