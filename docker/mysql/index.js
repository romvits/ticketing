import mysql from 'mysql';
import _ from 'lodash';
import randtoken from "rand-token";
import dateFormat from 'dateformat';
import fs from 'fs';

String.prototype.replaceAll = function(search, replacement) {
	var target = this;
	return target.split(search).join(replacement);
};

let databases = [
	{
		'db': 'graz_2015', 'prefix': ['HLW'], 'promoter': {'ID': '', 'name': 'HLW Schrödinger', 'street': '', 'city': 'Graz', 'zip': '8010', 'countryISO2': 'AT', 'phone1': '', 'phone2': '', 'fax': '', 'homepage': '', 'email': 'office@ticketselect.at',}, 'users': ['333333333333333333333333333333', '111111111111111111111111111111'], 'location': 6
	}, {
		'db': 'graz_2015', 'prefix': ['AKG'], 'promoter': {'ID': '', 'name': 'Akademisches Gymnasium', 'street': '', 'city': 'Graz', 'zip': '8010', 'countryISO2': 'AT', 'phone1': '', 'phone2': '', 'fax': '', 'homepage': '', 'email': 'office@ticketselect.at',}, 'users': ['333333333333333333333333333333', '111111111111111111111111111111'], 'location': 4
	}, {
		'db': 'graz_2015', 'prefix': ['HIB'], 'promoter': {'ID': '', 'name': 'BG/BORG HIB Liebenau', 'street': '', 'city': 'Graz', 'zip': '8010', 'countryISO2': 'AT', 'phone1': '', 'phone2': '', 'fax': '', 'homepage': '', 'email': 'office@ticketselect.at',}, 'users': ['333333333333333333333333333333', '111111111111111111111111111111'], 'location': 4
	}, {
		'db': 'graz_2015', 'prefix': ['KIR'], 'promoter': {'ID': '', 'name': 'BG/BRG Kirchengasse', 'street': '', 'city': 'Graz', 'zip': '8010', 'countryISO2': 'AT', 'phone1': '', 'phone2': '', 'fax': '', 'homepage': '', 'email': 'office@ticketselect.at',}, 'users': ['333333333333333333333333333333', '111111111111111111111111111111'], 'location': 4
	}, {
		'db': 'graz_2015', 'prefix': ['LIC'], 'promoter': {'ID': '', 'name': 'BG/BRG Lichtenfels', 'street': '', 'city': 'Graz', 'zip': '8010', 'countryISO2': 'AT', 'phone1': '', 'phone2': '', 'fax': '', 'homepage': '', 'email': 'office@ticketselect.at',}, 'users': ['333333333333333333333333333333', '111111111111111111111111111111'], 'location': 4
	}, {
		'db': 'graz_2015', 'prefix': ['SEE'], 'promoter': {'ID': '', 'name': 'BG/BRG Seebacher', 'street': '', 'city': 'Graz', 'zip': '8010', 'countryISO2': 'AT', 'phone1': '', 'phone2': '', 'fax': '', 'homepage': '', 'email': 'office@ticketselect.at',}, 'users': ['333333333333333333333333333333', '111111111111111111111111111111'], 'location': 4
	}, {
		'db': 'graz_2015', 'prefix': ['BIG'], 'promoter': {'ID': '', 'name': 'Bischöfliches Gymnasium', 'street': '', 'city': 'Graz', 'zip': '8010', 'countryISO2': 'AT', 'phone1': '', 'phone2': '', 'fax': '', 'homepage': '', 'email': 'office@ticketselect.at',}, 'users': ['333333333333333333333333333333', '111111111111111111111111111111'], 'location': 4
	}, {
		'db': 'graz_2015', 'prefix': ['WIK'], 'promoter': {'ID': '', 'name': 'BRG WIKU', 'street': '', 'city': 'Graz', 'zip': '8010', 'countryISO2': 'AT', 'phone1': '', 'phone2': '', 'fax': '', 'homepage': '', 'email': 'office@ticketselect.at',}, 'users': ['333333333333333333333333333333', '111111111111111111111111111111'], 'location': 4
	}, {
		'db': 'graz_2015', 'prefix': ['HAK'], 'promoter': {'ID': '', 'name': 'HAK Grazbachgasse', 'street': '', 'city': 'Graz', 'zip': '8010', 'countryISO2': 'AT', 'phone1': '', 'phone2': '', 'fax': '', 'homepage': '', 'email': 'office@ticketselect.at',}, 'users': ['333333333333333333333333333333', '111111111111111111111111111111'], 'location': 4
	}, {
		'db': 'graz_2015', 'prefix': ['ORT'], 'promoter': {'ID': '', 'name': 'HTBLuVA Ortwein', 'street': '', 'city': 'Graz', 'zip': '8010', 'countryISO2': 'AT', 'phone1': '', 'phone2': '', 'fax': '', 'homepage': '', 'email': 'office@ticketselect.at',}, 'users': ['333333333333333333333333333333', '111111111111111111111111111111'], 'location': 4
	}, {
		'db': 'graz_2015', 'prefix': ['URS'], 'promoter': {'ID': '', 'name': 'PG Ursulinen', 'street': '', 'city': 'Graz', 'zip': '8010', 'countryISO2': 'AT', 'phone1': '', 'phone2': '', 'fax': '', 'homepage': '', 'email': 'office@ticketselect.at',}, 'users': ['333333333333333333333333333333', '111111111111111111111111111111'], 'location': 4
	}, {
		'db': 'graz_2015', 'prefix': ['SAC'], 'promoter': {'ID': '', 'name': 'Sacré Coeur', 'street': '', 'city': 'Graz', 'zip': '8010', 'countryISO2': 'AT', 'phone1': '', 'phone2': '', 'fax': '', 'homepage': '', 'email': 'office@ticketselect.at',}, 'users': ['333333333333333333333333333333', '111111111111111111111111111111'], 'location': 4
	}, {
		'db': 'aea', 'prefix': [''], 'promoter': {'ID': '', 'name': 'Eventwerkstatt, Ilk & Partner KG', 'street': 'Hauptplatz 28', 'city': 'Linz', 'zip': '4020', 'countryISO2': 'AT', 'phone1': '+437327811740', 'phone2': '', 'fax': '', 'homepage': 'https://www.eventwerkstatt.at', 'email': 'office@eventwerkstatt.at',}, 'users': [''], 'location': 0
	}, {
		'db': 'boku', 'prefix': ['BWW'], 'promoter': {'ID': '', 'name': 'Boku Wien', 'street': 'Peter-Jordan-Straße 76', 'city': 'Wien', 'zip': '1190', 'countryISO2': 'AT', 'phone1': '+4314765419110', 'phone2': '', 'fax': '', 'homepage': 'https://bokuball.at', 'email': 'bokuballshop@oehboku.at',}, 'users': [''], 'location': 1
	}, {
		'db': 'bph', 'prefix': ['PH'], 'promoter': {'ID': '', 'name': 'Österreichische Apothekerkammer', 'street': 'Spitalgasse 31', 'city': 'Wien', 'zip': '1090', 'countryISO2': 'AT', 'phone1': '+43140414107', 'phone2': '', 'fax': '', 'homepage': 'https://www.pharmacieball.at', 'email': 'pharmacieball@apothekerkammer.at',}, 'users': [''], 'location': 1
	}, {
		'db': 'hbb', 'prefix': ['HBB', 'WBB'], 'promoter': {'ID': '', 'name': 'Wirtschaftsbund Wien', 'street': 'Lothringerstraße 16/5', 'city': 'Wien', 'zip': '1030', 'countryISO2': 'AT', 'phone1': '+431512763111', 'phone2': '+431512763134', 'fax': '', 'homepage': 'https://www.wirtschaftsbund.wien', 'email': 'office@hofburg-ball.at',}, 'users': [''], 'location': 1
	}, {
		'db': 'ibc', 'prefix': ['IBC'], 'promoter': {'ID': 'ivents', 'name': 'Ivents Kulturagentur', 'street': 'Wickenburggasse 32', 'city': 'Graz', 'zip': '8010', 'countryISO2': 'AT', 'phone1': '+43316225238', 'phone2': '', 'fax': '+4331622523815', 'homepage': 'http://www.ivents.at', 'email': 'info@ivents.at',}, 'users': [''], 'location': 4
	}, {
		'db': 'pdt', 'prefix': ['PDT'], 'promoterID': 'ivents', 'users': [''], 'location': 3
	}, {
		'db': 'voa', 'prefix': ['VLX'], 'promoterID': 'ivents', 'users': [''], 'location': 3
	}, {
		'db': 'jur', 'prefix': ['JUR'], 'promoter': {'ID': '', 'name': 'Juristenverband', 'street': 'Weihburggasse 4/2/9', 'city': 'Wien', 'zip': '1010', 'countryISO2': 'AT', 'phone1': '+4315122600', 'phone2': '', 'fax': '', 'homepage': 'https://www.juristenball.at', 'email': 'office@juristenverband.at',}, 'users': [''], 'location': 1
	}, {
		'db': 'lnc', 'prefix': ['LNC'], 'promoter': {'ID': '', 'name': 'Company Code', 'street': 'Joanneumring 16/2', 'city': 'Graz', 'zip': '8010', 'countryISO2': 'AT', 'phone1': '+43316232680', 'phone2': '', 'fax': '', 'homepage': 'http://www.companycode.at', 'email': 'office@companycode.at',}, 'users': [''], 'location': 5
	}, {
		'db': 'tub', 'prefix': ['TUB'], 'promoter': {'ID': '', 'name': 'Ballkomitee TU Ball', 'street': 'Wiedner Hauptstr. 8-10/E134', 'city': 'Wien', 'zip': '1040', 'countryISO2': 'AT', 'phone1': '+4315880141929', 'phone2': '+4315880115836', 'fax': '', 'homepage': 'http://www.tu-ball.at', 'email': 'tuball@cms.tuwien.ac.at',}, 'users': [''], 'location': 1
	}, {
		'db': 'zbb', 'prefix': ['ZBB'], 'promoter': {'ID': '', 'name': 'Verein Förderung des Lebensmittelgewerbes', 'street': 'Florianigasse 13', 'city': 'Wien', 'zip': '1080', 'countryISO2': 'AT', 'phone1': '+4314055396', 'phone2': '', 'fax': '', 'homepage': 'https://www.zuckerbaeckerball.com', 'email': 'info@zuckerbaeckerball.com',}, 'users': [''], 'location': 1
	}
];

let locations = [
	{'ID': '0', 'name': 'Nordlicht-Event GmbH', 'street': 'Sebastian-Kohlgasse 3-9', 'city': 'Wien', 'zip': '1210', 'countryISO2': 'AT', 'phone1': '+4312718154', 'phone2': '', 'fax': '', 'email': 'anfrage@nordlicht-events.at', 'homepage': 'https://www.nordlicht-events.at'},
	{'ID': '1', 'name': 'Hofburg Wien', 'street': 'Michaelerkuppel', 'city': 'Wien', 'zip': '1010', 'countryISO2': 'AT', 'phone1': '+4315337570', 'phone2': '', 'fax': '', 'email': 'info@hofburg-wien.at', 'homepage': 'https://www.hofburg-wien.at'},
	{'ID': '2', 'name': 'Rathaus', 'street': 'Friedrich-Schmidt-Platz 1', 'city': 'Wien', 'zip': '1010', 'countryISO2': 'AT', 'phone1': '+43152550', 'phone2': '', 'fax': '', 'email': '', 'homepage': 'https://www.wien.gv.at/verwaltung/rathaus/index.html'},
	{'ID': '3', 'name': 'Hauptplatz Graz', 'street': '', 'city': 'Graz', 'zip': '8010', 'countryISO2': 'AT', 'phone1': '', 'phone2': '', 'fax': '', 'email': '', 'homepage': ''},
	{'ID': '4', 'name': 'Congress Graz', 'street': 'Albrechtgasse 1', 'city': 'Graz', 'zip': '8010', 'countryISO2': 'AT', 'phone1': '+433168088400', 'phone2': '', 'fax': '+433168088450', 'email': 'office@mcg.at', 'homepage': 'http://www.mcg.at/congressgraz/kontakt-congress-graz.php'},
	{'ID': '5', 'name': 'Congress und Messe Innsbruck GmbH', 'street': 'Rennweg 3', 'city': 'Innsbruck', 'zip': '6020', 'countryISO2': 'AT', 'phone1': '+4351259360', 'phone2': '', 'fax': '+4351259361119', 'email': 'info@cmi.at', 'homepage': 'https://www.cmi.at'},
	{'ID': '6', 'name': 'Stadthalle Graz', 'street': 'Messeplatz 1', 'city': 'Graz', 'zip': '8010', 'countryISO2': 'AT', 'phone1': '+433168088400', 'phone2': '', 'fax': '+433168088450', 'email': 'office@mcg.at', 'homepage': 'http://www.mcg.at/messegraz.at/de/index.php'},
];

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

const ballcomplete_settings = {
	//host: 'ballcomplete.at',
	//user: 'marlo',
	//password: 'M2sZS15uD13',
	//port: 33600

	host: 'localhost',
	user: 'root',
	password: 'root',
	port: 3307
}

const ballcomplete = mysql.createConnection(ballcomplete_settings);

_import_basic();

connect('ballcomplete', ballcomplete).then((res) => {
	return import_users_promoter();
}).then((res) => {
	return _writeFile('sql/z_20_data_promoter_users.sql', res);
}).then(() => {
	return import_events();
}).then((res) => {
	return _writeFile('sql/z_30_data_events.sql', res);
}).then(() => {
	return import_orders();
}).then((res) => {
	return _writeFile('sql/z_40_data_orders.sql', res);
}).then(() => {
	return import_orders_details();
	/*
	}).then(() => {
		return import_users();
	}).then((res) => {
		return _writeFile('sql/z_15_events.sql', res);
	*/
}).then(() => {
	ballcomplete.end();
}).catch((err) => {
	console.error('error connecting: ' + err.stack);
	ballcomplete.end();
});

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

/*
	return import_users();
}).then(() => {
*/

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
							let sql = 'REPLACE INTO tabUser (`UserID`,`UserEmail`,`UserType`,`UserGender`,`UserTitle`,`UserFirstname`,`UserLastname`) VALUES ';
							let comma = '';
							_.each(res, (row) => {
								let UserID = _convertID(row.SysCode);
								let UserEmail = row.Vorname.toLowerCase() + '.' + row.Nachname.toLowerCase() + '@ticketselect.at';
								let UserType = 'promoter';
								let UserGender = (row.Anrede == 'Frau') ? 'f' : 'm';
								let UserTitle = row.Titel;
								let UserFirstname = row.Vorname;
								let UserLastname = row.Nachname;
								sql += comma + "\n('" + UserID + "','" + UserEmail + "','" + UserType + "','" + UserGender + "','" + UserTitle + "','" + UserFirstname + "','" + UserLastname + "')";
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
			resolve(ret);
		}).catch((err) => {
			reject(err);
		});
	});
}

function import_users() {
	return new Promise((resolve, reject) => {
		let promises = [];
		_.each(databases, (database) => {
			promises.push(new Promise(function(resolveQuery, rejectQuery) {
				let sql = 'SELECT * FROM ballcomplete_' + database.db + '.cms_user';
				console.log('-- ' + sql);
				ballcomplete.query(sql, function(err, res) {
					if (err) {
						console.log(err);
						rejectQuery();
					} else {
						if (res.length) {
							let sql = 'REPLACE INTO tabUser (`UserID`,`UserEmail`,`UserType`,`UserGender`,`UserTitle`,`UserFirstname`,`UserLastname`) VALUES ';
							let comma = '';
							_.each(res, (row) => {

								let UserID = _convertID(row.SysCode);
								let UserEmail = row.Vorname.toLowerCase() + '.' + row.Nachname.toLowerCase() + '@ticketselect.at';
								let UserType = 'promoter';
								let UserGender = (row.Anrede == 'Frau') ? 'f' : 'm';
								let UserTitle = row.Titel;
								let UserFirstname = row.Vorname;
								let UserLastname = row.Nachname;

								sql += comma + "\n('" + UserID + "','" + UserEmail + "','" + UserType + "','" + UserGender + "','" + UserTitle + "','" + UserFirstname + "','" + UserLastname + "')";
								comma = ',';
							});
							sql += ';';
							console.log('-- ' + database.db);
							console.log(sql);
							resolveQuery();

							//_query(sql).then(() => {
							//	resolveQuery();
							//}).catch((err) => {
							//	console.log('_query error');
							//	console.log(err);
							//	rejectQuery(err);
							//});
						} else {
							resolveQuery();
						}
					}
				});
			}));
		});
		Promise.all(promises).then((res) => {
			console.log('-- import_orders() promise.all');
			resolve();
		}).catch((err) => {
			reject(err);
			console.log('select');
			console.log(err);
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
				console.log(sql);
				ballcomplete.query(sql, function(err, res) {
					if (err) {
						console.log(err);
						rejectQuery();
					} else {
						let sql = 'INSERT INTO tabEvent (';
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

						sql += 'EventInternalHandlingFeeGross,';
						sql += 'EventInternalHandlingFeeTaxPercent,';
						sql += 'EventInternalShippingCostGross,';
						sql += 'EventInternalShippingCostTaxPercent,';

						sql += 'EventExternalHandlingFeeGross,';
						sql += 'EventExternalHandlingFeeTaxPercent,';
						sql += 'EventExternalShippingCostGross,';
						sql += 'EventExternalShippingCostTaxPercent,';

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

							sql += comma + "\n(";
							sql += "'" + _convertID(row.SysCode) + "',";
							sql += "'" + database.promoter.ID + "',";
							sql += "'" + locations[database.location].ID + "',";
							sql += "'" + row.Bezeichnung + "',";
							sql += "'" + row.RechnungNummerPraefix + "',";

							sql += "'" + database.promoter.phone1 + "',";
							sql += "'" + database.promoter.phone2 + "',";
							sql += "'" + database.promoter.fax + "',";
							sql += "'" + database.promoter.email + "',";
							sql += "'" + database.promoter.homepage + "',";

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

							sql += (row.GebuehrIntern) ? "'" + row.GebuehrIntern + "'," : 0.00 + ',';
							sql += (row.GebuehrInternUst) ? "'" + row.GebuehrInternUst + "'," : 0.00 + ',';
							sql += 0.00 + ",";
							sql += (row.VersandUst) ? "'" + row.VersandUst + "'," : 0.00 + ',';

							sql += (row.GebuehrExtern) ? "'" + row.GebuehrExtern + "'," : 0.00 + ',';
							sql += (row.GebuehrExternUst) ? "'" + row.GebuehrExternUst + "'," : 0.00 + ',';
							sql += "0.00,";
							sql += (row.VersandUst) ? "'" + row.VersandUst + "'," : 0.00 + ',';

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
		let promises = [];
		let users = {};
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
				console.log(sql);
				ballcomplete.query(sql, function(err, res) {
					if (err) {
						console.log(err);
						rejectQuery();
					} else {
						if (res.length) {
							let sql = 'INSERT INTO innoOrder (`OrderID`,`OrderNumber`,`OrderNumberText`,`OrderEventID`,`OrderType`,`OrderPayment`,`OrderState`,`OrderDateTimeUTC`,`OrderPayedDateTimeUTC`,`OrderFrom`,`OrderFromUserID`,`OrderUserAddress1`,`OrderUserAddress2`,`OrderUserAddress3`,`OrderUserAddress4`,`OrderUserAddress5`,`OrderUserAddress6`,`OrderUserEmail`) VALUES ';
							let comma = '';
							_.each(res, (row) => {

								let ID = _convertID(row.SysCode);
								let Number = row.RechnungNummer;
								let NumberText = row.RechnungNummerText;

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
									case 'gutschirft':
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

								let From = (row.SysType == 'online' && !row.SysCodeBenutzer) ? 'ex' : 'in';
								let FromUserID = _convertID(row.SysCodeBenutzer);

								let Address1 = '';
								let Address2 = '';
								let Address3 = '';
								let Address4 = '';
								let Address5 = '';
								let Address6 = '';

								if (row.Firma) {
									Address1 = row.Firma;
									Address2 = (row.Nachname) ? row.Anrede + ' ' + row.Vorname + ' ' + row.Nachname : '';
								} else {
									Address1 = row.Anrede;
									Address2 = row.Vorname + ' ' + row.Nachname;
								}
								Address3 = row.Strasse;
								Address4 = row.PLZ + ' ' + row.Ort;
								Address5 = row.Land;
								Address6 = (row.UID) ? row.UID : '';

								let Email = row.Email;

								sql += comma + "\n('" + ID + "','" + Number + "','" + NumberText + "','" + EventID + "','" + Type + "','" + Payment + "','" + State + "','" + DateTimeUTC + "','" + PayedDateTimeUTC + "','" + From + "','" + FromUserID + "','" + Address1.replaceAll("'", "´") + "','" + Address2.replaceAll("'", "´") + "','" + Address3.replaceAll("'", "´") + "','" + Address4.replaceAll("'", "´") + "','" + Address5.replaceAll("'", "´") + "','" + Address6.replaceAll("'", "´") + "','" + Email.replaceAll("'", "") + "')";
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
			resolve(ret);
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
				let sql = 'SELECT ' + details + '.* FROM (' + details + ' INNER JOIN ' + orders + ' ON (' + orders + '.SysCode = ' + details + '.SysCodeBestellung AND ' + SysStatus + ')) WHERE (' + details + '.SysStatus = \'ve\' OR ' + details + '.SysStatus = \'st\') AND (';
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
				console.log(sql);
				ballcomplete.query(sql, function(err, res) {
					if (err) {
						console.log(err);
						rejectQuery();
					} else {
						if (res.length) {
							let sql = 'INSERT INTO innoOrderDetail (`OrderDetailScancode`,`OrderDetailOrderID`,`OrderDetailTypeID`,`OrderDetailType`,`OrderDetailState`,`OrderDetailText`,`OrderDetailGrossRegular`,`OrderDetailGrossDiscount`,`OrderDetailGrossPrice`,`OrderDetailTaxPercent`,`OrderDetailTax`,`OrderDetailNetPrice`) VALUES ';
							let comma = '';
							_.each(res, (row) => {
								//  `SysStatus` enum('online','initMPAY','initUeberweisung','intern','abgeschlossen','storniert','gutschrift','reservierung') NOT NULL,
								//  `SysType` enum('online','intern','startbeleg','abschlussbeleg') NOT NULL,
								if (row.SysStatus == 've' || row.SysStatus == 'st') {

									let Scancode = row.Scancode;
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
									let Tax = 0;
									let NetPrice = row.Netto;

									sql += comma + "\n('" + Scancode + "','" + OrderID + "','" + TypeID + "','" + Type + "','" + State + "','" + Text + "','" + GrossRegular + "','" + GrossDiscount + "','" + GrossPrice + "','" + TaxPercent + "','" + Tax + "','" + NetPrice + "')";
									comma = ',';
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
					promisesWrite.push(_writeFile('sql/z_41_data_orders_details_' + res.db + '.sql', res.sql + '\n'));
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

function _import_basic() {
	let comma = '';
	let sql = 'SET FOREIGN_KEY_CHECKS = 0;\nTRUNCATE TABLE tabUser;\nTRUNCATE TABLE tabEvent;\nTRUNCATE TABLE tabLocation;\nTRUNCATE TABLE innoOrder;\nTRUNCATE TABLE innoOrderDetail;\nSET FOREIGN_KEY_CHECKS = 1;\n';

	_writeFile('sql/z_00_truncate.sql', sql).then((response) => {
	}).catch((err) => {
		console.log(err);
		process.exit(137);
	});

	comma = '';
	sql = 'INSERT INTO tabLocation (`LocationID`,`LocationName`,`LocationStreet`,`LocationCity`,`LocationZIP`,`LocationCountryCountryISO2`,`LocationEmail`,`LocationHomepage`,`LocationPhone1`,`LocationPhone2`,`LocationFax`) VALUES ';
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

	sql = 'INSERT INTO tabPromoter (`PromoterID`,`PromoterName`,`PromoterStreet`,`PromoterCity`,`PromoterZIP`,`PromoterCountryCountryISO2`,`PromoterEmail`,`PromoterHomepage`,`PromoterPhone1`,`PromoterPhone2`,`PromoterFax`,`PromoterLocations`,`PromoterEvents`,`PromoterEventsActive`) VALUES ';
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

function _query(sql) {
	return new Promise((resolve, reject) => {
		local.query(sql, function(err, res) {
			if (err) {
				console.log(err);
				reject();
			} else {
				resolve(res);
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
		uuid = id.substring(2, 32);
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
		content = 'use ticketing_db;\n\n' + content;
		fs.writeFile(file, content, function(err) {
			if (err) {
				reject(err);
			}
			console.log('-- \'' + file + '\' saved');
			resolve();
		});
	});
}


