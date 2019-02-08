var logout_token = null;

function connect(socket) {
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
}

function events() {
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

}