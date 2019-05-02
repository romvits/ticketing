import mysql from 'mysql';
import _ from 'lodash';
import randtoken from "rand-token";
import dateFormat from 'dateformat';
import fs from 'fs';
import yaml from 'js-yaml';
import readDir from 'readdir';

const config = yaml.safeLoad(fs.readFileSync('./.config.yaml', 'utf8'));
const ballcomplete_settings = config.db;

String.prototype.replaceAll = function(search, replacement) {
	var target = this;
	return target.split(search).join(replacement);
};

function validateEmail(email) {
	var re = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
	return re.test(String(email).toLowerCase());
}

let databases = [
	{
		'db': 'graz_2015',
		'prefix': ['HLW'],
		'promoter': {'ID': '', 'name': 'HLW Schrödinger', 'street': '', 'city': 'Graz', 'zip': '8010', 'countryISO2': 'AT', 'phone1': '', 'phone2': '', 'fax': '', 'homepage': '', 'email': 'office@ticketselect.at',},
		'users': ['333333333333333333333333333333', '111111111111111111111111111111'],
		'location': 6,
		'events': []
	}, {
		'db': 'graz_2015',
		'prefix': ['AKG'],
		'promoter': {'ID': '', 'name': 'Akademisches Gymnasium', 'street': '', 'city': 'Graz', 'zip': '8010', 'countryISO2': 'AT', 'phone1': '', 'phone2': '', 'fax': '', 'homepage': '', 'email': 'office@ticketselect.at',},
		'users': ['333333333333333333333333333333', '111111111111111111111111111111'],
		'location': 4,
		'events': []
	}, {
		'db': 'graz_2015',
		'prefix': ['HIB'],
		'promoter': {'ID': '', 'name': 'BG/BORG HIB Liebenau', 'street': '', 'city': 'Graz', 'zip': '8010', 'countryISO2': 'AT', 'phone1': '', 'phone2': '', 'fax': '', 'homepage': '', 'email': 'office@ticketselect.at',},
		'users': ['333333333333333333333333333333', '111111111111111111111111111111'],
		'location': 4,
		'events': []
	}, {
		'db': 'graz_2015',
		'prefix': ['KIR'],
		'promoter': {'ID': '', 'name': 'BG/BRG Kirchengasse', 'street': '', 'city': 'Graz', 'zip': '8010', 'countryISO2': 'AT', 'phone1': '', 'phone2': '', 'fax': '', 'homepage': '', 'email': 'office@ticketselect.at',},
		'users': ['333333333333333333333333333333', '111111111111111111111111111111'],
		'location': 4,
		'events': []
	}, {
		'db': 'graz_2015',
		'prefix': ['LIC'],
		'promoter': {'ID': '', 'name': 'BG/BRG Lichtenfels', 'street': '', 'city': 'Graz', 'zip': '8010', 'countryISO2': 'AT', 'phone1': '', 'phone2': '', 'fax': '', 'homepage': '', 'email': 'office@ticketselect.at',},
		'users': ['333333333333333333333333333333', '111111111111111111111111111111'],
		'location': 4,
		'events': []
	}, {
		'db': 'graz_2015',
		'prefix': ['SEE'],
		'promoter': {'ID': '', 'name': 'BG/BRG Seebacher', 'street': '', 'city': 'Graz', 'zip': '8010', 'countryISO2': 'AT', 'phone1': '', 'phone2': '', 'fax': '', 'homepage': '', 'email': 'office@ticketselect.at',},
		'users': ['333333333333333333333333333333', '111111111111111111111111111111'],
		'location': 4,
		'events': []
	}, {
		'db': 'graz_2015',
		'prefix': ['BIG'],
		'promoter': {'ID': '', 'name': 'Bischöfliches Gymnasium', 'street': '', 'city': 'Graz', 'zip': '8010', 'countryISO2': 'AT', 'phone1': '', 'phone2': '', 'fax': '', 'homepage': '', 'email': 'office@ticketselect.at',},
		'users': ['333333333333333333333333333333', '111111111111111111111111111111'],
		'location': 4,
		'events': []
	}, {
		'db': 'graz_2015',
		'prefix': ['WIK'],
		'promoter': {'ID': '', 'name': 'BRG WIKU', 'street': '', 'city': 'Graz', 'zip': '8010', 'countryISO2': 'AT', 'phone1': '', 'phone2': '', 'fax': '', 'homepage': '', 'email': 'office@ticketselect.at',},
		'users': ['333333333333333333333333333333', '111111111111111111111111111111'],
		'location': 4,
		'events': []
	}, {
		'db': 'graz_2015',
		'prefix': ['HAK'],
		'promoter': {'ID': '', 'name': 'HAK Grazbachgasse', 'street': '', 'city': 'Graz', 'zip': '8010', 'countryISO2': 'AT', 'phone1': '', 'phone2': '', 'fax': '', 'homepage': '', 'email': 'office@ticketselect.at',},
		'users': ['333333333333333333333333333333', '111111111111111111111111111111'],
		'location': 4,
		'events': []
	}, {
		'db': 'graz_2015',
		'prefix': ['ORT'],
		'promoter': {'ID': '', 'name': 'HTBLuVA Ortwein', 'street': '', 'city': 'Graz', 'zip': '8010', 'countryISO2': 'AT', 'phone1': '', 'phone2': '', 'fax': '', 'homepage': '', 'email': 'office@ticketselect.at',},
		'users': ['333333333333333333333333333333', '111111111111111111111111111111'],
		'location': 4,
		'events': []
	}, {
		'db': 'graz_2015',
		'prefix': ['URS'],
		'promoter': {'ID': '', 'name': 'PG Ursulinen', 'street': '', 'city': 'Graz', 'zip': '8010', 'countryISO2': 'AT', 'phone1': '', 'phone2': '', 'fax': '', 'homepage': '', 'email': 'office@ticketselect.at',},
		'users': ['333333333333333333333333333333', '111111111111111111111111111111'],
		'location': 4,
		'events': []
	}, {
		'db': 'graz_2015',
		'prefix': ['SAC'],
		'promoter': {'ID': '', 'name': 'Sacré Coeur', 'street': '', 'city': 'Graz', 'zip': '8010', 'countryISO2': 'AT', 'phone1': '', 'phone2': '', 'fax': '', 'homepage': '', 'email': 'office@ticketselect.at',},
		'users': ['333333333333333333333333333333', '111111111111111111111111111111'],
		'location': 4,
		'events': []
	}, {
		'db': 'aea',
		'prefix': [''],
		'promoter': {
			'ID': '',
			'name': 'Eventwerkstatt, Ilk & Partner KG',
			'street': 'Hauptplatz 28',
			'city': 'Linz',
			'zip': '4020',
			'countryISO2': 'AT',
			'phone1': '+437327811740',
			'phone2': '',
			'fax': '',
			'homepage': 'https://www.eventwerkstatt.at',
			'email': 'office@eventwerkstatt.at',
		},
		'users': [''],
		'location': 0,
		'events': []
	}, {
		'db': 'boku',
		'prefix': ['BOKU19'],
		'promoter': {
			'ID': '',
			'name': 'Boku Wien',
			'street': 'Peter-Jordan-Straße 76',
			'city': 'Wien',
			'zip': '1190',
			'countryISO2': 'AT',
			'phone1': '+4314765419110',
			'phone2': '',
			'fax': '',
			'homepage': 'https://bokuball.at',
			'email': 'bokuballshop@oehboku.at',
		},
		'users': [''],
		'location': 1,
		'events': []
	}, {
		'db': 'bph',
		'prefix': ['PH'],
		'promoter': {
			'ID': '',
			'name': 'Österreichische Apothekerkammer',
			'street': 'Spitalgasse 31',
			'city': 'Wien',
			'zip': '1090',
			'countryISO2': 'AT',
			'phone1': '+43140414107',
			'phone2': '',
			'fax': '',
			'homepage': 'https://www.pharmacieball.at',
			'email': 'pharmacieball@apothekerkammer.at',
		},
		'users': [''],
		'location': 1,
		'events': []
	}, {
		'db': 'hbb',
		'prefix': ['WBB', 'BWW'],
		'promoter': {
			'ID': '',
			'name': 'Wirtschaftsbund Wien',
			'street': 'Lothringerstraße 16/5',
			'city': 'Wien',
			'zip': '1030',
			'countryISO2': 'AT',
			'phone1': '+431512763111',
			'phone2': '+431512763134',
			'fax': '',
			'homepage': 'https://www.wirtschaftsbund.wien',
			'email': 'office@hofburg-ball.at',
		},
		'users': [''],
		'location': 1,
		'events': []
	}, {
		'db': 'ibc',
		'prefix': ['IBC'],
		'promoter': {
			'ID': 'ivents',
			'name': 'Ivents Kulturagentur',
			'street': 'Wickenburggasse 32',
			'city': 'Graz',
			'zip': '8010',
			'countryISO2': 'AT',
			'phone1': '+43316225238',
			'phone2': '',
			'fax': '+4331622523815',
			'homepage': 'http://www.ivents.at',
			'email': 'info@ivents.at',
		},
		'users': [''],
		'location': 4,
		'events': []
	}, {
		'db': 'pdt', 'prefix': ['PDT'], 'promoterID': 'ivents', 'users': [''], 'location': 3
	}, {
		'db': 'voa', 'prefix': ['VLX'], 'promoterID': 'ivents', 'users': [''], 'location': 3
	}, {
		'db': 'jur',
		'prefix': ['JUR'],
		'promoter': {
			'ID': '',
			'name': 'Juristenverband',
			'street': 'Weihburggasse 4/2/9',
			'city': 'Wien',
			'zip': '1010',
			'countryISO2': 'AT',
			'phone1': '+4315122600',
			'phone2': '',
			'fax': '',
			'homepage': 'https://www.juristenball.at',
			'email': 'office@juristenverband.at',
		},
		'users': [''],
		'location': 1
	}, {
		'db': 'lnc',
		'prefix': ['LNC'],
		'promoter': {
			'ID': '',
			'name': 'Company Code',
			'street': 'Joanneumring 16/2',
			'city': 'Graz',
			'zip': '8010',
			'countryISO2': 'AT',
			'phone1': '+43316232680',
			'phone2': '',
			'fax': '',
			'homepage': 'http://www.companycode.at',
			'email': 'office@companycode.at',
		},
		'users': [''],
		'location': 5
	}, {
		'db': 'tub',
		'prefix': ['TUB'],
		'promoter': {
			'ID': '',
			'name': 'Ballkomitee TU Ball',
			'street': 'Wiedner Hauptstr. 8-10/E134',
			'city': 'Wien',
			'zip': '1040',
			'countryISO2': 'AT',
			'phone1': '+4315880141929',
			'phone2': '+4315880115836',
			'fax': '',
			'homepage': 'http://www.tu-ball.at',
			'email': 'tuball@cms.tuwien.ac.at',
		},
		'users': [''],
		'location': 1
	}, {
		'db': 'zbb',
		'prefix': ['ZBB'],
		'promoter': {
			'ID': '',
			'name': 'Verein Förderung des Lebensmittelgewerbes',
			'street': 'Florianigasse 13',
			'city': 'Wien',
			'zip': '1080',
			'countryISO2': 'AT',
			'phone1': '+4314055396',
			'phone2': '',
			'fax': '',
			'homepage': 'https://www.zuckerbaeckerball.com',
			'email': 'info@zuckerbaeckerball.com',
		},
		'users': [''],
		'location': 1
	}, {
		'db': 'www',
		'prefix': ['PRÄFI'],
		'promoter': {
			'ID': '',
			'name': 'TICKETSELECT GmbH',
			'street': 'Lerchenfelder Straße 74/1/6',
			'city': 'Wien',
			'zip': '1080',
			'countryISO2': 'AT',
			'phone1': '',
			'phone2': '',
			'fax': '',
			'homepage': 'https://www.ticketselect.at',
			'email': 'office@ticketselect.at',
		},
		'users': ['111111111111111111111111111111'],
		'location': 1
	}
];

if (1 == 2) {
	databases = [{
		'db': 'bph',
		'prefix': ['PH'],
		'promoter': {
			'ID': '',
			'name': 'Österreichische Apothekerkammer',
			'street': 'Spitalgasse 31',
			'city': 'Wien',
			'zip': '1090',
			'countryISO2': 'AT',
			'phone1': '+43140414107',
			'phone2': '',
			'fax': '',
			'homepage': 'https://www.pharmacieball.at',
			'email': 'pharmacieball@apothekerkammer.at',
		},
		'users': [''],
		'location': 1
	}, {
		'db': 'graz_2015',
		'prefix': ['HLW'],
		'promoter': {'ID': '', 'name': 'HLW Schrödinger', 'street': '', 'city': 'Graz', 'zip': '8010', 'countryISO2': 'AT', 'phone1': '', 'phone2': '', 'fax': '', 'homepage': '', 'email': 'office@ticketselect.at',},
		'users': ['333333333333333333333333333333', '111111111111111111111111111111'],
		'location': 6,
		'events': []
	}, {
		'db': 'graz_2015',
		'prefix': ['AKG'],
		'promoter': {'ID': '', 'name': 'Akademisches Gymnasium', 'street': '', 'city': 'Graz', 'zip': '8010', 'countryISO2': 'AT', 'phone1': '', 'phone2': '', 'fax': '', 'homepage': '', 'email': 'office@ticketselect.at',},
		'users': ['333333333333333333333333333333', '111111111111111111111111111111'],
		'location': 4,
		'events': []
	}];
}

if (1 == 2) {
	databases = [{
		'db': 'lnc',
		'prefix': ['LNC'],
		'promoter': {
			'ID': '',
			'name': 'Company Code',
			'street': 'Joanneumring 16/2',
			'city': 'Graz',
			'zip': '8010',
			'countryISO2': 'AT',
			'phone1': '+43316232680',
			'phone2': '',
			'fax': '',
			'homepage': 'http://www.companycode.at',
			'email': 'office@companycode.at',
		},
		'users': [''],
		'location': 5
	}];
}

// testdata WWW
if (1 == 2) {
	databases = [{
		'db': 'www',
		'prefix': ['PRÄFI'],
		'promoter': {
			'ID': '',
			'name': 'TICKETSELECT GmbH',
			'street': 'Lerchenfelder Straße 74/1/6',
			'city': 'Wien',
			'zip': '1080',
			'countryISO2': 'AT',
			'phone1': '',
			'phone2': '',
			'fax': '',
			'homepage': 'https://www.ticketselect.at',
			'email': 'office@ticketselect.at',
		},
		'users': ['111111111111111111111111111111'],
		'location': 1
	}];
}

if (1 == 2) {
	databases = [{
		'db': 'hbb',
		'prefix': ['WBB', 'BWW'], // , 'WBB','BWW'
		'promoter': {
			'ID': '',
			'name': 'Wirtschaftsbund Wien',
			'street': 'Lothringerstraße 16/5',
			'city': 'Wien',
			'zip': '1030',
			'countryISO2': 'AT',
			'phone1': '+431512763111',
			'phone2': '+431512763134',
			'fax': '',
			'homepage': 'https://www.wirtschaftsbund.wien',
			'email': 'office@hofburg-ball.at',
		},
		'users': [''],
		'location': 1,
		'events': []
	}];
}

let locations = [
	{
		'ID': '0',
		'name': 'Nordlicht-Event GmbH',
		'street': 'Sebastian-Kohlgasse 3-9',
		'city': 'Wien',
		'zip': '1210',
		'countryISO2': 'AT',
		'phone1': '+4312718154',
		'phone2': '',
		'fax': '',
		'email': 'anfrage@nordlicht-events.at',
		'homepage': 'https://www.nordlicht-events.at',
		'events': []
	},
	{
		'ID': '1',
		'name': 'Hofburg Wien',
		'street': 'Michaelerkuppel',
		'city': 'Wien',
		'zip': '1010',
		'countryISO2': 'AT',
		'phone1': '+4315337570',
		'phone2': '',
		'fax': '',
		'email': 'info@hofburg-wien.at',
		'homepage': 'https://www.hofburg-wien.at',
		'events': []
	},
	{
		'ID': '2',
		'name': 'Rathaus',
		'street': 'Friedrich-Schmidt-Platz 1',
		'city': 'Wien',
		'zip': '1010',
		'countryISO2': 'AT',
		'phone1': '+43152550',
		'phone2': '',
		'fax': '',
		'email': '',
		'homepage': 'https://www.wien.gv.at/verwaltung/rathaus/index.html',
		'events': []
	},
	{'ID': '3', 'name': 'Hauptplatz Graz', 'street': '', 'city': 'Graz', 'zip': '8010', 'countryISO2': 'AT', 'phone1': '', 'phone2': '', 'fax': '', 'email': '', 'homepage': '', 'events': []},
	{
		'ID': '4',
		'name': 'Congress Graz',
		'street': 'Albrechtgasse 1',
		'city': 'Graz',
		'zip': '8010',
		'countryISO2': 'AT',
		'phone1': '+433168088400',
		'phone2': '',
		'fax': '+433168088450',
		'email': 'office@mcg.at',
		'homepage': 'http://www.mcg.at/congressgraz/kontakt-congress-graz.php',
		'events': []
	},
	{
		'ID': '5',
		'name': 'Congress und Messe Innsbruck GmbH',
		'street': 'Rennweg 3',
		'city': 'Innsbruck',
		'zip': '6020',
		'countryISO2': 'AT',
		'phone1': '+4351259360',
		'phone2': '',
		'fax': '+4351259361119',
		'email': 'info@cmi.at',
		'homepage': 'https://www.cmi.at',
		'events': []
	},
	{
		'ID': '6',
		'name': 'Stadthalle Graz',
		'street': 'Messeplatz 1',
		'city': 'Graz',
		'zip': '8010',
		'countryISO2': 'AT',
		'phone1': '+433168088400',
		'phone2': '',
		'fax': '+433168088450',
		'email': 'office@mcg.at',
		'homepage': 'http://www.mcg.at/messegraz.at/de/index.php',
		'events': []
	},
];

let laender = {};

let aktPromoter = {};
let promoters = [];
_.each(databases, (db) => {
	if (db.promoter) {
		db.promoter.ID = _generateUUID();
		aktPromoter = db.promoter;
		promoters.push(db.promoter);
	} else {
		db.promoter = aktPromoter;
	}
});

const ballcomplete = mysql.createConnection(ballcomplete_settings);

readDir.read('./sql/', ['z_**.sql'], function(err, filesArray) {
	filesArray.sort();
	_.each(filesArray, (file) => {
		console.log('unlink: ' + './sql/' + file);
		fs.unlinkSync('./sql/' + file);
	});

	_import_basic();
	connect('ballcomplete', ballcomplete).then((res) => {
		console.log('==>', 'fetch countries');
		return _fetch_countries();
	}).then((res) => {
		console.log('==>', 'clear');
		return clear();
	}).then(() => {
		console.log('==>', 'import orders');
		return import_orders();
	}).then((res) => {
		console.log('==>', 'write orders');
		return _writeFile('sql/z_40_data_orders.sql', res);
	}).then(() => {
		console.log('==>', 'import orders taxes');
		return import_orders_tax();
	}).then(() => {
		console.log('==>', 'import users promoter');
		return import_users_promoter();
	}).then((res) => {
		console.log('==>', 'write users promoter');
		return _writeFile('sql/z_21_data_promoter_users.sql', res);
	}).then(() => {
		console.log('==>', 'import events');
		return import_events();
	}).then((res) => {
		console.log('==>', 'write events');
		return _writeFile('sql/z_30_data_events.sql', res);
	}).then(() => {
		console.log('==>', 'import order details');
		return import_orders_details();
	}).then(() => {
		console.log('==>', 'import tickets');
		return import_tickets();
	}).then((res) => {
		console.log('==>', 'write tickets');
		return _writeFile('sql/z_31_data_events_tickets.sql', res);
	}).then(() => {
		console.log('==>', 'import special tickets (eg Tortengarantie)');
		return import_special();
	}).then((res) => {
		console.log('==>', 'write specials');
		return _writeFile('sql/z_32_data_events_specials.sql', res);
	}).then(() => {
		console.log('==>', 'import floors');
		return import_floors();
	}).then((res) => {
		console.log('==>', 'write floors');
		return _writeFile('sql/z_33_data_floors.sql', res);
	}).then(() => {
		console.log('==>', 'import rooms');
		return import_rooms();
	}).then((res) => {
		console.log('==>', 'write rooms');
		return _writeFile('sql/z_34_data_rooms.sql', res);
	}).then(() => {
		console.log('==>', 'import tables (tische)');
		return import_tables();
	}).then((res) => {
		console.log('==>', 'write tables');
		return _writeFile('sql/z_35_data_tables.sql', res);
	}).then(() => {
		console.log('==>', 'import seats');
		return import_seats();
	}).then((res) => {
		console.log('==>', 'write seats');
		return _writeFile('sql/z_36_data_seats.sql', res);
	}).then((res) => {
		console.log('==>', 'update seats');
		return update_seats(res);
	}).then((res) => {
		console.log('==>', 'write update seats');
		return _writeFile('sql/z_41_data_update_seats.sql', res);

	}).then((res) => {
		console.log('==>', 'import tickets preprint');
		return import_tickets_preprint(res);
	}).then((res) => {
		console.log('==>', 'write tickets preprint');
		return _writeFile('sql/z_43_data_tickets_preprint.sql', res);

	}).then(() => {
		console.log('==>', 'import scans');
		return import_scans();
	}).then((res) => {
		console.log('==>', 'write scans');
		return _writeFile('sql/z_42_data_scans.sql', res);
	}).then(() => {
		console.log('==>', 'FINISH!');
		ballcomplete.end();
	}).catch((err) => {
		console.error('error connecting: ' + err.stack);
		ballcomplete.end();
	})
})

function _import_basic() {
	let comma = '';
	let sql = 'use ticketing_db;\n\n';

	sql += 'SET FOREIGN_KEY_CHECKS = 0;\n';
	sql += 'TRUNCATE TABLE innoOrderDetail;\n';
	sql += 'TRUNCATE TABLE innoOrderTax;\n';
	sql += 'TRUNCATE TABLE innoOrder;\n';

	sql += 'TRUNCATE TABLE innoLocation;\n';

	sql += 'TRUNCATE TABLE innoPromoterUser;\n';
	sql += 'TRUNCATE TABLE innoPromoter;\n';

	sql += 'TRUNCATE TABLE innoSeat;\n';
	sql += 'TRUNCATE TABLE innoTable;\n';
	sql += 'TRUNCATE TABLE innoRoom;\n';
	sql += 'TRUNCATE TABLE innoFloor;\n';

	sql += 'TRUNCATE TABLE innoTicket;\n';
	sql += 'TRUNCATE TABLE innoEvent;\n';

	sql += 'TRUNCATE TABLE innoUser;\n';

	sql += 'SET FOREIGN_KEY_CHECKS = 1;\n';

	_writeFile('sql/z_00_truncate.sql', sql).then((response) => {
	}).catch((err) => {
		console.log(err);
		process.exit(137);
	});

	comma = '';
	sql = 'INSERT INTO innoLocation (`LocationID`,`LocationName`,`LocationStreet`,`LocationCity`,`LocationZIP`,`LocationCountryCountryISO2`,`LocationEmail`,`LocationHomepage`,`LocationPhone1`,`LocationPhone2`,`LocationFax`) VALUES ';
	_.each(locations, (location) => {

		location.ID = _generateUUID();

		let ID = location.ID;
		let Name = location.name;
		let Street = location.street;
		let City = location.city;
		let ZIP = location.zip;
		let CountryCountryISO2 = location.countryISO2;
		let Email = location.email;
		let Homepage = location.homepage;
		let Phone1 = location.phone1;
		let Phone2 = location.phone2;
		let Fax = location.fax;

		sql += comma + "\n('" + ID + "','" + Name + "','" + Street + "','" + City + "','" + ZIP + "','" + CountryCountryISO2 + "','" + Email + "','" + Homepage + "','" + Phone1 + "','" + Phone2 + "','" + Fax + "')";
		comma = ',';
	});
	sql += ';';

	_writeFile('sql/z_10_data_location.sql', sql).then((response) => {
	}).catch((err) => {
		console.log(err);
		process.exit(137);
	});

	sql = 'REPLACE INTO innoPromoter (`PromoterID`,`PromoterName`,`PromoterStreet`,`PromoterCity`,`PromoterZIP`,`PromoterCountryCountryISO2`,`PromoterEmail`,`PromoterHomepage`,`PromoterPhone1`,`PromoterPhone2`,`PromoterFax`,`PromoterLocations`,`PromoterEvents`,`PromoterEventsActive`) VALUES ';
	comma = '';
	_.each(promoters, (promoter) => {

		let ID = promoter.ID;
		let Name = promoter.name;
		let Street = promoter.street;
		let City = promoter.city;
		let ZIP = promoter.zip;
		let CountryCountryISO2 = promoter.countryISO2;
		let Email = promoter.email;
		let Homepage = promoter.homepage;
		let Phone1 = promoter.phone1;
		let Phone2 = promoter.phone2;
		let Fax = promoter.fax;
		let Locations = 0;
		let Events = 0;
		let EventsActive = 0;

		sql += comma + "\n('" + ID + "','" + Name + "','" + Street + "','" + City + "','" + ZIP + "','" + CountryCountryISO2 + "','" + Email + "','" + Homepage + "','" + Phone1 + "','" + Phone2 + "','" + Fax + "','" + Locations + "','" + Events + "','" + EventsActive + "')";
		comma = ',';
	});
	sql += ';';

	_writeFile('sql/z_11_data_promoter.sql', sql).then((response) => {
	}).catch((err) => {
		console.log(err);
		process.exit(137);
	});
}

function clear() {
	return new Promise((resolve, reject) => {
		let promiseRows = [];
		_.each(databases, (database) => {
			let db = 'ballcomplete_' + database.db;
			let sql = 'SELECT SysCode FROM ' + db + '.vacomplete WHERE ';
			let or = '';
			_.each(database.prefix, (prefix) => {
				if (prefix) {
					sql += or + 'RechnungNummerPraefix LIKE \'' + prefix + '%\' OR ScancodesPraefix LIKE \'' + prefix + '%\'';
				} else {
					sql += or + 'RechnungNummerPraefix = \'\'';
				}
				or = ' OR '
			});
			promiseRows.push(_queryAll(sql, db));
		});
		Promise.all(promiseRows).then((resPromise) => {
			let deletePromises = [];
			let db = false;
			let sqlBestellungen = false;
			let sqlBestellungenDetails = false;
			let and = '';
			let queriesBestellungen = [];
			let queriesBestellungenDetails = [];
			_.each(resPromise, rowPromise => {
				if (db != rowPromise.data) {
					if (sqlBestellungen) {
						queriesBestellungen.push(sqlBestellungen);
						queriesBestellungenDetails.push(sqlBestellungenDetails);
					}
					db = rowPromise.data;
					sqlBestellungen = 'DELETE FROM ' + db + '.vacomplete_bestellungen WHERE';
					sqlBestellungenDetails = 'DELETE FROM ' + db + '.vacomplete_bestellungen_details WHERE';
					//sqlBestellungen = 'SELECT COUNT(SysCode) FROM ' + db + '.vacomplete_bestellungen WHERE';
					//sqlBestellungenDetails = 'SELECT COUNT(Scancode) FROM ' + db + '.vacomplete_bestellungen_details WHERE';
					and = '';
				}
				_.each(rowPromise.res, row => {
					sqlBestellungen += and + " SysCodeVA != '" + row.SysCode + "' ";
					sqlBestellungenDetails += and + " SysCodeVA != '" + row.SysCode + "' ";
					and = 'AND';
				});
			});
			console.log('NO OUTPUT FOR clear active => search for this to output SQL Queries :)');
			_.each(queriesBestellungen, query => {
				//console.log(query + ';');
			});
			_.each(queriesBestellungenDetails, query => {
				//console.log(query + ';');
			});
			resolve();
		}).catch((err) => {
			//console.log('clear: promise all problem');
			//console.log(err);
		});
	});
}

function import_scans() {
	return new Promise((resolve, reject) => {
		let promiseRows = [];
		_.each(locations, (location) => {
			_.each(location.events, (event) => {
				let table = 'ballcomplete_' + event.db + '.vacomplete_scans';
				let sql = "SELECT * FROM " + table;
				sql += " WHERE SysCodeVeranstaltung = '" + event.SysCodeVA + "'";
				promiseRows.push(_query(sql));
			});
		});
		Promise.all(promiseRows).then((resPromise) => {
			let sql = "INSERT INTO innoScan (`ScanCode`,`ScanState`,`ScanEventID`,`ScanDateTimeUTC`,`ScanType`) VALUES ";
			let comma = '';
			_.each(resPromise, (rowPromise) => {
				_.each(rowPromise, (scan) => {
					let state = 'ok';
					switch (scan.scanStatus) {
						case "ug":
							state = 'invalid';
							break;
						case "mu":
							state = 'multi';
							break;
						case "dp":
							state = 'double';
							break;
						default:
							state = 'ok';
							break;
					}
					let type = 'null';
					switch (scan.SysArt) {
						case "eintrittskarte":
							type = "'ticket'";
							break;
						case "sonderleistung":
							type = "'special'";
							break;
						default:
							break;
					}
					sql += "\n" + comma + '(';
					sql += "'" + scan.Scancode + "'";
					sql += ",'" + state + "'";
					sql += ",'" + _convertID(scan.SysCodeVeranstaltung) + "'";
					sql += ",'" + _dateTime(scan.scanTimestamp) + "'";
					sql += "," + type;
					sql += ')';
					comma = ',';
				});
			});
			if (!comma) sql = '';
			resolve(sql);
		}).catch((err) => {
			console.log('import_scans: promise all problem');
			console.log(err);
		});
	});
}

function import_tickets() {
	return new Promise((resolve, reject) => {
		let promiseRows = [];
		_.each(locations, (location) => {
			_.each(location.events, (event) => {
				let table = 'ballcomplete_' + event.db + '.vacomplete_eintrittskarten eintrittskarte';
				let table_text = 'ballcomplete_' + event.db + '.vacomplete_sprachen_texte texte';
				let sql = "SELECT eintrittskarte.*, texte.Wert AS Bezeichnung FROM " + table;
				sql += " INNER JOIN " + table_text + " ON eintrittskarte.SysCode = texte.SysCode AND Formular = 'Eintrittskarten' AND Feld = 'Bezeichnung' AND SysCodeSprache = 'de'";
				sql += " WHERE eintrittskarte.SysCodeVA = '" + event.SysCodeVA + "' ORDER BY SysPriority";
				promiseRows.push(_query(sql));
			});
		});
		Promise.all(promiseRows).then((resPromise) => {
			let sql = "INSERT INTO innoTicket (`TicketID`,`TicketEventID`,`TicketName`";
			sql += ",`TicketOnline`";
			sql += ",`TicketMaximumOnline`";
			sql += ",`TicketContingent`";
			sql += ",`TicketSortOrder`";
			sql += ",`TicketGrossPrice`";
			sql += ",`TicketTaxPercent`";
			sql += ") VALUES ";
			let comma = '';
			_.each(resPromise, (rowPromise) => {
				let SortOrder = 1;
				_.each(rowPromise, (ticket) => {
					let kontingent = (ticket.KontingentOnline + ticket.KontingentVordruck);
					let kontingentPreprint = (ticket.KontingentVordruck) ? ticket.KontingentVordruck : 0;
					let preis = (ticket.Preis) ? ticket.Preis : "0.00";
					let ust = (ticket.Ust) ? ticket.Ust : "0.00";
					sql += comma + "\n" + '(';
					sql += "'" + _convertID(ticket.SysCode) + "','" + _convertID(ticket.SysCodeVA) + "','" + ticket.Bezeichnung + "'";
					sql += "," + ticket.SysOnline + "";
					sql += "," + ticket.maxBestellmenge + "";
					sql += "," + (parseInt(kontingent) + parseInt(kontingentPreprint));
					sql += "," + SortOrder;
					sql += "," + preis;
					sql += "," + ust;
					sql += ')';
					comma = ',';
					SortOrder++;
				});
			});
			if (!comma) sql = '';
			resolve(sql);
		}).catch((err) => {
			console.log('import_tickets: promise all problem');
			console.log(err);
		});
	});
}

function import_tickets_preprint() {
	return new Promise((resolve, reject) => {
		let promiseRows = [];
		_.each(locations, (location) => {
			_.each(location.events, (event) => {
				let table = 'ballcomplete_' + event.db + '.vacomplete_produkte produkte';
				let sql = "SELECT * FROM " + table;
				sql += " WHERE produkte.SysCodeVA = '" + event.SysCodeVA + "' AND TypeStatus = 'vordruck'";
				promiseRows.push(_query(sql));
			});
		});
		Promise.all(promiseRows).then((resPromise) => {
			let sql = "INSERT INTO innoTicketPreprint (`TicketPreprintScanCode`,`TicketPreprintTicketID`,`TicketPreprintEventID`) VALUES ";
			let comma = '';
			_.each(resPromise, (rowPromise) => {
				_.each(rowPromise, (ticket) => {
					sql += comma + "\n" + "('" + ticket.Scancode + "','" + _convertID(ticket.SysCode) + "','" + _convertID(ticket.SysCodeVA) + "')";
					comma = ',';
				});
			});
			if (!comma) sql = '';
			resolve(sql);
		}).catch((err) => {
			console.log('import_tickets_preprint: promise all problem');
			console.log(err);
		});
	});
}

function import_special() {
	return new Promise((resolve, reject) => {
		let promiseRows = [];
		_.each(locations, (location) => {
			_.each(location.events, (event) => {
				let table = 'ballcomplete_' + event.db + '.vacomplete_sonderleistungen sonderleistung';
				let table_text = 'ballcomplete_' + event.db + '.vacomplete_sprachen_texte texte';
				let sql = "SELECT sonderleistung.*, texte.Wert AS Bezeichnung FROM " + table;
				sql += " INNER JOIN " + table_text + " ON sonderleistung.SysCode = texte.SysCode AND Formular = 'Sonderleistungen' AND Feld = 'Bezeichnung' AND SysCodeSprache = 'de'";
				sql += " WHERE sonderleistung.SysCodeVA = '" + event.SysCodeVA + "' ORDER BY SysPriority";
				promiseRows.push(_query(sql));
			});
		});
		Promise.all(promiseRows).then((resPromise) => {
			let sql = "INSERT INTO innoTicket (`TicketID`,`TicketEventID`,`TicketName`";
			sql += ",`TicketType`";
			sql += ",`TicketOnline`";
			sql += ",`TicketMaximumOnline`";
			sql += ",`TicketContingent`";
			sql += ",`TicketSortOrder`";
			sql += ",`TicketGrossPrice`";
			sql += ",`TicketTaxPercent`";
			sql += ") VALUES ";
			let comma = '';
			_.each(resPromise, (rowPromise) => {
				let SortOrder = 100;
				_.each(rowPromise, (special) => {
					let kontingent = (special.KontingentOnline + special.KontingentVordruck);
					let kontingentPreprint = (special.KontingentVordruck) ? special.KontingentVordruck : 0;
					let preis = (special.Preis) ? special.Preis : "0.00";
					let ust = (special.Ust) ? special.Ust : "0.00";
					sql += "\n" + comma + '(';
					sql += "'" + _convertID(special.SysCode) + "','" + _convertID(special.SysCodeVA) + "','" + special.Bezeichnung + "'";
					sql += ",'special'";
					sql += "," + special.SysOnline + "";
					sql += "," + special.maxBestellmenge + "";
					sql += "," + (parseInt(kontingent) + parseInt(kontingentPreprint));
					sql += "," + SortOrder;
					sql += "," + preis;
					sql += "," + ust;
					sql += ')';
					comma = ',';
					SortOrder++;
				});
			});
			if (!comma) sql = '';
			resolve(sql);
		}).catch((err) => {
			console.log('import_tickets: promise all problem');
			console.log(err);
		});
	});
}

function import_floors() {
	return new Promise((resolve, reject) => {
		let promiseRows = [];
		_.each(locations, (location) => {
			_.each(location.events, (event) => {
				let table = 'ballcomplete_' + event.db + '.vacomplete_sektoren_ebenen floors';
				let table_text = 'ballcomplete_' + event.db + '.vacomplete_sprachen_texte';
				let sql = "SELECT floors.*, texte1.Wert AS Bezeichnung, texte2.Wert AS svgData FROM " + table;
				sql += " LEFT JOIN " + table_text + " texte1 ON floors.SysCode = texte1.SysCode AND texte1.Formular = 'Sektor_Ebenen' AND texte1.Feld = 'Bezeichnung' AND texte1.SysCodeSprache = 'de'";
				sql += " LEFT JOIN " + table_text + " texte2 ON floors.SysCode = texte2.SysCode AND texte2.Formular = 'Sektor_Ebenen' AND texte2.Feld = 'svgData' AND texte2.SysCodeSprache = 'de'";
				sql += " WHERE floors.SysCodeVA = '" + event.SysCodeVA + "'"; // floors.SysDeleted = 0 &&
				promiseRows.push(_query(sql));
			});
		});
		Promise.all(promiseRows).then((resPromise) => {
			let sql = "SET FOREIGN_KEY_CHECKS = 0;\n";
			sql += "TRUNCATE TABLE innoFloor;\n";
			sql += "SET FOREIGN_KEY_CHECKS = 1;\n";
			sql += "INSERT INTO innoFloor (`FloorID`,`FloorEventID`,`FloorName`,`FloorLabel`,`FloorSVG`) VALUES ";
			let comma = '';
			_.each(resPromise, (rowPromise) => {
				_.each(rowPromise, (floor) => {
					let svgData = (floor.svgData) ? floor.svgData : "null";
					if (svgData != "null") {
						svgData = svgData.replace((/  |\t|\r\n|\n|\r/gm), "");
						svgData = svgData.replaceAll("'", "\\'");
						svgData = "'" + svgData + "'";
					}
					sql += "\n" + comma + '(';
					sql += "'" + _convertID(floor.SysCode) + "',";
					sql += "'" + _convertID(floor.SysCodeVA) + "',";
					sql += (floor.Bezeichnung) ? "'" + floor.Bezeichnung + "'," : "null,";
					sql += (floor.Bezeichnung) ? "'" + floor.Bezeichnung + "'," : "null,";
					sql += svgData;
					sql += ')';
					comma = ',';
				});
			});
			if (!comma) sql = '';
			resolve(sql);
		}).catch((err) => {
			console.log('import_floors: promise all problem');
			console.log(err);
		});
	});
}

function import_rooms() {
	return new Promise((resolve, reject) => {
		let promiseRows = [];
		_.each(locations, (location) => {
			_.each(location.events, (event) => {
				let table = 'ballcomplete_' + event.db + '.vacomplete_kategorien_saele rooms';
				let table_text = 'ballcomplete_' + event.db + '.vacomplete_sprachen_texte texte';
				let sql = "SELECT rooms.*, texte.Wert AS Bezeichnung FROM " + table;
				sql += " LEFT JOIN " + table_text + " ON rooms.SysCode = texte.SysCode AND Formular = 'Kategorien_Saele' AND Feld = 'Bezeichnung' AND SysCodeSprache = 'de'";
				sql += " WHERE rooms.SysDeleted = 0 && rooms.SysCodeVA = '" + event.SysCodeVA + "'";
				promiseRows.push(_query(sql));
			});
		});
		Promise.all(promiseRows).then((resPromise) => {
			let sql = "SET FOREIGN_KEY_CHECKS = 0;\n";
			sql += "TRUNCATE TABLE innoRoom;\n";
			sql += "SET FOREIGN_KEY_CHECKS = 1;\n";
			sql += "INSERT INTO innoRoom (`RoomID`,`RoomEventID`,`RoomFloorID`,`RoomName`,`RoomLabel`,`RoomSVGShape`) VALUES ";
			let comma = '';
			_.each(resPromise, (rowPromise) => {
				_.each(rowPromise, (room) => {
					sql += "\n" + comma + '(';
					sql += "'" + _convertID(room.SysCode) + "',";
					sql += "'" + _convertID(room.SysCodeVA) + "',";
					sql += "'" + _convertID(room.SysCodeSektorEbene) + "',";
					sql += (room.Bezeichnung) ? "'" + room.Bezeichnung + "'," : "null,";
					sql += (room.Bezeichnung) ? "'" + room.Bezeichnung + "'" : "null";
					sql += ",'" + room.SektorEbeneShape + "'";
					sql += ')';
					comma = ',';
				});
			});
			if (!comma) sql = '';
			resolve(sql);
		}).catch((err) => {
			console.log('import_rooms: promise all problem');
			console.log(err);
		});
	});
}

function import_tables() {
	return new Promise((resolve, reject) => {
		let promiseRows = [];
		_.each(locations, (location) => {
			_.each(location.events, (event) => {
				let table = 'ballcomplete_' + event.db + '.vacomplete_kategorien_saele_tische tische';
				let sql = "SELECT tische.* FROM " + table;
				sql += " inner join ballcomplete_" + event.db + ".vacomplete_kategorien_saele saele on tische.SysCodeKategorieSaal = saele.SysCode";
				sql += " WHERE saele.SysDeleted = 0 && tische.SysCodeVA = '" + event.SysCodeVA + "'"; //
				promiseRows.push(_query(sql));
			});
		});
		Promise.all(promiseRows).then((resPromise) => {
			let sql = "SET FOREIGN_KEY_CHECKS = 0;\n";
			sql += "TRUNCATE TABLE innoTable;\n";
			sql += "SET FOREIGN_KEY_CHECKS = 1;\n";
			sql += "INSERT INTO innoTable (`TableID`,`TableEventID`,`TableFloorID`,`TableRoomID`,`TableNumber`,`TableName`,`TableLabel`) VALUES ";
			let comma = '';
			_.each(resPromise, (rowPromise) => {
				_.each(rowPromise, (table) => {
					sql += "\n" + comma + '(';
					sql += "'" + _convertID(table.SysCode) + "',";
					sql += "'" + _convertID(table.SysCodeVA) + "',";
					sql += "'" + _convertID(table.SysCodeSektorEbene) + "',";
					sql += "'" + _convertID(table.SysCodeKategorieSaal) + "',";
					sql += (table.Nummer) ? table.Nummer + "," : "null,";
					sql += (table.Bezeichnung) ? "'" + table.Bezeichnung + "'," : "null,";
					sql += (table.Bezeichnung) ? "'" + table.Bezeichnung + "'" : "null";
					sql += ')';
					sql += '';
					comma = ',';
				});
			});
			if (!comma) sql = '';
			resolve(sql);
		}).catch((err) => {
			console.log('import_tables: promise all problem');
			console.log(err);
		});
	});
}

function import_seats() {
	return new Promise((resolve, reject) => {
		let promiseRows = [];
		_.each(locations, (location) => {
			_.each(location.events, (event) => {
				let table = 'ballcomplete_' + event.db + '.vacomplete_kategorien_saele_sessel sessel';
				let sql = "SELECT sessel.*, tische.PreisProSessel as Preis, va.RechnungUstStandard as Ust FROM " + table; // ,bestellungen_details.SysCodeBestellung AS SysCodeBestellung
				sql += " inner join ballcomplete_" + event.db + ".vacomplete va on sessel.SysCodeVA = va.SysCode";
				sql += " inner join ballcomplete_" + event.db + ".vacomplete_kategorien_saele saele on sessel.SysCodeKategorieSaal = saele.SysCode";
				sql += " inner join ballcomplete_" + event.db + ".vacomplete_kategorien_saele_tische tische on sessel.SysCodeTisch = tische.SysCode";
				//sql += " inner join ballcomplete_" + event.db + ".vacomplete_bestellungen_details bestellungen_details on sessel.SysCode = bestellungen_details.SysCode";
				sql += " WHERE saele.SysDeleted = 0 && sessel.SysDeleted = 0 && sessel.SysCodeVA = '" + event.SysCodeVA + "'"; //
				promiseRows.push(_query(sql));
			});
		});
		Promise.all(promiseRows).then((resPromise) => {
			let sql = "SET FOREIGN_KEY_CHECKS = 0;\n";
			sql += "TRUNCATE TABLE innoSeat;\n";
			sql += "SET FOREIGN_KEY_CHECKS = 1;\n";
			sql += "INSERT INTO innoSeat (`SeatID`,`SeatEventID`,`SeatFloorID`,`SeatRoomID`,`SeatTableID`,`SeatNumber`,`SeatGrossPrice`,`SeatTaxPercent`) VALUES ";
			let comma = '';
			_.each(resPromise, (rowPromise) => {
				_.each(rowPromise, (seat) => {
					sql += "\n" + comma + '(';
					sql += "'" + _convertID(seat.SysCode) + "',";
					sql += "'" + _convertID(seat.SysCodeVA) + "',";
					sql += "'" + _convertID(seat.SysCodeSektorEbene) + "',";
					sql += "'" + _convertID(seat.SysCodeKategorieSaal) + "',";
					sql += "'" + _convertID(seat.SysCodeTisch) + "',";
					sql += (seat.Nummer) ? seat.Nummer + "," : "null,";
					sql += (seat.Preis) ? "" + seat.Preis + "," : "0.00,";
					sql += (seat.Ust) ? "" + seat.Ust + "" : "0.00";
					sql += ') '; // -- ' + seat.SysCode
					comma = ',';
				});
			});
			if (!comma) sql = '';
			resolve(sql);
		}).catch((err) => {
			console.log('import_seats: promise all problem');
			console.log(err);
		});
	});
}

function update_seats() {
	return new Promise((resolve, reject) => {
		let promiseRows = [];
		_.each(locations, (location) => {
			_.each(location.events, (event) => {
				let table = 'ballcomplete_' + event.db + '.vacomplete_bestellungen_details details';
				let sql = "SELECT SysCode, SysCodeBestellung, SysArt FROM " + table;
				sql += " WHERE details.SysCodeVA = '" + event.SysCodeVA + "' AND SysArt = 'sitzplatzkarte' AND SysStatus = 've' ORDER BY SysCodeBestellung"; //
				promiseRows.push(_query(sql));
			});
		});
		Promise.all(promiseRows).then((resPromise) => {
			let sql = "";
			_.each(resPromise, (rowPromise) => {
				let SysCodeBestellung = '';
				let where = '';
				let or = '';
				_.each(rowPromise, (details) => {
					if (SysCodeBestellung != _convertID(details.SysCodeBestellung)) {
						SysCodeBestellung = _convertID(details.SysCodeBestellung);
						if (SysCodeBestellung && where) {
							sql += "UPDATE innoSeat SET SeatOrderID = '" + SysCodeBestellung + "' WHERE " + where + ";\n";
							where = '';
							or = '';
						}
					}
					where += or + " SeatID='" + _convertID(details.SysCode) + "'";
					or = ' OR ';
				});
			});
			resolve(sql);
		}).catch((err) => {
			console.log('update_seats: promise all problem');
			console.log(err);
		});
	});
}

function connect(name, conn) {
	return new Promise((resolve, reject) => {
		conn.connect(function(err) {
			if (err) {
				reject(err);
			}
			resolve();
		});

	});
}

function import_users_promoter() {
	return new Promise((resolve, reject) => {
		let promises = [];
		_.each(databases, (database) => {
			promises.push(new Promise(function(resolveQuery, rejectQuery) {
				let sql = 'SELECT * FROM ballcomplete_' + database.db + '.cms_user';
				ballcomplete.query(sql, function(err, res) {
					if (err) {
						console.log(err);
						rejectQuery();
					} else {
						if (res.length) {
							let sql = 'REPLACE INTO innoUser (`UserID`,`UserEmail`,`UserType`,`UserGender`,`UserTitle`,`UserFirstname`,`UserLastname`) VALUES ';
							let comma = '';
							_.each(res, (row) => {
								if (row.SysCode == 'Idf2jjj8aj1j9j90j02jf9889ahgnpg8h43hifawhlief3lia3ali') {
									row.SysCode = 'Idaeeb9471416130460e8e2addec6f069dc99c23595745ae1720150120134221';
								}
								if (row.Vorname != 'ivents' || row.SysCode == 'Idaeeb9471416130460e8e2addec6f069dc99c23595745ae1720150120134221') {
									let UserID = _convertID(row.SysCode);
									var pre = 'promoter.';
									let UserEmail = 'promoter.' + row.Vorname.toLowerCase() + '.' + row.Nachname.toLowerCase() + '@ticketselect.at';
									let UserType = 'promoter';
									let UserGender = (row.Anrede == 'Frau') ? 'f' : 'm';
									let UserTitle = row.Titel;
									let UserFirstname = row.Vorname;
									let UserLastname = row.Nachname;
									sql += comma + "\n('" + UserID + "','" + UserEmail + "','" + UserType + "','" + UserGender + "','" + UserTitle + "','" + UserFirstname + "','" + UserLastname + "')";
									comma = ',';
								}
							});
							sql += ';';
							resolveQuery(sql);
						} else {
							resolveQuery();
						}
					}
				});
			}));
		});
		Promise.all(promises).then((resArray) => {
			let ret = '';
			_.each(resArray, (res) => {
				if (res) {
					ret += res + '\n';
				}
			});
			resolve(ret);
		}).catch((err) => {
			reject(err);
		});
	});
}

function import_events() {
	return new Promise((resolve, reject) => {
		let promises = [];
		_.each(databases, (database) => {
			promises.push(new Promise(function(resolveQuery, rejectQuery) {
				let sql = 'SELECT * FROM ballcomplete_' + database.db + '.vacomplete';
				if (database.prefix.length) {
					sql += ' WHERE ';
				}
				let or = '';
				_.each(database.prefix, (prefix) => {
					if (prefix) {
						sql += or + 'RechnungNummerPraefix LIKE \'' + prefix + '%\' OR ScancodesPraefix LIKE \'' + prefix + '%\'';
					} else {
						sql += or + 'RechnungNummerPraefix = \'\'';
					}
					or = ' OR '
				});
				ballcomplete.query(sql, function(err, res) {
					if (err) {
						console.log(err);
						rejectQuery();
					} else {
						let sql = 'INSERT INTO innoEvent (';
						sql += 'EventID,';
						sql += 'EventPromoterID,';
						sql += 'EventLocationID,';
						sql += 'EventName,';
						sql += 'EventPrefix,';

						sql += 'EventPhone1,';
						sql += 'EventPhone2,';
						sql += 'EventFax,';
						sql += 'EventEmail,';
						sql += 'EventHomepage,';

						sql += 'EventSubdomain,';

						sql += 'EventStartBillNumber,';

						sql += 'EventMaximumSeats,';
						sql += 'EventStepSeats,';

						sql += 'EventDefaultTaxTicketPercent,';
						sql += 'EventDefaultTaxSeatPercent,';

						sql += 'EventStartDateTimeUTC,';
						sql += 'EventEndDateTimeUTC,';
						sql += 'EventSaleStartDateTimeUTC,';
						sql += 'EventSaleEndDateTimeUTC,';
						sql += 'EventScanStartDateTimeUTC,';
						sql += 'EventScanEndDateTimeUTC,';

						// additional costs
						sql += 'EventHandlingFeeName,';
						sql += 'EventHandlingFeeGrossInternal,';
						sql += 'EventHandlingFeeGrossExternal,';
						sql += 'EventHandlingFeeTaxPercent,';

						sql += 'EventShippingCostName,';
						sql += 'EventShippingCostGrossExternal,';
						sql += 'EventShippingCostTaxPercent,';
						//////////////////////////////////////////

						sql += 'EventSendMailAddress,';
						sql += 'EventSendMailServer,';
						sql += 'EventSendMailServerPort,';
						sql += 'EventSendMailUsername,';
						sql += 'EventSendMailPassword,';
						sql += 'EventSendMailSettingsJSON,';

						sql += 'EventMpayTestFlag,';
						sql += 'EventMpayMerchantID,';
						sql += 'EventMpaySoapPassword,';
						sql += 'EventMpayTestMerchantID,';
						sql += 'EventMpayTestSoapPassword';
						sql += ') VALUES ';
						let comma = '';
						_.each(res, (row) => {

							let Prefix = ((row.RechnungNummerPraefix) ? row.RechnungNummerPraefix : row.ScancodesPraefix);

							if (Prefix == 'PRÄFI') {
								Prefix = 'PRÄ' + row.SysCode.substr(2, 2);
							}
							if (row.ScancodesPraefix == 'BOKU19') {
								Prefix = 'BOK19';
							}

							let ID = _convertID(row.SysCode);

							locations[database.location].events.push({'db': database.db, 'LocationID': locations[database.location].ID, 'SysCodeVA': row.SysCode, 'EventID': ID, 'EventPrefix': Prefix, 'tickets': [], 'special': [], 'seats': [], 'floors': [], 'rooms': []});

							sql += comma + "\n(";
							sql += "'" + ID + "',";
							sql += "'" + database.promoter.ID + "',";
							sql += "'" + locations[database.location].ID + "',";
							sql += "'" + row.Bezeichnung + "',";
							sql += "'" + Prefix + "',";

							sql += "'" + database.promoter.phone1 + "',";
							sql += "'" + database.promoter.phone2 + "',";
							sql += "'" + database.promoter.fax + "',";
							sql += "'" + database.promoter.email + "',";
							sql += "'" + database.promoter.homepage + "',";

							sql += "'" + Prefix + "',";

							sql += "'" + row.RechnungNummerStart + "',";

							sql += "'" + row.maxBestellmengeSitzplatzkarten + "',";
							sql += "'" + row.stepBestellmengeSitzplatzkarten + "',";

							sql += "'" + row.RechnungUstStandard + "',";
							sql += "'" + row.RechnungUstStandard + "',";

							sql += "'" + _dateTime(row.VADatumUhrzeit) + "',";
							sql += "'" + _dateTime(row.VADatumUhrzeitEnde) + "',";
							sql += "'" + _dateTime(row.VAVerkaufsbeginn) + "',";
							sql += "'" + _dateTime(row.VAVerkaufsende) + "',";
							sql += "'" + _dateTime(row.einlassBeginnTimestamp) + "',";
							sql += "'" + _dateTime(row.einlassEndeTimestamp) + "',";

							// additional costs
							sql += "'Bearbeitungsgebühr',";
							sql += (row.GebuehrIntern) ? "'" + row.GebuehrIntern + "'," : 0.00 + ','; 					// EventInternalHandlingFeeGross
							sql += (row.GebuehrExtern) ? "'" + row.GebuehrExtern + "'," : 0.00 + ','; 					// EventExternalHandlingFeeGross
							sql += (row.GebuehrExternUst) ? "'" + row.GebuehrExternUst + "'," : 0.00 + ','; 			// EventExternalHandlingFeeTaxPercent
							sql += "'Versandkosten',";
							sql += (row.VersandGebuehrPostEU) ? "'" + row.VersandGebuehrPostEU + "'," : 0.00 + ','; 	// EventInternalShippingCostGross
							sql += (row.VersandUst) ? "'" + row.VersandUst + "'," : 0.00 + ','; 						// EventInternalShippingCostTaxPercent
							//////////////////////////////////////////

							sql += "'" + row.MailversandEmailAdresse + "',";
							sql += "'" + row.MailversandSMTPServer + "',";
							sql += "'" + row.MailversandSMTPPort + "',";
							sql += "'" + row.MailversandBenutzername + "',";
							sql += "'" + row.MailversandPasswort + "',";
							sql += "null,";

							sql += "'" + row.mpayTestFlag + "',";
							sql += "'" + row.mpayMerchantID + "',";
							sql += "'" + row.mpaySoapPassword + "',";
							sql += "'" + row.mpayTestMerchantID + "',";
							sql += "'" + row.mpayTestSoapPassword + "'";

							sql += ")";

							comma = ',';
						});
						sql += ';';
						resolveQuery(sql);
					}
				});
			}));
		});
		Promise.all(promises).then((resArray) => {
			let ret = '';
			_.each(resArray, (res) => {
				ret += res + '\n';
			});
			resolve(ret);
		}).catch((err) => {
			reject(err);
		});
	});
}

function import_orders() {
	return new Promise((resolve, reject) => {
		let users = {};
		let promises = [];
		_.each(databases, (database) => {
			promises.push(new Promise(function(resolveQuery, rejectQuery) {
				let sql = 'SELECT * FROM ballcomplete_' + database.db + '.vacomplete_bestellungen WHERE (';
				let or = '';
				_.each(database.prefix, (prefix) => {
					if (prefix) {
						sql += or + 'RechnungNummerPraefix LIKE \'' + prefix + '%\'' + ' OR RechnungNummerText LIKE \'' + prefix + '%\'';
					} else {
						sql += or + 'RechnungNummerPraefix = \'\'';
					}
					or = ' OR '
				});
				sql += ") AND (SysStatus='abgeschlossen' OR SysStatus='storniert' OR SysStatus='gutschrift' OR SysStatus='initUeberweisung')";
				ballcomplete.query(sql, function(err, res) {
					if (err) {
						console.log(err);
						rejectQuery();
					} else {
						if (res.length) {
							let sql = '';

							sql += 'INSERT INTO innoOrder (';
							sql += '`OrderID`,';
							sql += '`OrderNumber`,';
							sql += '`OrderNumberText`,';
							sql += '`OrderPromoterID`,';
							sql += '`OrderEventID`,';
							sql += '`OrderType`,';
							sql += '`OrderPayment`,';
							sql += '`OrderState`,';
							sql += '`OrderDateTimeUTC`,';
							sql += '`OrderPayedDateTimeUTC`,';
							sql += '`OrderFromUserID`,';
							sql += '`OrderUserID`,';
							sql += '`OrderCompany`,';
							sql += '`OrderCompanyUID`,';
							sql += '`OrderGender`,';
							sql += '`OrderTitle`,';
							sql += '`OrderFirstname`,';
							sql += '`OrderLastname`,';
							sql += '`OrderStreet`,';
							sql += '`OrderCity`,';
							sql += '`OrderZIP`,';
							sql += '`OrderCountryCountryISO2`,';

							sql += '`OrderComment`,';

							sql += '`OrderUserEmail`,';
							sql += '`OrderGrossPrice`,';
							sql += '`OrderNetPrice`) VALUES ';


							let comma = '';
							_.each(res, (row) => {

								let ID = _convertID(row.SysCode);
								let Number = row.RechnungNummer;
								let NumberText = row.RechnungNummerText;
								let Anmerkung = row.Anmerkungen;

								let EventID = _convertID(row.SysCodeVA);
								let Type = 'order';
								let State = 'open';
								switch (row.SysStatus) {
									case 'abgeschlossen':
										Type = 'order';
										State = 'payed';
										break;
									case 'initUeberweisung':
										Type = 'order';
										State = 'open';
										break;
									case 'storniert':
										Type = 'order';
										State = 'payed';
										break;
									case 'gutschrift':
										Type = 'credit';
										State = 'payed';
										break;
								}
								let Payment = 'cash';
								switch (row.artZahlung) {
									case 'mpay':
										Payment = 'mpay';
										break;
									case 'ueberweisung':
										Payment = 'transfer';
										break;
									case 'bar':
										Payment = 'cash';
										break;
								}

								let DateTimeUTC = _dateTime(row.RechnungTimestamp);

								let datum = new Date(row.updateDatetime);
								let PayedDateTimeUTC = _dateTime(datum.getTime() / 1000);

								if (row.SysCodeBenutzer == 'Idf2jjj8aj1j9j90j02jf9889ahgnpg8h43hifawhlief3lia3ali') {
									row.SysCodeBenutzer = 'Idaeeb9471416130460e8e2addec6f069dc99c23595745ae1720150120134221';
								}

								let FromUserID = _convertID(row.SysCodeBenutzer);

								row.UID
								if (row.UID == 'UID ATU16080602') {
									row.UID = 'ATU16080602';
								}
								if (row.UID == 'Wirtschaftskammer Wien Lehrlingstelle') {
									row.Firma = 'Wirtschaftskammer Wien Lehrlingstelle';
									row.UID = '';
								}

								let rowUID = row.UID ? row.UID.trim().replaceAll("'", "´") : null;

								let Address = ((row.Firma) ? ",'" + row.Firma.trim().replaceAll("'", "´").substr(0, 150) + "'" : ',null'); //
								Address += ((row.UID) ? ",'" + rowUID.substring(0, 30) + "'" : ',null'); //'`OrderCompanyUID`,';
								Address += ((row.Anrede == 'Frau') ? ",'f'" : ",'m'"); //'`OrderGender`,';
								Address += ((row.Titel) ? ",'" + row.Titel.trim().replaceAll("'", "´").substr(0, 50) + "'" : ',null'); //'`OrderTitle`,';
								Address += ((row.Vorname) ? ",'" + row.Vorname.trim().replaceAll("'", "´").substr(0, 50) + "'" : ',null'); //'`OrderFirstname`,';
								Address += ((row.Nachname) ? ",'" + row.Nachname.trim().replaceAll("'", "´").substr(0, 50) + "'" : ',null'); //'`OrderLastname`,';
								Address += ((row.Strasse) ? ",'" + row.Strasse.trim().replaceAll("'", "´").substr(0, 120) + "'" : ',null'); //'`OrderStreet`,';
								Address += ((row.Ort) ? ",'" + row.Ort.trim().replaceAll("'", "´").substr(0, 100) + "'" : ',null'); //'`OrderCity`,';
								Address += ((row.PLZ) ? ",'" + row.PLZ.trim().replaceAll("'", "´").substr(0, 20) + "'" : ',null'); //'`OrderZIP`,';

								let country = 'AT';
								_.each(laender, (land) => {
									if (land.de == row.Land || land.en == row.Land) {
										country = land.ISO2;
									}
								});
								Address += ",'" + country + "'"; //'`OrderCountryCountryISO2`,';

								let IDUser = _generateUUID();
								let Email = row.Email.trim();

								if (row.Vorname.trim() == 'Johann' && row.Nachname.trim() == 'Preissl' && row.PLZ == '1220') Email = '';
								if (row.Vorname.trim() == 'Erika' && row.Nachname.trim() == 'Steinbach' && row.PLZ == '1070') {
									Email = '';
									row.Mobil = '+436643149207';
								}

								if (row.Email == 'roman.marlovits@gmail.com') {
									Email = 'roman.marlovits@webcomplete.at';
								}

								if (Email.length < 3) {
									Email = row.Firma.toLowerCase().trim();
									if (Email && (row.Vorname)) {
										Email += '.';
									}
									if (row.Vorname) {
										Email += row.Vorname.toLowerCase().trim();
									}
									if (Email && row.Nachname) {
										Email += '.';
									}
									if (row.Nachname) {
										Email += row.Nachname.toLowerCase().trim();
									}
									if (!Email) {
										Email = IDUser;
									}
									Email = 'visitor.' + Email + '@ticketselect.at';
								}

								Email = Email.toLowerCase();
								Email = Email.replaceAll(' ', '.');
								Email = Email.replaceAll(',', '_');
								Email = Email.replaceAll(':', '');
								Email = Email.replaceAll(';', '');
								Email = Email.replaceAll('"', '');
								Email = Email.replaceAll("'", '');
								Email = Email.replaceAll('&', '');
								Email = Email.replaceAll('=', '');
								Email = Email.replaceAll('?', '');
								Email = Email.replaceAll('$', '');
								Email = Email.replaceAll('+', '');
								Email = Email.replaceAll('*', '');
								Email = Email.replaceAll('/', '');
								Email = Email.replaceAll('(', '');
								Email = Email.replaceAll(')', '');
								Email = Email.replaceAll('ä', 'ae');
								Email = Email.replaceAll('ö', 'oe');
								Email = Email.replaceAll('ü', 'ue');
								Email = Email.replaceAll('ß', 'ss');
								Email = Email.replaceAll('....', '.');
								Email = Email.replaceAll('...', '.');
								Email = Email.replaceAll('..', '.');
								Email = Email.replaceAll('.-.', '.');
								Email = Email.replaceAll('-.', '.');
								Email = Email.replaceAll('.-', '.');
								Email = Email.replaceAll('._.', '.');
								Email = Email.replaceAll('_.', '.');
								Email = Email.replaceAll('._', '.');
								Email = Email.replaceAll('.@', '@');

								if (Email.slice(-1) === '.') {
									Email = Email.substring(0, Email.length - 1);
								}

								if (Email.substring(0, 1) === '.') {
									Email = Email.substring(1, Email.length);
								}

								if (Email == 'a.ettl@chiesi.com.a.braun@chiesi.com') Email = 'a.ettl@chiesi.com';
								if (Email == 'brigitte.huebner.<b-h.huebner@gmx.de>') Email = 'b-h.huebner@gmx.de';
								if (Email == 's.shehatanikolausapo.<s.shehata@nikolausapo.at>') Email = 's.shehata@nikolausapo.at';
								if (Email == 'hohensinner.franz.<franz.hohensinner@viforpharma.com>') Email = 'franz.hohensinner@viforpharma.com';
								if (Email == 'markus.huepfl.<markus.h@one2three.cc>') Email = 'markus.h@one2three.cc';
								if (Email == 'rosa.krottendorfer@wkw') Email = 'rosa.krottendorfer@wkw.at';
								if (Email == 'dr.helmut.siller.betriebsbersatung.imd.training.helmut.siller;.msc@ticketselect.at') Email = 'siller@beeratung.net';
								if (Email == 'adolf.wurzer@chello') Email = 'adolf.wurzer@chello.at';
								if (Email == 'erich.putz@wko') Email = 'erich.putz@wko.at';
								if (Email == 'gabriele.infager@mond') Email = 'gabriele.infager@mondimido.at';
								if (Email == 'klaus.weikhard.at') Email = 'office@weikhard.at';
								if (Email == 'hanschitz@managementclub') Email = 'hanschitz@managementclub.at';
								if (Email == 'erich@mihokovic') Email = 'erich@mihokovic.hr';
								if (Email == 'sandra.foitl') Email = 'sandra.foitl@wko.at';
								if (Email == 'beata.saria') Email = 'beata.saria@sariabeata.at';
								if (Email == 'office@mehrgeld') Email = 'office@mehrgeld.at';
								if (Email == 'auerwifiwien.at') Email = 'auer@wifiwien.at';
								if (Email == 'anton@a1_net') Email = 'anton@a1.net';
								if (Email == 'office@visitronic') Email = 'office@visitronic.de';
								if (Email == 'info@ivents') Email = 'info@ivents.at';
								if (Email == 'info@ivents_at') Email = 'info@ivents.at';
								if (Email == 'gabriele.infager@mond') Email = 'gabriele.infager@mondimido.at';

								if (row.Firma.trim() == 'Fachverband UBIT' && row.Strasse.indexOf('Wiedner') != -1) Email = 'angela.posch@wko.at';
								if (row.Vorname.trim() == 'Gabriele' && row.Nachname.trim() == 'Führer') Email = 'gabriele.fuehrer@wkw.at';
								if (row.Vorname.trim() == 'Helmut' && row.Nachname.trim() == 'Siller; MSc') Email = 'siller@beeratung.net';
								if (row.Vorname.trim() == 'Margin' && row.Nachname.trim() == 'Prunbauer' && row.Strasse.indexOf('Schmerlingplatz') != -1) Email = 'prunbauer@prunbauer.at';
								if (row.Vorname.trim() == 'Martin' && row.Nachname.trim() == 'Prunbauer' && row.Strasse.indexOf('Schmerlingplatz') != -1) Email = 'prunbauer@prunbauer.at';
								if (row.Firma == 'Sparte Transport und Verkehr') Email = 'bstv@wko.at';
								if (row.Firma == 'Ertler Immobilien GmbH') Email = 'rudolf@ertler.at';

								if (row.Vorname.trim() == 'Gabriele' && row.Nachname.trim() == 'Leitner' && row.PLZ.indexOf('1220') != -1) {
									Email = 'gabriele.leitner@wko.at';
									row.Telefon1 = '+436641048155';
								}


								if (row.Vorname.trim() == 'Hans' && row.Nachname.trim() == 'Heizinger' && row.PLZ.indexOf('1040') != -1) {
									Email = 'hans.heinzinger@chello.at';
									row.Telefon1 = '+4315811044';
									row.Mobil = '+436767820789';
								}


								if (row.Vorname.trim() == 'Gerhard' && row.Nachname.trim() == 'Zillner' && row.Strasse.indexOf('Perlasgasse') != -1) {
									Email = 'g.zillner@optimierer.at';
									row.Telefon1 = '+436641032289';
									row.Titel = 'Mag.';
								}

								if (row.Telefon1 == 'michael.osinger@erstebank.at') {
									Email = 'michael.osinger@erstebank.at';
									row.Telefon1 = '';
								}

								if (Email == 'sg@connections.com') {
									row.Telefon1 = '+4317320757315046677';
								}

								row.Telefon1 = row.Telefon1.replaceAll(' ', '');
								row.Telefon1 = row.Telefon1.replaceAll('/', '');
								row.Telefon1 = row.Telefon1.replaceAll('-', '');
								row.Telefon1 = row.Telefon1.replaceAll('(', '');
								row.Telefon1 = row.Telefon1.replaceAll(')', '');
								row.Telefon1 = row.Telefon1.replaceAll('0044', '+44');
								row.Telefon1 = row.Telefon1.replaceAll('06', '+436');

								if (row.Telefon1.substring(0, 1) == '0') {
									row.Telefon1 = '+43' + row.Telefon1.substring(1);
								}

								row.Mobil = row.Mobil.replaceAll(' ', '');
								row.Mobil = row.Mobil.replaceAll('/', '');
								row.Mobil = row.Mobil.replaceAll('-', '');
								row.Mobil = row.Mobil.replaceAll('(', '');
								row.Mobil = row.Mobil.replaceAll(')', '');
								row.Mobil = row.Mobil.replaceAll('0044', '+44');
								row.Mobil = row.Mobil.replaceAll('06', '+436');

								if (row.Mobil.substring(0, 1) == '0') {
									row.Mobil = '+43' + row.Mobil.substring(1);
								}


								if (!users[Email]) {

									if (!validateEmail(Email)) {
										Email = row.Firma.toLowerCase().trim();
										if (Email && (row.Vorname)) {
											Email += '.';
										}
										if (row.Vorname) {
											Email += row.Vorname.toLowerCase().trim();
										}
										if (Email && row.Nachname) {
											Email += '.';
										}
										if (row.Nachname) {
											Email += row.Nachname.toLowerCase().trim();
										}
										if (!Email) {
											Email = IDUser;
										}
										Email = 'visitor.' + Email + '@ticketselect.at';
									}

									let Strasse = row.Strasse.trim();
									if (row.Hausnummer) Strasse += '/' + row.Hausnummer.trim();
									if (row.Stiege) Strasse += '/' + row.Stiege.trim();
									if (row.Stock) Strasse += '/' + row.Stock.trim();
									if (row.Tuer) Strasse += '/' + row.Tuer.trim();

									let country = 'AT';
									_.each(laender, (land) => {
										if (land.de == row.Land || land.en == row.Land) {
											country = land.ISO2;
										}
									});

									let company = row.Firma.replaceAll("'", "´").trim();
									let title = row.Titel.replaceAll("'", "´");
									let firstname = row.Vorname.replaceAll("'", "´").trim();
									let lastname = row.Nachname.replaceAll("'", "´").trim();
									let street = Strasse.replaceAll("'", "´").trim();
									let city = row.Ort.replaceAll("'", "´").trim();
									let zip = row.PLZ.replaceAll("'", "´").trim();
									let phone1 = row.Telefon1.replaceAll().trim();
									let phone2 = row.Mobil.replaceAll().trim();

									row.UID
									if (row.UID == 'UID ATU16080602') {
										row.UID = 'ATU16080602';
									}
									if (row.UID == 'Wirtschaftskammer Wien Lehrlingstelle') {
										company = 'Wirtschaftskammer Wien Lehrlingstelle';
										row.UID = '';
									}

									let uid = (row.UID) ? row.UID.trim() : '';

									users[Email] = {
										'ID': IDUser,
										'Email': Email,
										'LangCode': (row.SysSprache) ? row.SysSprache.toLowerCase() : 'de',
										'Company': company.substring(0, 100),
										'CompanyUID': uid.substring(0, 30),
										'Gender': (row.Geschlecht == 'm' || row.Anrede == 'Firma') ? 'm' : 'f',
										'Title': title.substring(0, 50),
										'Firstname': firstname.substring(0, 50),
										'Lastname': lastname.substring(0, 50),
										'Street': street.substring(0, 120),
										'City': city.substring(0, 100),
										'ZIP': zip.substring(0, 20),
										'CountryISO2': country,
										'Phone1': phone1.substring(0, 30),
										'Phone2': phone2.substring(0, 30)
									}
								} else {
									IDUser = users[Email].ID;
								}

								let GrossPrice = row.Brutto;
								let NetPrice = row.Netto;

								let PromoterID = database.promoter.ID;

								sql += comma + "\n('" + ID + "','" + Number + "','" + NumberText + "','" + PromoterID + "','" + EventID + "','" + Type + "','" + Payment + "','" + State + "','" + DateTimeUTC + "','" + PayedDateTimeUTC + "','" + FromUserID + "','" + IDUser + "'" + Address + ",'" + Anmerkung + "','" + Email.replaceAll("'", "") + "','" + GrossPrice + "','" + NetPrice + "')";
								comma = ',';
							});
							sql += ';';
							resolveQuery(sql);
						} else {
							resolveQuery();
						}
					}
				});
			}));
		});
		Promise.all(promises).then((resArray) => {
			let ret = '';
			_.each(resArray, (res) => {
				if (res) {
					ret += res + '\n';
				}
			});

			let content = 'use ticketing_db;\n\n';

			content += "insert into `innoUser` (`UserID`, `UserType`, `UserEmail`, `UserLangCode`, `UserFirstname`, `UserLastname`, `UserPassword`, `UserPasswordSalt`) VALUES ('" + _generateUUID() + "', 'admin', 'admin@admin.tld', 'de-at', 'Admin', 'Admin'," +
				" 'd0c6f7e3103f037ed50d3f4635de64ee6e890cd9a7e9a23993de20b716ff6e22a4e9fad925ec5cbc1395a09dcec56ecf80ec53395e2d9e306bcab00ee4e810f7','xcVHkOeKHiJN9Hvr5HiSmufLdDHMyhk6ODYzV7DSwujH6tniGjl7qGQ7OQ0Vdb0lLSUnzkRcjmgsP9ZevoHNmMp3WcQwqaob3fVfX6zD5GufrFc0hdXGpQ1NNug5I0vs');\n"

			content += 'INSERT INTO innoUser (`UserID`,`UserEmail`,`UserLangCode`,`UserCompany`,`UserCompanyUID`,`UserGender`,`UserTitle`,`UserFirstname`,`UserLastname`,`UserStreet`,`UserCity`,`UserZIP`,`UserCountryCountryISO2`,`UserPhone1`,`UserPhone2`) VALUES ';

			let comma = '';
			_.each(users, (user) => {
				if (user.Email != 'admin@admin.tld') {
					if (user.CompanyUID == 'UID ATU16080602') {
						user.CompanyUID = 'ATU16080602';
					}
					if (user.CompanyUID == 'Wirtschaftskammer Wien Lehrlingstelle') {
						user.Company = 'Wirtschaftskammer Wien Lehrlingstelle';
						user.CompanyUID = '';
					}
					content += comma + "\n('" + user.ID + "','" + user.Email + "','" + user.LangCode + "','" + user.Company + "','" + user.CompanyUID + "','" + user.Gender + "','" + user.Title + "','" + user.Firstname + "','" + user.Lastname + "','" + user.Street + "','" + user.City + "','" + user.ZIP + "','" + user.CountryISO2 + "','" + user.Phone1 + "','" + user.Phone2 + "')";
					comma = ',';
				}
			});
			let file = 'sql/z_20_data_users.sql';
			fs.writeFile(file, content.replaceAll("''", 'null'), function(err) {
				if (err) {
					reject(err);
				}
				console.log('-- \'' + file + '\' saved');
				resolve(ret);
			});
		}).catch((err) => {
			reject(err);
		});
	});
}

function import_orders_details() {
	return new Promise((resolve, reject) => {
		let promises = [];
		_.each(databases, (database) => {
			promises.push(new Promise(function(resolveQuery, rejectQuery) {
				let orders = 'ballcomplete_' + database.db + '.vacomplete_bestellungen';
				let details = 'ballcomplete_' + database.db + '.vacomplete_bestellungen_details';
				let SysStatus = '((' + orders + ".SysStatus = 'abgeschlossen'";
				SysStatus += ' OR ' + orders + ".SysStatus = 'gutschrift'";
				SysStatus += ' OR ' + orders + ".SysStatus = 'storniert'";
				//SysStatus += ' OR ' + orders + ".SysStatus = 'reservierung'";
				SysStatus += ' OR ' + orders + ".SysStatus = 'initUeberweisung'";
				SysStatus += ") AND " + orders + ".artZahlung != 'reservierung')";
				let sql = 'SELECT ' + details + '.*,' + orders + '.artZahlung,' + orders + '.SysStatus AS SysStatusBestellung FROM (' + details + ' INNER JOIN ' + orders + ' ON (' + orders + '.SysCode = ' + details + '.SysCodeBestellung AND ' + SysStatus + ')) WHERE (' + details + '.SysStatus = \'ve\' OR ' + details + '.SysStatus = \'st\') AND (';
				let or = '';
				let prefix_string = '';
				_.each(database.prefix, (prefix) => {
					if (prefix) {
						sql += or + '' + details + '.Scancode LIKE \'' + prefix + '%\'';
					} else {
						sql += or + '' + details + '.Scancode LIKE \'AEA%\'';
					}
					or = ' OR ';
					prefix_string += '_' + prefix.toLowerCase();
				});
				sql += ')';
				ballcomplete.query(sql, function(err, res) {
					if (err) {
						console.log(err);
						rejectQuery();
					} else {
						if (res.length) {
							let orders_update = {};
							let sql = 'INSERT INTO innoOrderDetail (`OrderDetailScanCode`,`OrderDetailScanNumber`,`OrderDetailEventID`,`OrderDetailOrderID`,`OrderDetailTypeID`,`OrderDetailType`,`OrderDetailState`,`OrderDetailText`,`OrderDetailGrossRegular`,`OrderDetailGrossDiscount`,`OrderDetailGrossPrice`,`OrderDetailTaxPercent`) VALUES ';
							let comma = '';
							let onlyOne = {'BWW1932069020': true, 'BWW1786064378': true, 'BWW1788085210': true};
							_.each(res, (row) => {
								//  `SysStatus` enum('online','initMPAY','initUeberweisung','intern','abgeschlossen','storniert','gutschrift','reservierung') NOT NULL,
								//  `SysType` enum('online','intern','startbeleg','abschlussbeleg') NOT NULL,
								if (row.SysStatus == 've' || row.SysStatus == 'st') {

									let Scancode = row.Scancode;

									let doit = true;
									if ((Scancode == 'BWW1932069020' || Scancode == 'BWW1786064378' || Scancode == 'BWW1788085210') && onlyOne[Scancode] == true) {
										onlyOne[Scancode] = false;
										doit = false;
									}

									if (doit) {
										let Scannumber = Scancode.substring(Scancode.length - 6, Scancode.length - 1);
										if (!row.SysCodeVA) {
											console.log(row);
										}
										let EventID = _convertID(row.SysCodeVA);
										let OrderID = _convertID(row.SysCodeBestellung);
										let TypeID = _convertID(row.SysCodeKarte);
										let Type = '';				// type of order detail => ti=entry ticket | se=seat at location | sp=upselling like Tortengarantie | sc=shipping costs | hf=handling fee
										switch (row.SysArt) {
											case 'eintrittskarte':
												Type = 'ticket';
												break;
											case 'sitzplatzkarte':
												Type = 'seat';
												break;
											case 'sonderleistung':
												Type = 'special';
												break;
											case 'spesenVersand':
												Type = 'shippingcost';
												break;
											case 'spesenBearbeiten':
												Type = 'handlingfee';
												break;
											default:
												break;
										}
										let State = (row.SysStatus == 've') ? 'sold' : 'canceled';

										let Text = row.Text;

										let GrossRegular = row.Brutto;
										let GrossDiscount = row.Rabatt;
										let GrossPrice = row.Preis;
										let TaxPercent = 0;

										sql += comma + "\n('" + Scancode + "'," + Scannumber + ",'" + EventID + "','" + OrderID + "','" + TypeID + "','" + Type + "','" + State + "','" + Text + "','" + GrossRegular + "','" + GrossDiscount + "','" + GrossPrice + "','" + TaxPercent + "')";
										comma = ',';
									}
								}
							});
							resolveQuery({'db': database.db + prefix_string, 'sql': sql});
						} else {
							resolveQuery(null);
						}
					}
				});
			}));
		});
		Promise.all(promises).then((resArray) => {
			let promisesWrite = [];
			_.each(resArray, (res) => {
				if (res) {
					promisesWrite.push(_writeFile('sql/z_42_data_orders_details_' + res.db + '.sql', res.sql + '\n'));
				}
			});
			Promise.all(promisesWrite).then(() => {
				resolve();
			}).catch((err) => {
				reject(err);
			});
		});
	});
}

function import_orders_tax() {
	return new Promise((resolve, reject) => {
		let promises = [];
		let users = {};
		_.each(databases, (database) => {
			promises.push(new Promise(function(resolveQuery, rejectQuery) {
				let sql = 'SELECT SysCode FROM ballcomplete_' + database.db + '.vacomplete_bestellungen WHERE (';
				let or = '';
				let prefix_string = '';
				_.each(database.prefix, (prefix) => {
					if (prefix) {
						sql += or + 'RechnungNummerPraefix LIKE \'' + prefix + '%\'' + ' OR RechnungNummerText LIKE \'' + prefix + '%\'';
					} else {
						sql += or + 'RechnungNummerPraefix = \'\'';
					}
					or = ' OR '
					prefix_string += '_' + prefix.toLowerCase();
				});
				sql += ") AND (SysStatus='abgeschlossen' OR SysStatus='storniert' OR SysStatus='gutschrift' OR SysStatus='initUeberweisung')";

				ballcomplete.query(sql, function(err, res) {
					if (err) {
						console.log(err);
						rejectQuery();
					} else {
						if (res.length) {
							let promisesTax = [];
							let sqlUst = 'INSERT INTO innoOrderTax (`OrderTaxOrderID`,`OrderTaxPercent`,`OrderTaxAmount`) VALUES ';
							let comma = '';
							_.each(res, (row) => {
								promisesTax.push(new Promise((resolve, reject) => {
									ballcomplete.query('SELECT * FROM ballcomplete_' + database.db + '.vacomplete_bestellungen_summen_ust WHERE SysCodeBestellung = \'' + row.SysCode + '\' AND Ust != 0.00 AND Betrag != 0.00', function(err, res) {
										if (err) {
											console.log(err);
											reject();
										} else {
											resolve(res);
										}

									});
								}));
							});
							Promise.all(promisesTax).then((resPromises) => {
								_.each(resPromises, (rowPromise) => {
									_.each(rowPromise, (row) => {
										sqlUst += comma + "\n('" + row.SysCodeBestellung + "'," + row.Ust + "," + row.Betrag + ")";
										comma = ',';
									});
								});
								if (comma) {
									resolveQuery({'db': database.db + prefix_string, 'sql': sqlUst});
								} else {
									resolveQuery();
								}
							});
						} else {
							resolveQuery();
						}
					}
				});
			}));
		});
		Promise.all(promises).then((resArray) => {
			let promisesWrite = [];
			_.each(resArray, (res) => {
				if (res) {
					promisesWrite.push(_writeFile('sql/z_43_data_orders_taxes_' + res.db + '.sql', res.sql + '\n'));
				}
			});
			Promise.all(promisesWrite).then(() => {
				resolve();
			}).catch((err) => {
				reject(err);
			});
		}).catch((err) => {
			reject(err);
		});
	});
}

function _fetch_countries() {
	return new Promise((resolve, reject) => {
		let sql = 'SELECT ISO2,de,en FROM ballcomplete_zbb.laender';
		ballcomplete.query(sql, function(err, res) {
			if (err) {
				console.log(err);
				reject();
			} else {
				laender = res;
				resolve(res);
			}

		});
	});
}

function _query(sql, data = null) {
	return new Promise((resolve, reject) => {
		ballcomplete.query(sql, function(err, res) {
			if (err) {
				console.log(err);
				reject();
			} else {
				//console.log('done query: ', sql);
				if (data) {
					resolve({res: res[0], data: data});
				} else {
					resolve(res);
				}
			}
		});
	});
}

function _queryAll(sql, data = null) {
	return new Promise((resolve, reject) => {
		ballcomplete.query(sql, function(err, res) {
			if (err) {
				console.log(err);
				reject();
			} else {
				//console.log('done query: ', sql);
				if (data) {
					resolve({res: res, data: data});
				} else {
					resolve(res);
				}
			}
		});
	});
}

function _generateUUID() {
	return randtoken.generate(32);
}

function _convertID(id) {
	let uuid = id;
	if (id.length > 32) {
		uuid = id.substring(2, 18);
		uuid += id.slice(-14);
	}
	return uuid;
}

function _dateTime(timestamp) {
	let datetime = new Date(timestamp * 1000);
	datetime = new Date((timestamp * 1000) + (datetime.getTimezoneOffset() * 60000));
	return dateFormat(datetime, "yyyy-mm-dd HH:MM:ss");
}

function _writeFile(file, content) {
	return new Promise((resolve, reject) => {
		content = 'use ticketing_db;\n\n' + content.replaceAll("''", 'null');
		fs.writeFile(file, content, function(err) {
			if (err) {
				reject(err);
			}
			console.log('-- \'' + file + '\' saved');
			resolve();
		});
	});
}


