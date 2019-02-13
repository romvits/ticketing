var myform;

function connect(socket) {
	window.setTimeout(() => {
		socket.emit('register', {'type': 'api-tests'});
	}, 100);
	window.setTimeout(() => {
		var data = {
			email: 'admin@admin.tld',
			password: md5('admin')
		}
		socket.emit('account-login', data);
	}, 150);

	socket.on('account-login', function(res) {
		console.log('account-login', res);
		var data = {
			form_id: 'mock_form',
			id: 28
		}
		socket.emit('form-init', data);
	});

	socket.on('form-init', function(res) {
		console.log('form-init', res);
		let myForm = new dhtmlXForm("myForm", res.formData);
	});

	socket.on('record-fetch', function(res) {
		console.log('record-fetch', res);
	});

}