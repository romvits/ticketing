function connect(socket) {
	window.setTimeout(() => {
		socket.emit('register', {'UserType': 'api-tests'});
	}, 100);
	window.setTimeout(() => {
		var data = {
			UserEmail: 'admin@admin.tld',
			UserPassword: md5('admin')
		}
		socket.emit('account-login', data);
	}, 500);

	socket.on('account-login', function(res) {
		console.log('account-login', res);
	});

	socket.on('account-fetch', function(res) {
		console.log(res);
		$('#UserEmail').val(res.UserEmail);
		$('#UserFirstname').val(res.UserFirstname);
		$('#UserLastname').val(res.UserLastname);
		$('#UserType').val(res.UserType);
	});

	socket.on('account-update', function(res) {
		console.log(res);
		$('#UserID').val('')
		$('#UserEmail').val('');
		$('#UserFirstname').val('');
		$('#UserLastname').val('');
		$('#UserType').val('');
	});
}

function events() {
	$('#FetchButton').click(function() {
		fetch();
	});

	$('#SaveButton').click(function() {
		if (UserID) {
			var data = {
				UserID: $('#UserID').val(),
				UserEmail: $('#UserEmail').val(),
				UserFirstname: $('#UserFirstname').val(),
				UserLastname: $('#UserLastname').val(),
				UserType: $('#UserType').val(),
			}
			socket.emit('account-update', data);
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
