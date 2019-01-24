import fs from 'fs';
import http from 'http';
import https from 'https';
import RmLog from 'rm-log';
import mime from 'mime';

const log = new RmLog();

class Https {
	constructor() {
		const documentRoot = __dirname + '/../www';
		this._server = https.createServer({
			key: fs.readFileSync('/etc/ssl/certs/localhost.key', 'utf8'),
			cert: fs.readFileSync('/etc/ssl/certs/localhost.cert', 'utf8')
		});

		this._server.on('request', (req, res) => {
			let url = (req.url !== '/') ? req.url : '/index.html';
			let encoding = 'utf8';
			switch (url) {
				case "/favicon.ico":
					encoding = '';
					break;
				default:
					break;
			}
			try {
				let file = fs.readFileSync(documentRoot + url, encoding);
				res.setHeader("Content-Type", mime.getType(documentRoot + url));
				log.msg("HTTP(s)", req.url);
				res.writeHead(200);
				res.end(file);
			} catch (e) {
				log.err("HTTP(s)", req.url);
				res.writeHead(404);
				res.end()
			}
		});
	}

	getServer() {
		return this._server;
	}

	start() {
		this._server.listen(443);
		this.startRedirect();
	}

	startRedirect() {
		http.createServer().on('request', (req, res) => {
			log.msg("HTTP   ", req.url);
			res.writeHead(302, {
				'Location': 'https://' + req.headers.host + req.url
			});
			res.end();
		}).listen(80);
	}
};

module.exports = Https;
