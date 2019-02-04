var logout_token = null;

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
	}, 500);

	socket.on('account-login', function(res) {
		console.log('account-login', res);
		socket.emit('account-list', {});
	});

	socket.on('account-list', function(res) {
		console.log(res);
	});
}

function events() {
// on scroll
// on load
}
