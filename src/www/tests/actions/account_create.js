$(function() {
	var socket = io('localhost');

	socket.on('disconnect', function() {
	});

	socket.on('connect', function() {
		window.setTimeout(() => {
			socket.emit('register', {'type': 'api-tests'});
		}, 500);
		window.setTimeout(() => {
			socket.emit('account-fetch', {});
		}, 1000);
	});

	socket.on('account-create', function(res) {
		console.log(res);
	});

	socket.on('err', function(err) {
		console.warn(err);
	});


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
});
