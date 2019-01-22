import fs from 'fs';
import https from 'https';
import RmLog from 'rm-log';
import mime from 'mime';

const log = new RmLog();

class Https {
	constructor() {
		const documentRoot = __dirname + '/../www';
		this._server = https.createServer({
			key: fs.readFileSync(__dirname + '/../ssl/privatekey.pem', 'utf8'),
			cert: fs.readFileSync(__dirname + '/../ssl/certificate.pem', 'utf8')
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
	}
};

module.exports = Https;
