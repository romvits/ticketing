// https://www.wieistmeineip.de/
// www.wtfismyip.com

// https://juristenball.ticketselect.io

function startAction() {

	let min = 1000;
	let max = 5000;

	window.setTimeout(() => {
		$('#TAB_home').click();

		this.blockTablesAnz = 99999;
		this.blockSeatsAnz = 200;
		$ajapp.order.activateSelling();

		window.setTimeout(() => {
			this.$ajapp.order.goNextTab();
			this.$ajapp.order.wk.sitze_anz = 99999;
		}, 1000);

		window.setTimeout(() => {
			let tab = $('#siztzanz');
			let selectAnz = tab.find('.form-control.ck0');
			selectAnz.append('<option value="' + this.$ajapp.order.wk.sitze_anz + '">' + this.$ajapp.order.wk.sitze_anz + '</option>');
			selectAnz.val(this.$ajapp.order.wk.sitze_anz);
			this.$ajapp.order.kartenSitzeChanged(null, this.$ajapp.order.wk.sitze_anz);
		}, 2000);

		window.setTimeout(() => {
			$('.seatNextBtn').click();
		}, 3000);

		window.setTimeout(() => {
			let tablesAction = [];
			let tables = $.find('.tischEl');
			let sleeper = 5000;
			let countTables = 0;
			let countSeats = 0;
			tables.forEach((table) => {
				let $table = $(table);
				let seats = $table.find('.seatFree');
				if (parseInt(seats.length) > 4) {
					tablesAction.push({
						$table: $table,
						table: table,
						seats: parseInt(seats.length)
					});
				}
			});
			tablesAction.forEach((table) => {

				let x = (Math.random() * (max - min)) + min;

				if (countSeats < this.blockSeatsAnz) {
					window.setTimeout(() => {
						console.log('addToWk', x, table);
						$ajapp.plan.addToWk(table.$table);
					}, sleeper);
					sleeper = sleeper + x;
					countSeats = countSeats + table.seats;
				}
			});
			console.log(countSeats);
		}, 1000);
	}, 5000);
}

startAction();

// look at this.$ajapp.order.wk


// https://ärzteball.at/kartenverkauf

function startAction() {

	$('#tabs').tabs("select", 0);

	let blockTablesAnz = 50;
	let countTables = 0;

	let selectAnz = $('#asplatz');
	selectAnz.append('<option value="5000">5000</option>');
	selectAnz.val(5000);
	$('#asplatz option[value=5000]').attr('selected', 'selected');
	$.rw.setAnzSP(5000);

	window.setTimeout(() => {
		$('#tabs').tabs("select", 1);
		let sleeper = 1000;
		window.setTimeout(() => {
			$.find('.rwahlbtn').forEach((btn) => {
				window.setTimeout(() => {
					btn.click();
					window.setTimeout(() => {
						let room = $(".raum[style$='display: block;']");
						let tables = $(room).find('.tablew');
						console.warn(room);
						console.warn(tables);
						tables.each((index, table) => {
							if (countTables < blockTablesAnz) {
								console.log(index, table);
								table.click();
								countTables++;
							}
						});
					}, 2000);
				}, sleeper);
				sleeper = sleeper + 10000;
			});
		}, 1000);
	}, 1000);
}

startAction();

