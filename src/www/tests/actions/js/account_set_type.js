function connect(socket) {
	window.setTimeout(() => {
		socket.emit('register', {'type': 'api-tests'});
	}, 100);
	window.setTimeout(() => {
		var data = {
			UserEmail: 'admin@admin.tld',
			UserPassword: cryptPassword('admin')
		}
		socket.emit('account-login', data);
	}, 500);

	socket.on('account-set-type', function(res) {
		console.log('account-set-type', res);
	});
}

function events() {
	$('#fetch').click(function() {
		fetch();
	});

	$('#save').click(function() {
		if (UserID) {
			var data = {
				UserID: $('#UserID').val(),
				UserType: ($('#UserType').val()) ? $('#UserType').val() : null
			}
			socket.emit('account-set-type', data);
		} else {
			alert("no UserID is set!");
		}
	});
}


function fetch() {
	var data = {
		UserID: $('#UserID').val()
	}
	socket.emit('account-fetch', data);
}
