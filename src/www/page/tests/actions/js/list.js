var myLayout, myCell, myGrid, columns, pk, total_count, json, orderby, orderdesc, mask_id;

function connect(socket) {
	window.setTimeout(() => {
		socket.emit('list-init', 'mock_data');
	}, 100);
	/*
	window.setTimeout(() => {
		var data = {
			UserEmail: 'admin@admin.tld',
			UserPassword: cryptPassword('admin')
		}
		socket.emit('user-login', data);
	}, 150);
	*/

	/*
	socket.on('user-login', function(res) {
		console.log('user-login', res);
		var data = {
			ListID: 'mock_data'
		}
		socket.emit('list-init', data);
	});
	*/


	socket.on('list-init', function(res) {
		console.log('list-init', res);

		pk = res.pk;
		mask_id = res.mask_id;
		columns = [];

		total_count = res.count;
		var limit = res.limit;

		myLayout = new dhtmlXLayoutObject(document.body, "1C");

		myCell = myLayout.cells('a');
		myCell.setText(res.label);

		myCell.attachToolbar({
			icons_path: "imgs/toolbar/icons/"
		});

		myGrid = myCell.attachGrid();

		var header = 'ln';
		var initWidths = '100';
		var colTypes = 'ro';
		var footer = total_count + ' record(s)';

		_.each(res.columns, function(col, id) {
			columns.push(col);
			myGrid.setColumnId(id + 1, col.name);
			header += ',' + col.label;
			colTypes += ',' + 'ro';
			initWidths += ',' + col.width;
			footer += ',#cspan';
		});
		myGrid.attachFooter(footer);

		myGrid.setImagePath("./codebase/imgs/");
		myGrid.setHeader(header);
		myGrid.setInitWidths(initWidths);
		myGrid.setColTypes(colTypes);
		myGrid.enableSmartRendering(true, limit);
		myGrid.enablePreRendering(limit);

		function fetch() {
			let stateOfView = myGrid.getStateOfView();
			socket.emit('list-fetch', {
				ListID: 'mock_data',
				from: stateOfView[0],
				orderby: (typeof orderby != 'undefined') ? orderby : null,
				orderdesc: (typeof orderdesc != 'undefined') ? orderdesc : false,
			});
		}

		var fetch_debounced = _.debounce(fetch, 0);

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
				for (var i = 0; i < total_count; i++) {
					myGrid.setUserData('row' + i, 'id', null);
					myGrid.setUserData('row' + i, 'mask_id', null);
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
			if (count < total_count) {
				if (!myGrid.getUserData('row' + count, 'id')) {
					myGrid.setRowData('row' + count, row);
					myGrid.setUserData('row' + count, 'id', row[pk]);
					myGrid.setUserData('row' + count, 'mask_id', row[mask_id] ? row[mask_id] : mask_id);
				}
				count++;
			}
		});
		//myCell.progressOff();

	});


}

function events(socket) {
// on scroll
// on load
}
