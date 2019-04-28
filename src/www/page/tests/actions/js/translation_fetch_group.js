function connect(socket) {
	window.setTimeout(() => {
		socket.emit('register', {'type': 'api-tests'});
	}, 100);

	socket.on('register', function(res) {
		socket.emit('language-fetch');
	});

	socket.on('language-fetch', function(res) {
		var $select = $('#LangCode');
		_.each(res, function(lang) {
			var $option = $('<option value="' + lang.LangCode + '">' + lang.de + '</option>');
			$select.append($option);
		});
	});

	socket.on('translation-fetch-group', function(res) {
		console.log('translation-fetch-group', res);
	});
}

function events() {
	$('#FetchButton').click(function() {
		var data = {
			LangCode: $('#LangCode').val().substr(0, 2),
			TransGroupID: $('#TransGroupID').val()
		}
		socket.emit('translation-fetch-group', data);
	});
}
