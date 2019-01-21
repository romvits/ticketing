var http = require('http');
var url = require('url');
var querystring = require('querystring');
var fs = require('fs');

http.createServer(function(req, res) {
	var pathName = url.parse(req.url).pathname;
	var file = __dirname + '/www' + ((pathName == '/') ? '/index.html' : pathName);
	console.log(file);
	fs.readFile(file, function(err, data) {
		if (err) {
			res.writeHead(404, {'Content-type': 'text/plan'});
			res.write('Page Was Not Found');
			res.end();
		} else {
			res.writeHead(200);
			res.write(data);
			res.end();
		}

	});
}).listen(80);