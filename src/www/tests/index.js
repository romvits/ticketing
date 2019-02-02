$(function() {
	var socket = io('localhost');

	socket.on('disconnect', function() {
	});

	socket.on('register', function(items) {
		var html = '';
		_.each(items, function(item) {
			html += '<li><a href="actions/' + item + '">' + item + '</a></li>';
		});
		$(document).find('ul').html(html);
	});

	socket.on('connect', function() {
		window.setTimeout(() => {
			socket.emit('register', {'type': 'api-tests'});
		}, 500);

		/*
		socket.on('login', function(res) {
			console.log('on', res);
			var html = '' + JSON.stringify(res) + '<br/>';
			$('div').html(html);
		});

		socket.on('mock_data', function(res) {
			console.log('on', res);
		});

		socket.on('err', function(err) {
			console.warn('err', err);
			$('div').html(JSON.stringify(err));
		});


		$('select').change(function(evt, val) {
			switch ($(evt.currentTarget).val()) {
				case 'login':
					$('textarea').val('{"username": "admin", "password": "admin"}')
					break;
				case 'list':
					$('textarea').val('{"username": "admin", "password": "admin"}')
					break;
				case 'mock_data':
					$('textarea').val('{"orderby": "last_name"}')
					break;
				default:
			}
		});

		$('button').click(function() {
			var evt = $('select').val();
			var val = $('textarea').val();
			if (val) {
				var json = JSON.parse(val);
				console.log('emit', evt, json);
				socket.emit(evt, json);
			}
		});
		*/

	});
});
