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
		if ($('#UserPassword').val() == $('#UserPasswordCheck').val()) {
			var data = {
				UserEmail: $('#UserEmail').val(),
				UserPassword: cryptPassword($('#UserPassword').val()),
				UserFirstname: $('#UserFirstname').val(),
				UserLastname: $('#UserLastname').val(),
				UserType: $('#UserType').val()
			}
			socket.emit('account-create', data);
		} else {
			alert("check passwords!");
		}
	});
}
