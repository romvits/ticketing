function connect(socket) {
	window.setTimeout(() => {
		socket.emit('register', {'type': 'api-tests'});
	}, 100);
	window.setTimeout(() => {
		var data = {
			UserEmail: 'admin@admin.tld',
			UserPassword: cryptPassword('admin')
		}
		socket.emit('user-login', data);
	}, 500);

	socket.on('user-login', function(res) {
		socket.emit('language-fetch');
	});

	socket.on('language-fetch', function(res) {
		var $select = $('#LangCode');
		_.each(res, function(lang) {
			console.log(lang);
			var $option = $('<option value="' + lang.LangCode + '">' + lang.de + '</option>');
			$select.append($option);
		});
	});

	socket.on('language-set', function(res) {
		console.log('language-settype', res);
	});
}

function events() {
	$('#SaveButton').click(function() {
		var data = {
			LangCode: $('#LangCode').val(),
		}
		socket.emit('language-set', data);
	});
}
