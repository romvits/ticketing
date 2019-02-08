var mygrid, pk, total_count, json, orderby, orderdesc;

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
			list_id: 'mock_data'
		}
		socket.emit('list-init', data);
	});

	socket.on('list-init', function(res) {
		console.log(res);

		pk = res.pk;
		total_count = res.count;
		json = res.json;
		columns = [];

		mygrid = new dhtmlXGridObject('gridbox');

		var header = '';
		var initWidths = '';
		var colTypes = '';

		var comma = '';
		_.each(json.columns, function(col, id) {
			columns.push(col.name);
			mygrid.setColumnId(id, col.name);
			header += comma + col.name;
			comma = ',';
		});

		mygrid.setImagePath("./codebase/imgs/");
		mygrid.setHeader(header);
		mygrid.setInitWidths("150,250,auto");
		mygrid.setColTypes("ro,ro,ro");
		mygrid.enableSmartRendering(true);
		mygrid.setAwaitedRowHeight(20);

		function fetch() {
			let stateOfView = mygrid.getStateOfView();
			socket.emit('list-fetch', {
				list_id: 'mock_data',
				from: stateOfView[0],
				orderby: (typeof orderby != 'undefined') ? orderby : null,
				orderdesc: (typeof orderdesc != 'undefined') ? orderdesc : false,
			});
		}

		var fetch_debounced = _.debounce(fetch, 100);

		mygrid.attachEvent('onScroll', function(sLeft, sTop) {
			fetch_debounced();
		});

		mygrid.attachEvent("onHeaderClick", function(ind, obj) {
			if (orderby == columns[ind]) {
				orderdesc = (orderdesc) ? false : true;
			} else {
				orderby = columns[ind];
				orderdesc = false;
			}
			fetch();
		});

		mygrid.attachEvent('onRowDblClicked', function(rId, cInd) {
			var id = mygrid.getUserData(rId, "id");
			console.log(id, rId, cInd);
		});

		mygrid.init();

		var data = {
			rows: []
		}
		for (var i = 0; i < total_count; i++) {
			data.rows.push({'id': 'row' + i, 'data': []});
		}

		mygrid.parse(data, "json");

		fetch();
	});

	socket.on('list-fetch', function(res) {
		console.log(res);
		orderby = res.orderby;
		let stateOfView = mygrid.getStateOfView();
		var count = stateOfView[0];
		_.each(res.rows, function(row) {
			mygrid.setRowData('row' + count, row);
			mygrid.setUserData('row' + count, "id", row[pk]);
			count++;
		});

	});


}

function events(socket) {
// on scroll
// on load
}
