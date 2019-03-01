var LogoutToken = null;

function connect(socket) {
	socket.on('account-login', function(res) {
		console.log(res);
		$('#Login').hide();
		$('#LogoutToken').hide();
		$('#Logout').show();
	});

	socket.on('account-login-err', function(res) {
		console.log('err =>', res);
		$('#Login').show();
		$('#LogoutToken').hide();
		$('#Logout').hide();
	});

	socket.on('account-logout', function(res) {
		console.log(res);
		$('#Logout').hide();
		$('#LogoutToken').hide();
		$('#Login').show();
	});

	socket.on('account-logout-token', function(res) {
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

	socket.on('account-logout-token-expired', function(res) {
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
		socket.emit('account-login', data);
	});

	$('#LogoutButton').click(function() {
		socket.emit('account-logout');
	});

	$('#LogoutTokenButton').click(function() {
		socket.emit('account-logout-token', LogoutToken);
	});

}
