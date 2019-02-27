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

	socket.on('account-fetch', function(res) {
		console.log(res);
		$('#email').val(res.email);
		$('#firstname').val(res.firstname);
		$('#lastname').val(res.lastname);
		$('#type').val(res.type);
	});

	socket.on('account-update', function(res) {
		console.log(res);
		$('#user_id').val('')
		$('#email').val('');
		$('#firstname').val('');
		$('#lastname').val('');
		$('#type').val('');
	});
}

function events() {
	$('#fetch').click(function() {
		fetch();
	});

	$('#save').click(function() {
		if (user_id) {
			var data = {
				user_id: $('#user_id').val(),
				email: $('#email').val(),
				firstname: $('#firstname').val(),
				lastname: $('#lastname').val(),
				type: $('#type').val(),
			}
			socket.emit('account-update', data);
		} else {
			alert("no user_id is set!");
		}
	});
}

function fetch() {
	var data = {
		user_id: $('#user_id').val()
	}
	socket.emit('account-fetch', data);
}
