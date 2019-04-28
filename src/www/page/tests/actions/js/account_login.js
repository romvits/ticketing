var LogoutToken = null;

function connect(socket) {
	socket.on('user-login', function(res) {
		console.log(res);
		$('#Login').hide();
		$('#LogoutToken').hide();
		$('#Logout').show();
	});

	socket.on('user-login-err', function(res) {
		console.log('err =>', res);
		$('#Login').show();
		$('#LogoutToken').hide();
		$('#Logout').hide();
	});

	socket.on('user-logout', function(res) {
		console.log(res);
		$('#Logout').hide();
		$('#LogoutToken').hide();
		$('#Login').show();
	});

	socket.on('user-logout-token', function(res) {
		console.log(res);
		if (res) {
			$('#Login').hide();
			$('#Logout').hide();
			$('#LogoutToken').show();
		} else {
			$('#Logout').hide();
			$('#LogoutToken').hide();
			$('#Login').show();
		}
		LogoutToken = res;
	});

	socket.on('user-logout-token-expired', function(res) {
		console.log(res);
		$('#Logout').hide();
		$('#LogoutToken').hide();
		$('#Login').show();
	});
}

function events() {
	$('#LoginButton').click(function() {
		var data = {
			UserEmail: $('#UserEmail').val(),
			UserPassword: cryptPassword($('#UserPassword').val())
		}
		socket.emit('user-login', data);
	});

	$('#LogoutButton').click(function() {
		socket.emit('user-logout');
	});

	$('#LogoutTokenButton').click(function() {
		socket.emit('user-logout-token', LogoutToken);
	});

}
