import fs from 'fs';
import http from 'http';
import https from 'https';
import url from 'url';
import mime from 'mime';

const logPrefix = 'HTTP(s) ';

class Http {
	constructor(settings) {

		this._log = settings.log;
		this._config = settings.config;

		if (this._config.ssl) {
			this._http = https.createServer({
				key: fs.readFileSync(this._config.ssl.key, 'utf8'),
				cert: fs.readFileSync(this._config.ssl.cert, 'utf8')
			});
		} else {
			this._http = http.createServer();
		}

		const documentRoot = __dirname + '/../www';

		this._http.on('request', (req, res) => {

			let pathname = url.parse(req.url, true).pathname;
			let urlPath = (pathname.slice(-1) !== '/') ? pathname : pathname + 'index.html';
			let encoding = '';
			let file = false;
			try {
				let mimeType = mime.getType(documentRoot + urlPath);
				if (mimeType === 'text/html') {
					encoding = 'utf8';
				}
				if (!file) {
					file = fs.readFileSync(documentRoot + urlPath, encoding);
					res.setHeader("Content-Type", mimeType);
				}
				this._log.msg(logPrefix, urlPath + ' ' + mimeType);
				res.writeHead(200);
				res.end(file);
			} catch (e) {
				this._log.err(logPrefix, urlPath);
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
