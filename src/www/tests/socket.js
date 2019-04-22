var socket;
var lang = 'de-at';

$(function() {
	socket = io(window.location.hostname, {
		transports: ['websocket']
	});

	socket.on('reconnect_attempt', function() {
		socket.io.opts.transports = ['polling', 'websocket'];
	});

	socket.on('connect', function() {
		connect(socket);
		if (typeof events !== 'undefined') {
			events(socket);
		}
	});

	socket.on('register', function(res) {
		if (typeof register !== 'undefined') {
			register(res);
		}
	});

	socket.on('user-logout', function() {
		//window.location.href = '/tests/';
	});

	socket.on('err', function(err) {
		console.warn(err);
		if (err.message) {
			var $err = $('#err');
			if ($err.length) {
				$err.html(err.message);
			} else {
				alert(err.message);
			}
		}
	});

	socket.on('disconnect', function() {
		window.location.reload();
	});

	$('button').mousedown(function() {
		$('#err').html('');
	});

	$('body').append('<div id="err" style="color: red;"></div>');
});
