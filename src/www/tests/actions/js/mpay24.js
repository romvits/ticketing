function connect(socket) {

	window.setTimeout(() => {
		socket.emit('payment-system-mpay24-init');
	}, 1000);

	socket.on('payment-system-mpay24-init', function(location) {
		console.log(location);
		var iframe = document.getElementById('payment');
		iframe.src = location;
	});

	var button = document.getElementById('pay');
	button.addEventListener('click', function() {
		socket.emit('payment-system-mpay24-pay');
	});

}