function connect(socket) {
	window.setTimeout(() => {
		socket.emit('register', {'type': 'api-tests'});
	}, 100);

	socket.on('account-create', function(err) {
		if (!err) {
			console.log("account created");
		} else {
			console.warn(err)
		}
	});
}

function events() {
	$('#save').click(function() {
		if ($('#password').val() == $('#password_check').val()) {
			var data = {
				email: $('#email').val(),
				password: cryptPassword($('#password').val()),
				firstname: $('#firstname').val(),
				lastname: $('#lastname').val()
			}
			socket.emit('account-create', data);
		} else {
			alert("check passwords!");
		}
	});
}
