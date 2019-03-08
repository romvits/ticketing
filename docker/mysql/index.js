import mysql from 'mysql';
import _ from 'lodash';

String.prototype.replaceAll = function(search, replacement) {
	var target = this;
	return target.split(search).join(replacement);
};

const databases = [
	{'db': 'aea', 'prefix': [''], 'promoter': {}},
	{'db': 'boku', 'prefix': ['BWW'], 'promoter': {}},
	{'db': 'bph', 'prefix': ['PH'], 'promoter': {}},
	{'db': 'hbb', 'prefix': ['HBB', 'WBB'], 'promoter': {}},
	{'db': 'ibc', 'prefix': ['IBC'], 'promoter': {}},
	{'db': 'jur', 'prefix': ['JUR'], 'promoter': {}},
	{'db': 'lnc', 'prefix': ['LNC'], 'promoter': {}},
	{'db': 'pdt', 'prefix': ['PDT'], 'promoter': {}},
	{'db': 'tub', 'prefix': ['TUB'], 'promoter': {}},
	{'db': 'voa', 'prefix': ['VLX'], 'promoter': {}},
	{'db': 'zbb', 'prefix': ['ZBB'], 'promoter': {}}
];

const ballcomplete_settings = {
	host: 'ballcomplete.at',
	user: 'marlo',
	password: 'M2sZS15uD13',
	port: 33600
}

const local_settings = {
	host: 'localhost',
	user: 'ticketing_user',
	password: 'h4G7f8OP',
	port: 3306,
	database: 'ticketing_db'
}

const local = mysql.createConnection(local_settings);
const ballcomplete = mysql.createConnection(ballcomplete_settings);

connect('ballcomplete', ballcomplete).then((res) => {
	return connect('local', local);
}).then(() => {
	console.log('-- both connected');
	console.log('-- ballcomplete connected as id ' + ballcomplete.threadId);
	console.log('-- local connected as id ' + local.threadId);
	console.log('use ticketing_db;');
	console.log('-- import_events()');
	return import_users();
}).then(() => {
	return import_users_promoter();
}).then(() => {
	console.log('-- import_orders()');
	return import_events();
}).then(() => {
	console.log('-- import_orders()');
	return import_orders();
}).then(() => {
	console.log('-- import_orders_details()');
	return import_orders_details();
}).then(() => {
	ballcomplete.end();
	local.end();
}).catch((err) => {
	console.error('error connecting: ' + err.stack);
	ballcomplete.end();
	local.end();
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

								let UserID = row.SysCode.substring(0, 32);
								let UserEmail = row.Vorname.toLowerCase() + '.' + row.Nachname.toLowerCase() + '@ticketselect.at';
								let UserType = 'promoter';
								let UserGender = (row.Anrede == 'Frau') ? 'f' : 'm';
								let UserTitle = row.Titel;
								let UserFirstname = row.Vorname;
								let UserLastname = row.Nachname;

								sql += comma + "('" + UserID + "','" + UserEmail + "','" + UserType + "','" + UserGender + "','" + UserTitle + "','" + UserFirstname + "','" + UserLastname + "')";
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

function import_users_promoter() {
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

								let UserID = row.SysCode.substring(0, 32);
								let UserEmail = row.Vorname.toLowerCase() + '.' + row.Nachname.toLowerCase() + '@ticketselect.at';
								let UserType = 'promoter';
								let UserGender = (row.Anrede == 'Frau') ? 'f' : 'm';
								let UserTitle = row.Titel;
								let UserFirstname = row.Vorname;
								let UserLastname = row.Nachname;

								sql += comma + "('" + UserID + "','" + UserEmail + "','" + UserType + "','" + UserGender + "','" + UserTitle + "','" + UserFirstname + "','" + UserLastname + "')";
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
					sql += or + 'RechnungNummerPraefix LIKE \'' + prefix + '%\'';
					or = ' OR '
				});
				ballcomplete.query(sql, function(err, res) {
					if (err) {
						console.log(err);
						rejectQuery();
					} else {
						let sql = 'INSERT INTO tabEvent (EventID, EventName, EventPrefix) VALUES ';
						let comma = '';
						_.each(res, (row) => {
							sql += comma + "('" + row.SysCode.substring(0, 32) + "','" + row.Bezeichnung + "','" + row.RechnungNummerPraefix + "')";
							comma = ',';
						});
						sql += ';';
						console.log('-- ' + database.db);
						console.log(sql);
						resolveQuery();
						/*
						_query(sql).then(() => {
							resolveQuery();
						}).catch((err) => {
							console.log('_query error');
							console.log(err);
							rejectQuery(err);
						});
						*/
					}
				});
			}));
		});
		Promise.all(promises).then(() => {
			resolve();
		}).catch((err) => {
			console.log('select');
			console.log(err);
		});
	});
}

function import_orders() {
	return new Promise((resolve, reject) => {
		let promises = [];
		_.each(databases, (database) => {
			promises.push(new Promise(function(resolveQuery, rejectQuery) {
				let sql = 'SELECT * FROM ballcomplete_' + database.db + '.vacomplete_bestellungen WHERE ';
				let or = '';
				_.each(database.prefix, (prefix) => {
					sql += or + 'RechnungNummerPraefix LIKE \'' + prefix + '%\'';
					or = ' OR '
				});
				console.log('-- ' + sql);
				ballcomplete.query(sql, function(err, res) {
					if (err) {
						console.log(err);
						rejectQuery();
					} else {
						if (res.length) {
							let sql = 'INSERT INTO innoOrder (`OrderID`,`OrderNumber`,`OrderNumberText`,`OrderEventID`,`OrderEventPrefix`,`OrderType`,`OrderPayment`,`OrderState`,`OrderFrom`,`OrderFromUserID`,`OrderUserAddress1`,`OrderUserAddress2`,`OrderUserAddress3`,`OrderUserAddress4`,`OrderUserAddress5`,`OrderUserEmail`) VALUES ';
							let comma = '';
							_.each(res, (row) => {
								if (row.SysStatus == 'abgeschlossen' || row.SysStatus == 'storniert' || row.SysStatus == 'gutschirft' || row.SysStatus == 'reservierung') {

									//  `SysStatus` enum('online','initMPAY','initUeberweisung','intern','abgeschlossen','storniert','gutschrift','reservierung') NOT NULL,
									//  `SysType` enum('online','intern','startbeleg','abschlussbeleg') NOT NULL,

									let ID = row.SysCode.substring(0, 32);
									let Number = row.RechnungNummer;
									let NumberText = row.RechnungNummerText;
									let EventID = row.SysCodeVA.substring(0, 32);
									let Prefix = row.RechnungNummerPraefix;
									let Type = 'or';
									switch (row.SysStatus) {		// type of order => or=order (Rechnung) | re=reservation (Reservierung) | cr=credit (Gutschrift)
										case 'abgeschlossen':
											Type = 'or';
											break;
										case 'storniert':
											Type = 'cr';
											break;
										case 'gutschirft':
											Type = 'cr';
											break;
										case 'reservierung':
											Type = 're';
											break;
									}
									let Payment = 'ca';
									switch (row.artZahlung) {		// payment method => ca=cash | mp=mpay | pa=paypal | tr=transfer
										case 'mpay':
											Payment = 'mp';
											break;
										case 'ueberweisung':
											Payment = 'tr';
											break;
										case 'bar':
											Payment = 'ca';
											break;
									}
									let State = '';
									switch (row.artZahlung) {		// state of order => bt=bank transfer | pa=payed
										case 'initUeberweisung':
											State = 'bt';
											break;
										default:
											State = 'pa';
											break;
									}
									let From = (row.SysType == 'online') ? 'ex' : 'in';
									let FromUserID = row.SysCodeBenutzer.substring(0, 32);

									let Address1 = '';
									let Address2 = '';
									let Address3 = '';
									let Address4 = '';
									let Address5 = '';

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

									let Email = row.Email;

									sql += comma + "('" + ID + "','" + Number + "','" + NumberText + "','" + EventID + "','" + Prefix + "','" + Type + "','" + Payment + "','" + State + "','" + From + "','" + FromUserID + "','" + Address1.replaceAll("'", "´") + "','" + Address2.replaceAll("'", "´") + "','" + Address3.replaceAll("'", "´") + "','" + Address4.replaceAll("'", "´") + "','" + Address5.replaceAll("'", "´") + "','" + Email.replaceAll("'", "") + "')";
									comma = ',';
								}
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

function import_orders_details() {
	return new Promise((resolve, reject) => {
		let promises = [];
		_.each(databases, (database) => {
			promises.push(new Promise(function(resolveQuery, rejectQuery) {
				let sql = 'SELECT ballcomplete_' + database.db + '.vacomplete_bestellungen_details.* FROM (ballcomplete_' + database.db + '.vacomplete_bestellungen_details INNER JOIN ballcomplete_' + database.db + '.vacomplete_bestellungen ON ((ballcomplete_' + database.db + '.vacomplete_bestellungen.SysCode = ballcomplete_' + database.db + '.vacomplete_bestellungen_details.SysCodeBestellung))) WHERE (ballcomplete_' + database.db + '.vacomplete_bestellungen_details.SysStatus = \'ve\' OR ballcomplete_' + database.db + '.vacomplete_bestellungen_details.SysStatus = \'st\') AND (';
				let or = '';
				_.each(database.prefix, (prefix) => {
					sql += or + 'ballcomplete_' + database.db + '.vacomplete_bestellungen_details.Scancode LIKE \'' + prefix + '%\'';
					or = ' OR '
				});
				sql += ')';
				console.log('-- ' + sql);
				ballcomplete.query(sql, function(err, res) {
					if (err) {
						console.log(err);
						rejectQuery();
					} else {
						if (res.length) {
							let sql = 'INSERT INTO innoOrderDetail (`OrderDetailScancode`,`OrderDetailOrderID`,`OrderDetailTypeID`,`OrderDetailType`,`OrderDetailText`,`OrderDetailGrossRegular`,`OrderDetailGrossDiscount`,`OrderDetailGrossPrice`,`OrderDetailTaxPercent`,`OrderDetailTax`,`OrderDetailNetPrice`) VALUES ';
							let comma = '';
							_.each(res, (row) => {

								//  `SysStatus` enum('online','initMPAY','initUeberweisung','intern','abgeschlossen','storniert','gutschrift','reservierung') NOT NULL,
								//  `SysType` enum('online','intern','startbeleg','abschlussbeleg') NOT NULL,
								if (row.SysStatus == 've' || row.SysStatus == 'st') {

									let Scancode = row.Scancode;
									let OrderID = row.SysCodeBestellung.substring(0, 32);
									let TypeID = row.SysCodeKarte.substring(0, 32);
									let Type = '';				// type of order detail => ti=entry ticket | se=seat at location | sp=upselling like Tortengarantie | sc=shipping costs | hf=handling fee
									switch (row.SysArt) {
										case 'eintrittskarte':
											Type = 'ti';
											break;
										case 'sitzplatzkarte':
											Type = 'se';
											break;
										case 'sonderleistung':
											Type = 'sp';
											break;
										case 'spesenVersand':
											Type = 'sc';
											break;
										case 'spesenBearbeiten':
											Type = 'hf';
											break;
										default:
											break;
									}
									let Text = row.Text;

									let GrossRegular = row.Brutto;
									let GrossDiscount = row.Rabatt;
									let GrossPrice = row.Preis;
									let TaxPercent = 0;
									let Tax = 0;
									let NetPrice = row.Netto;

									sql += comma + "('" + Scancode + "','" + OrderID + "','" + TypeID + "','" + Type + "','" + Text + "','" + GrossRegular + "','" + GrossDiscount + "','" + GrossPrice + "','" + TaxPercent + "','" + Tax + "','" + NetPrice + "')";
									comma = ',';
								}
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
		Promise.all(promises).then(() => {
			console.log('-- import_orders_details() promise.all');
			resolve();
		}).catch((err) => {
			reject(err);
			console.log('select');
			console.log(err);
		});
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