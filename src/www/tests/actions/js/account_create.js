function connect(socket) {
	window.setTimeout(() => {
		socket.emit('register', {'type': 'api-tests'});
	}, 100);

	socket.on('account-create', function(err) {
		if (!err) {
			console.log("account created");
			$('#UserEmail').val('');
			$('#UserPassword').val('');
			$('#UserPasswordCheck').val('');
			$('#UserFirstname').val('');
			$('#UserLastname').val('');
			$('#UserType').val('');
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
				UserType: $('#UserType').val() ? $('#UserType').val() : null
			}
			socket.emit('account-create', data);
		} else {
			alert("check passwords!");
		}
	});
}
