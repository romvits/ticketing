// https://www.wieistmeineip.de/
// www.wtfismyip.com

// https://juristenball.ticketselect.io

function startAction() {

	this.blockTablesAnz = 1000;
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
		//this.$ajapp.order.goNextTab();
	}, 3000);

	window.setTimeout(() => {
		let tables = $.find('.tischEl');
		let sleeper = 5000;
		let countTables = 0;
		tables.forEach((table) => {
			if (countTables <= this.blockTablesAnz) {
				window.setTimeout(() => {
					console.log('addToWk', table);
					$ajapp.plan.addToWk($(table));
				}, sleeper);
				sleeper = sleeper + 1000;
			}
			countTables++;
		});
	}, 1000);
}

startAction();
// look at this.$ajapp.order.wk


// https://ärzteball.at/kartenverkauf

function startAction() {

	$('#tabs').tabs("select", 0);

	let sleeper = 1000;

	let selectAnz = $('#asplatz');
	selectAnz.append('<option value="5000">5000</option>');
	selectAnz.val(5000);
	$("#asplatz option[value=5000]").attr('selected', 'selected');

	window.setTimeout(() => {
		$('#weiter').click();
		window.setTimeout(() => {
			$.find('.rwahlbtn').forEach((btn) => {
				window.setTimeout(() => {
					btn.click();
					window.setTimeout(() => {
						let room = $(".raum[style$='display: block;']");
						console.warn(room);
						$(room).find('.tablew').each((index, table) => {
							console.log(index, table);
						});
					}, 2000);
				}, sleeper);
				sleeper = sleeper + 10000;
			});
		}, 1000);
	}, 1000);
}

startAction();

