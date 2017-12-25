import url from 'url';
import path from 'path';
import fs from 'fs';
import Log from "rm-log";

const log = new Log();
const publicPath = __dirname + '/public';
const mimeTypes = {
	"html": "text/html",
	"jpeg": "image/jpeg",
	"jpg": "image/jpeg",
	"png": "image/png",
	"gif": "image/gif",
	"ico": "image/x-icon",
	"js": "application/javascript",
	"mjs": "application/javascript",
	"map": "application/javascript",
	"io": "application/javascript",
	"css": "text/css",
	"woff2": "font/woff2"
};

export default class Request {

	constructor(config) {
		this.config = config;
	}

	received(req, res, next) {

		let uri = url.parse(req.url).pathname;
		let basename = path.basename(uri);
		let file = path.join(publicPath + uri);
		file = basename && basename.indexOf('.') != -1 ? file : file + '/index.html';

		fs.exists(file, exists => {

			if (path.basename(file) != "config.html") {
				if (!exists) {
					res.writeHead(200, {'Content-Type': 'text/plain'});
					res.write('404 Not Found\n');
					log.err('err ', "FNF: " + file);
					res.end();
				} else {
					let mimeType = mimeTypes[path.extname(file).split(".")[1]];
					if (mimeType) {
						res.setHeader("Content-Type", mimeType);
						res.writeHead(200);
						let fileStream = fs.createReadStream(file);
						fileStream.pipe(res);
						log.msg('err ', file + ' (' + mimeType + ')');
					} else {
						log.err('err ', "MIME: " + path.extname(file).split(".")[1]);
					}
				}
			} else {
				let mimeType = 'text/json';
				res.setHeader("Content-Type", mimeType);
				res.setHeader("Access-Control-Allow-Origin", "*");
				res.end(JSON.stringify({
					wss: this.config.wss
				}));
				//log.msg(logPrefixHTTP, file + ' (' + mimeType + ')');
			}
			return;
		});
	}
}