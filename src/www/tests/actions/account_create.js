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
	});

	socket.on('account-create', function(res) {
		console.log(res);
	});
}

function events() {
	$('#save').click(function() {
		if ($('#password').val() == $('#password_check').val()) {
			var data = {
				email: $('#email').val(),
				password: md5($('#password').val()),
				firstname: $('#firstname').val(),
				lastname: $('#lastname').val()
			}
			socket.emit('account-create', data);
		} else {
			alert("check passwords!");
		}
	});
}
