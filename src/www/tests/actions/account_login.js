$(function() {
	var socket = io('localhost');
	var logout_token = null;

	socket.on('disconnect', function() {
		$('#logout').hide();
		$('#logout_token').hide();
		$('#login').show();
	});

	socket.on('connect', function() {
		window.setTimeout(() => {
			socket.emit('register', {'type': 'api-tests'});
		}, 100);
	});

	socket.on('account-login', function(res) {
		console.log(res);
		$('#login').hide();
		$('#logout_token').hide();
		$('#logout').show();
	});

	socket.on('account-logout', function(res) {
		console.log(res);
		$('#logout').hide();
		$('#logout_token').hide();
		$('#login').show();
	});

	socket.on('account-logout-token', function(res) {
		console.log(res);
		$('#login').hide();
		$('#logout').hide();
		$('#logout_token').show();
		logout_token = res;
	});

	socket.on('account-logout-token-expired', function(res) {
		console.log(res);
		$('#logout').hide();
		$('#logout_token').hide();
		$('#login').show();
	});

	socket.on('err', function(err) {
		console.warn(err);
		if (err.message) {
			alert(err.message);
		}
	});

	$('#login_button').click(function() {
		var data = {
			email: $('#email').val(),
			password: md5($('#password').val())
		}
		socket.emit('account-login', data);
	});

	$('#logout_button').click(function() {
		socket.emit('account-logout');
	});

	$('#logout_token_button').click(function() {
		socket.emit('account-logout-token', logout_token);
	});

});
