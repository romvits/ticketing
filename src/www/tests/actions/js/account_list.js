var myLayout, myCell, myGrid, columns, pk, total_count, json, orderby, orderdesc, mask_id;

function connect(socket) {
	window.setTimeout(() => {
		socket.emit('register', {'type': 'api-tests'});
	}, 100);
	window.setTimeout(() => {
		var data = {
			email: 'admin@admin.tld',
			password: cryptPassword('admin')
		}
		socket.emit('account-login', data);
	}, 150);

	socket.on('account-login', function(res) {
		console.log('account-login', res);
		var data = {
			list_id: 'user'
		}
		socket.emit('list-init', data);
	});

	socket.on('list-init', function(res) {
		console.log(res);

		pk = res.pk;
		mask_id = res.mask_id;
		columns = [];

		var total_count = res.count;
		var json = res.json;
		var limit = res.limit;


		myLayout = new dhtmlXLayoutObject(document.body, "1C");

		myCell = myLayout.cells('a');

		myGrid = myCell.attachGrid();

		var header = 'ln';
		var initWidths = '100';
		var colTypes = 'ro';
		var footer = total_count + ' record(s)';

		_.each(json.columns, function(col, id) {
			columns.push(col);
			myGrid.setColumnId(id + 1, col.name);
			header += ',' + col.label;
			colTypes += ',' + ((col.editable) ? 'edtxt' : 'ro');
			initWidths += ',' + col.width;
			footer += ',#cspan';
		});

		console.log(colTypes);

		myGrid.attachFooter(footer);

		myGrid.setImagePath("./codebase/imgs/");
		myGrid.setHeader(header);
		myGrid.setInitWidths(initWidths);
		myGrid.setColTypes(colTypes);
		myGrid.enableSmartRendering(true, limit);
		myGrid.enablePreRendering(limit);
		myGrid.setEditable(true);

		function fetch() {
			let stateOfView = myGrid.getStateOfView();
			socket.emit('list-fetch', {
				list_id: 'user',
				from: stateOfView[0],
				orderby: (typeof orderby != 'undefined') ? orderby : null,
				orderdesc: (typeof orderdesc != 'undefined') ? orderdesc : false,
			});
		}

		var fetch_debounced = _.debounce(fetch, 100);

		myGrid.attachEvent('onScroll', function(sLeft, sTop) {
			//myCell.progressOn();
			fetch_debounced();
		});

		myGrid.attachEvent("onHeaderClick", function(ind, obj) {
			if (ind) {
				//myCell.progressOn();
				if (orderby == columns[ind - 1].name) {
					orderdesc = (orderdesc) ? false : true;
				} else {
					orderby = columns[ind - 1].name;
					orderdesc = false;
				}
				fetch();
			}
		});

		myGrid.attachEvent('onRowDblClicked', function(rId, cInd) {
			var data = {
				'id': myGrid.getUserData(rId, "id"),
				'mask_id': myGrid.getUserData(rId, "mask_id")
			};
			console.log(data);
			socket.emit('mask-fetch', data);
			return true;
		});

		myGrid.init();

		var data = {
			rows: []
		}
		for (var i = 0; i < total_count; i++) {
			data.rows.push({'id': 'row' + i, 'data': [i + 1]});
		}
		myGrid.parse(data, "json");

		fetch();
	});

	socket.on('list-fetch', function(res) {
		orderby = res.orderby;
		orderdesc = res.orderdesc;

		_.each(columns, function(col, id) {
			if (orderby === col.name) {
				myGrid.setSortImgState(true, id + 1, (orderdesc) ? 'desc' : '');
			}
		});

		let stateOfView = myGrid.getStateOfView();
		var count = stateOfView[0];
		_.each(res.rows, function(row) {
			myGrid.setRowData('row' + count, row);
			myGrid.setUserData('row' + count, "id", row[pk]);
			myGrid.setUserData('row' + count, "mask_id", row[mask_id] ? row[mask_id] : mask_id);
			count++;
		});
		//myCell.progressOff();

	});


}

function events(socket) {
// on scroll
// on load
}
