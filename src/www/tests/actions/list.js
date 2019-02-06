var mygrid, pk, count, json;

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
	}, 500);

	socket.on('account-login', function(res) {
		console.log('account-login', res);
		var data = {
			list_id: 'mock_data'
		}
		socket.emit('list-init', data);
	});

	socket.on('list-init', function(res) {
		console.log(res);

		pk = res.pk;
		count = res.count;
		json = res.json;

		var header = '';
		var initWidths = '';
		var colTypes = '';

		var comma = '';
		_.each(json, function(col) {
			console.log(col);
			comma = ',';
		});

		mygrid = new dhtmlXGridObject('gridbox');
		mygrid.setImagePath("./codebase/imgs/");
		mygrid.setHeader("Sales,Book title,Author,Price");//the headers of columns
		mygrid.setInitWidths("100,250,150,100");          //the widths of columns
		mygrid.setColTypes("ro,ed,ed,ed");                //the types of columns
		mygrid.init();      //finishes initialization and renders the grid on the page

		var data = {
			list_id: 'mock_data',
			from: 0
		}
		socket.emit('list-fetch', data);
	});

	socket.on('list-fetch', function(res) {
		console.log(res);

		data = {
			rows: [
				{id: 1, data: ["A Time to Kill", "John Grisham", "100"]},
				{id: 2, data: ["Blood and Smoke", "Stephen King", "1000"]},
				{id: 3, data: ["The Rainmaker", "John Grisham", "-200"]}
			]
		};
		mygrid.parse(data, "json");

	});


}

function events(socket) {
// on scroll
// on load
}
