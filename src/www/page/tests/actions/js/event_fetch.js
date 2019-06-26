function connect(socket) {
	window.setTimeout(() => {
		socket.emit('register', {'UserType': 'api-tests'});
	}, 100);
	window.setTimeout(() => {
		var data = {
			UserEmail: 'admin@admin.tld',
			UserPassword: cryptPassword('admin')
		}
		socket.emit('user-login', data);
	}, 500);

	socket.on('user-login', function(res) {
		console.log('user-login', res);
	});

	socket.on('event-fetch', function(res) {
		console.log(res);
		$('#EventData').html(JSON.stringify(res));
	});

}

function events() {
	$('#FetchButton').click(function() {
		fetch();
	});

}

function fetch() {
	socket.emit('event-fetch', $('#EventID').val());
}
