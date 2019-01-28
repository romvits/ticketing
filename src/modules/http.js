import fs from 'fs';
import http from 'http';
import https from 'https';
import mime from 'mime';

const logPrefix = 'HTTP(s) ';

class Http {
	constructor(settings) {

		this._log = settings.log;
		this._config = settings.config;

		const documentRoot = __dirname + '/../www';

		if (this._config.ssl) {
			this._http = https.createServer({
				key: fs.readFileSync(this._config.ssl.key, 'utf8'),
				cert: fs.readFileSync(this._config.ssl.cert, 'utf8')
			});
		} else {
			this._http = http.createServer();
		}

		this._http.on('request', (req, res) => {
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
				this._log.msg(logPrefix, req.url);
				res.writeHead(200);
				res.end(file);
			} catch (e) {
				this._log.err(logPrefix, req.url);
				res.writeHead(404);
				res.end()
			}
		});
	}

	getServer() {
		return this._http;
	}

	start() {
		this._http.listen(this._config.port);
		if (this._config.ssl) {
			this.startRedirect();
		}
		this._log.msg(logPrefix, 'started at port ' + this._config.port);
	}

	startRedirect() {
		http.createServer().on('request', (req, res) => {
			this._log.msg(logPrefix, req.url);
			res.writeHead(302, {
				'Location': 'https://' + req.headers.host + req.url
			});
			res.end();
		}).listen(80);
	}
};

module.exports = Http;
