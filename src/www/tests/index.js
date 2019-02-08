function disconnect() {
}

function register(res) {
	var html = '';
	_.each(res, function(item) {
		html += '<li><a href="actions/' + item + '">' + item + '</a></li>';
	});
	$(document).find('ul').html(html);
}

function connect() {
	window.setTimeout(() => {
		socket.emit('register', {'type': 'api-tests'});
	}, 250);

}

function events() {

}