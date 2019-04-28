var myform;

function connect(socket) {
	window.setTimeout(() => {
		var data = {
			form_id: 'mock_form',
			id: 28
		}
		socket.emit('form-init', data);
	}, 100);

	socket.on('form-init', function(res) {
		console.log('form-init', res);
		let myForm = new dhtmlXForm("myForm", res.formData);
	});

	socket.on('record-fetch', function(res) {
		console.log('record-fetch', res);
	});

}