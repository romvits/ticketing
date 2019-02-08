var dhxWins;

var x = 10;
var y = 10;
var w = 300;
var h = 300;


function connect(socket) {
	window.setTimeout(() => {
		socket.emit('register', {'type': 'api-tests'});
	}, 100);
	window.setTimeout(() => {
		var data = {
			email: 'admin@admin.tld',
			password: md5('admin')
		}
		socket.emit('account-login', data);
	}, 150);

	socket.on('account-login', function(res) {
		console.log('account-login', res);
		for (var i = 0; i < 1000; i = i + 100) {
			console.log(i);
			window.setTimeout(function() {
				socket.emit('mask-fetch', {});
			}, i);
		}
	});

	socket.on('mask-fetch', function(res) {
		console.log('mask-fetch', res);

		var id = 'win_' + new Date().getTime();

		x = x + 20;
		y = y + 20;

		dhxWins.createWindow(id, x, y, w, h);
		dhxWins.window(id).setText(id);

	});

	dhxWins = new dhtmlXWindows();

}


