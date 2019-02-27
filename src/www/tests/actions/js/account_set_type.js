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

	socket.on('account-set-type', function(res) {
		console.log('account-set-type', res);
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
				type: $('#type').val()
			}
			socket.emit('account-set-type', data);
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
