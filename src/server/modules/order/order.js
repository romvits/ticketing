import Module from './../module';
import _ from 'lodash';
import numeral from 'numeral';
import QRCode from 'qrcode';
import PDFDocument from 'pdfkit';
import fs from 'fs';
import dateFormat from 'dateformat';

numeral.register('locale', 'at', {
	delimiters: {
		thousands: '.',
		decimal: ','
	},
	abbreviations: {
		thousand: 'k',
		million: 'm',
		billion: 'b',
		trillion: 't'
	},
	currency: {
		symbol: '€'
	}
});

/**
 * order
 */
class Order extends Module {

	/**
	 * constructor for order
	 * @param clientConnID {String} 32 character string of connection ID
	 * @param ConnUserID {String} 32 character string of user ID
	 */
	constructor(ClientConnID) {
		super(ClientConnID);
		this._userdata = SOCKET.io.sockets.connected[ClientConnID].userdata;
		this.pk = 'OrderID';
		this.table = 'innoOrder';
		this.view = 'viewOrder';
		this.fields = {
			OrderID: {type: 'string', length: 32, empty: false}, // varchar(32) NOT NULL COMMENT 'unique id of the order',
			OrderNumber: {type: 'integer', length: 6, empty: false}, // int(6) UNSIGNED ZEROFILL NULL COMMENT 'consecutive number of the order (why 6 digits and not less => it could be a stadium with more than 100.000 visitors and orders)',
			OrderNumberText: {type: 'string', length: 14, empty: false}, // varchar(14) NULL COMMENT '7 character prefix delimiter (-) and consecutive number of the order (example: ZBB2020-123456)',
			OrderEventID: {type: 'string', length: 32, empty: false}, // varchar(32) NOT NULL COMMENT 'id of the event that order belongs to',
			OrderType: {type: 'enum', empty: false}, // enum('order','credit') NOT NULL DEFAULT 'order' COMMENT 'type of order => or=order (Rechnung) | cr=credit (Gutschrift)',
			OrderState: {type: 'enum', empty: false}, // enum('open','payed') NOT NULL DEFAULT 'open' COMMENT 'state of order => op=open | pa=payed',
			OrderPayment: {type: 'enum', empty: false}, // enum('cash','mpay','paypal','transfer') NOT NULL DEFAULT 'cash' COMMENT 'payment method => ca=cash | mp=mpay | pa=paypal | tr=transfer',
			OrderAcceptGTC: {type: 'integer', length: 1}, // tinyint(1) NOT NULL DEFAULT 0 COMMENT 'are the GTC (AGB) accepted?',
			OrderCreditID: {type: 'string', length: 32, empty: false}, // varchar(32) NULL COMMENT 'id of order to which this credit belongs to',
			OrderDateTimeUTC: {type: 'datetime', empty: false}, // datetime NOT NULL COMMENT 'order date time',
			OrderPayedDateTimeUTC: {type: 'datetime', empty: true}, // datetime NOT NULL COMMENT 'order date time payed',
			OrderFromUserID: {type: 'string', length: 32, empty: false}, // varchar(32) NULL COMMENT 'unique id of the user the order was created (only if OrderFrom = in)',
			OrderUserID: {type: 'string', length: 32, empty: false}, // varchar(32) NULL COMMENT 'unique id of the user that order belongs to',
			OrderUserCompany: {type: 'string', length: 150, empty: false}, // varchar(150) NULL COMMENT 'company',
			OrderUserCompanyUID: {type: 'string', length: 30, empty: false}, // varchar(30) NULL COMMENT 'company UID',
			OrderUserGender: {type: 'enum', empty: false}, // enum('m','f') NULL COMMENT 'gender m=male | f=female',
			OrderUserTitle: {type: 'string', length: 50, empty: true}, // varchar(50) NULL COMMENT 'academical title',
			OrderUserFirstname: {type: 'string', length: 50, empty: false}, // varchar(50) NULL COMMENT 'first name',
			OrderUserLastname: {type: 'string', length: 50, empty: false}, // varchar(50) NULL COMMENT 'last name',
			OrderUserStreet: {type: 'string', length: 120, empty: false}, // varchar(120) NULL COMMENT 'street',
			OrderUserCity: {type: 'string', length: 100, empty: false}, // varchar(100) NULL COMMENT 'city',
			OrderUserZIP: {type: 'string', length: 20, empty: false}, // varchar(20) NULL COMMENT 'zip',
			OrderUserCountryCountryISO2: {type: 'enum', 'table': 'feCountry', 'pk': 'CountryISO2', empty: true}, // varchar(2) NULL COMMENT 'country',
			OrderUserEmail: {type: 'string', length: 250, empty: false}, // varchar(250) NULL COMMENT 'actual email address of user => is used to send mail to customer',
			OrderUserPhone1: {type: 'string', length: 30, empty: false}, // varchar(30) NULL COMMENT 'actual phone number of user',
			OrderUserPhone2: {type: 'string', length: 30, empty: false}, // varchar(30) NULL COMMENT 'actual phone number of user',
			OrderUserFax: {type: 'string', length: 30, empty: false}, // varchar(30) NULL COMMENT 'actual phone number of user',
			OrderUserHomepage: {type: 'string', length: 250, empty: false}, // varchar(250) NULL COMMENT 'actual phone number of user',
			OrderGrossPrice: {type: 'decimal', length: '6,2', empty: false}, // decimal(8,2) NULL DEFAULT 0.00 COMMENT 'price gross => brutto',
			OrderNetPrice: {type: 'decimal', length: '3,2', empty: false}, // decimal(8,2) NULL DEFAULT 0.00 COMMENT 'price net => netto',
		}
		if (this._userdata.Event) {
			if (!_.isObject(this._userdata.Order)) {
				this._userdata.Order = {
					OrderID: this.generateUUID(),
					OrderEventID: this._userdata.Event.EventID,
					OrderLocationID: this._userdata.Event.EventLocationID,
					OrderPromoterID: this._userdata.Event.EventPromoterID,
					OrderPayment: (this._userdata.intern) ? 'cash' : 'mpay',
					OrderAcceptGTC: (this._userdata.intern) ? 1 : 0, 			// accept standard business terms (german = AGB)
					OrderFrom: (this._userdata.intern) ? 'intern' : 'extern',
					OrderFromUserID: (this._userdata.intern && this._userdata.User && this._userdata.User.UserID) ? this._userdata.User.UserID : null,
					OrderType: 'order',
					OrderDetail: [],
					OrderTax: {}
				}
			}
			if (_.isUndefined(_.find(this._userdata.Order.OrderDetail, {ShoppingCartType: 'handlingfee'}))) {
				let OrderDetailGrossRegular = (this._userdata.intern) ? this._userdata.Event.EventHandlingFeeGrossInternal : this._userdata.Event.EventHandlingFeeGrossExternal;
				if (OrderDetailGrossRegular || this._userdata.intern) {
					this._userdata.Order.OrderDetail.push({
						ShoppingCartID: this.generateUUID(),
						ShoppingCartType: 'handlingfee',
						ShoppingCartSortOrder: 250,
						ShoppingCartTicketName: this._userdata.Event.EventHandlingFeeName,
						ShoppingCartText: '',
						OrderDetailOrderID: this._userdata.Order.OrderID,
						OrderDetailEventID: this._userdata.Order.OrderEventID,
						OrderDetailType: 'handlingfee',
						OrderDetailTypeID: null,
						OrderDetailScanType: null,
						OrderDetailState: 'sold',
						OrderDetailSortOrder: 250,
						OrderDetailText: this._userdata.Event.EventHandlingFeeLabel,
						OrderDetailTaxPercent: this._userdata.Event.EventHandlingFeeTaxPercent,
						OrderDetailGrossRegular: OrderDetailGrossRegular,
						OrderDetailGrossDiscount: 0,
						OrderDetailGrossPrice: 0,
						OrderDetailTaxPrice: 0,
						OrderDetailNetPrice: 0
					});
				}
			}
			if (_.isUndefined(_.find(this._userdata.Order.OrderDetail, {ShoppingCartType: 'shippingcost'}))) {
				let OrderDetailGrossRegular = (this._userdata.intern) ? this._userdata.Event.EventShippingCostGrossInternal : this._userdata.Event.EventShippingCostGrossExternal;
				if (OrderDetailGrossRegular || this._userdata.intern) {
					this._userdata.Order.OrderDetail.push({
						ShoppingCartID: this.generateUUID(),
						ShoppingCartType: 'shippingcost',
						ShoppingCartSortOrder: 249,
						ShoppingCartTicketName: this._userdata.Event.EventShippingCostName,
						ShoppingCartText: '',
						OrderDetailOrderID: this._userdata.Order.OrderID,
						OrderDetailEventID: this._userdata.Order.OrderEventID,
						OrderDetailType: 'shippingcost',
						OrderDetailTypeID: null,
						OrderDetailScanType: null,
						OrderDetailState: 'sold',
						OrderDetailSortOrder: 249,
						OrderDetailText: this._userdata.Event.EventShippingCostLabel,
						OrderDetailTaxPercent: this._userdata.Event.EventShippingCostTaxPercent,
						OrderDetailGrossRegular: OrderDetailGrossRegular,
						OrderDetailGrossDiscount: 0,
						OrderDetailGrossPrice: 0,
						OrderDetailTaxPrice: 0,
						OrderDetailNetPrice: 0
					});
				}
			}
			this._calculate(this._userdata.Order);
		} else {

		}
	}

	/**
	 * set user for this shopping cart (used for internal connections eg 'admin' ||'promoter')
	 * @param UserID {String} 32 character string of user id
	 */
	setUser(UserID) {
		return new Promise((resolve, reject) => {
			if (this._userdata.Event) {
				let table = 'innoUser';
				let fields = null;
				let where = {UserID: UserID}
				DB.promiseSelect(table, fields, where).then(resUser => {
					let rowUser = resUser[0];
					this.setUserData(rowUser);
				}).catch(err => {
					console.log(err);
				});
			} else {
				reject('no event ist set');
			}
		});
	}

	/**
	 * set user data
	 * @param User {Object} object of user data
	 */
	setUserData(User) {
		_.extend(this._userdata.Order, {
			OrderUserID: !_.isUndefined(User.UserID) ? User.UserID : this._userdata.Order.UserID,
			OrderUserCompany: !_.isUndefined(User.UserCompany) ? User.UserCompany : this._userdata.Order.UserCompany,
			OrderUserCompanyUID: !_.isUndefined(User.UserCompanyUID) ? User.UserCompanyUID : this._userdata.Order.UserCompanyUID,
			OrderUserGender: !_.isUndefined(User.UserGender) ? User.UserGender : this._userdata.Order.UserGender,
			OrderUserTitle: !_.isUndefined(User.UserTitle) ? User.UserTitle : this._userdata.Order.UserTitle,
			OrderUserFirstname: !_.isUndefined(User.UserFirstname) ? User.UserFirstname : this._userdata.Order.UserFirstname,
			OrderUserLastname: !_.isUndefined(User.UserLastname) ? User.UserLastname : this._userdata.Order.UserLastname,
			OrderUserStreet: !_.isUndefined(User.UserStreet) ? User.UserStreet : this._userdata.Order.UserStreet,
			OrderUserCity: !_.isUndefined(User.UserCity) ? User.UserCity : this._userdata.Order.UserCity,
			OrderUserZIP: !_.isUndefined(User.UserZIP) ? User.UserZIP : this._userdata.Order.UserZIP,
			OrderUserCountryCountryISO2: !_.isUndefined(User.UserCountryCountryISO2) ? User.OrderUserCountryCountryISO2 : this._userdata.Order.OrderUserCountryCountryISO2,
			OrderUserEmail: !_.isUndefined(User.UserEmail) ? User.UserEmail : this._userdata.Order.UserEmail,
			OrderUserPhone1: !_.isUndefined(User.UserPhone1) ? User.UserPhone1 : this._userdata.Order.UserPhone1,
			OrderUserPhone2: !_.isUndefined(User.UserPhone2) ? User.UserPhone2 : this._userdata.Order.UserPhone2,
			OrderUserFax: !_.isUndefined(User.UserFax) ? User.UserFax : this._userdata.Order.UserFax,
			OrderUserHomepage: !_.isUndefined(User.UserHomepage) ? User.UserHomepage : this._userdata.Order.UserHomepage,
			OrderUserLangCode: !_.isUndefined(User.OrderUserLangCode) ? User.OrderUserLangCode : 'de-at'
		});
	}

	/**
	 * set ticket - multiple tickets (especially for external usage parameter Amount can be used)
	 * @param values {Object} Object
	 * @example
	 * {ID:'TicketID', Amount: 2}
	 * @returns {Promise<any>}
	 */
	setTicket(values) {

		return new Promise((resolve, reject) => {
			if (this._userdata.Event) {

				let TicketID = values.ID;
				let Amount = values.Amount;

				let OrderDetail = [];
				_.each(this._userdata.Order.OrderDetail, (Item) => {
					if (Item.OrderDetailTypeID !== TicketID) {
						OrderDetail.push(Item);
					}
				});
				this._userdata.Order.OrderDetail = OrderDetail;

				if (Amount) {

					let soldTicket = 0;
					let actualVisitors = 0;

					DB.promiseSelect('viewEventTicketCountSold', null, {EventID: this._userdata.Event.EventID}).then(res => {
						let TicketCountSold = res;
						_.each(TicketCountSold, rowCountTicketSold => {
							if (rowCountTicketSold.Type === 'ticket') {
								actualVisitors += rowCountTicketSold.count;
							}
							if (rowCountTicketSold.TicketID === TicketID) {
								soldTicket = rowCountTicketSold.count;
							}
						});
						return DB.promiseSelect('innoTicket', null, {TicketID: TicketID, TicketEventID: this._userdata.Event.EventID});
					}).then(resTicket => {
						let maximumVisitors = this._userdata.Event.EventMaximumVisitors;
						let rowTicket = resTicket[0];
						_.each(SOCKET.io.sockets.connected, client => {
							if (client.id != this._clientConnID && client.adapter.rooms[this._userdata.Event.EventID].sockets && client.userdata.Order && client.userdata.Order.OrderDetail) {
								_.each(client.userdata.Order.OrderDetail, Detail => {
									if (Detail.OrderDetailTypeID === TicketID) {
										soldTicket++;
										if (rowTicket.TicketType === 'ticket') {
											actualVisitors++;
										}
									}
								});
							}
						});
						let availableTicket = rowTicket.TicketContingent - soldTicket;

						if (this._userdata.intern === false && Amount > rowTicket.TicketMaximumOnline) {
							Amount = rowTicket.TicketMaximumOnline;
						}
						if (Amount > availableTicket) {
							Amount = availableTicket;
						}
						if (maximumVisitors && rowTicket.TicketType === 'ticket' && actualVisitors + Amount > maximumVisitors) {
							Amount = maximumVisitors - actualVisitors;
						}

						for (let i = 0; i < Amount; i++) {
							this._userdata.Order.OrderDetail.push({
								ShoppingCartID: this.generateUUID(),
								ShoppingCartType: rowTicket.TicketType,
								ShoppingCartSortOrder: rowTicket.TicketSortOrder,
								ShoppingCartTicketName: rowTicket.TicketName,
								ShoppingCartText: rowTicket.TicketLabel,
								OrderDetailOrderID: this._userdata.Order.OrderID,
								OrderDetailEventID: this._userdata.Order.OrderEventID,
								OrderDetailType: rowTicket.TicketType,
								OrderDetailTypeID: rowTicket.TicketID,
								OrderDetailScanType: rowTicket.TicketScanType,
								OrderDetailState: 'sold',
								OrderDetailSortOrder: rowTicket.TicketSortOrder,
								OrderDetailText: rowTicket.TicketLabel,
								OrderDetailTaxPercent: rowTicket.TicketTaxPercent,
								OrderDetailGrossRegular: rowTicket.TicketGrossPrice,
								OrderDetailGrossDiscount: 0,
								OrderDetailGrossPrice: 0,
								OrderDetailTaxPrice: 0,
								OrderDetailNetPrice: 0
							});
						}
						let order = new Order(this._clientConnID);
						this._userdata.Order = order._calculate(this._userdata.Order);

						SOCKET.io.to(this._userdata.Event.EventID).emit('order-update-ticket', {
							TicketID: rowTicket.TicketID,
							TicketType: rowTicket.TicketType,
							TicketAvailable: availableTicket - Amount
						});
						resolve(this._userdata.Order);

						let availableVisitors = maximumVisitors - actualVisitors - Amount;
						SOCKET.io.to(this._userdata.Event.EventID).emit('order-update-event', {
							EventAvailableVisitors: (this._userdata.Event.EventMaximumVisitors) ? availableVisitors : null
						});

					}).catch(err => {
						console.log(err);
						reject();
					});
				} else {
					let order = new Order(this._clientConnID);
					this._userdata.Order = order._calculate(this._userdata.Order);
					resolve(this._userdata.Order);
				}
			} else {
				reject('no event ist set');
			}
		});
	}

	/**
	 * add seat
	 * @param SeatID {String} 32 character string for ID of the seat
	 * @returns {Promise<any>}
	 */
	setSeat(SeatID) {
		return new Promise((resolve, reject) => {
			if (this._userdata.Event) {
				DB.promiseSelect('viewEventSeat', null, {SeatEventID: this._userdata.Event.EventID, SeatID: SeatID}).then(resSeat => {
					if (_.size(resSeat)) {
						let rowSeat = resSeat[0];
						let action = 'add';
						if (rowSeat.SeatOrderID === null && rowSeat.SeatReservationID === null) {
							_.each(SOCKET.io.sockets.connected, client => {
								if (client.adapter.rooms[this._userdata.Event.EventID].sockets && client.userdata.Order && client.userdata.Order.OrderDetail) {
									_.each(client.userdata.Order.OrderDetail, Detail => {
										if (Detail.OrderDetailType === 'seat' && Detail.OrderDetailTypeID === SeatID) {
											if (client.id != this._clientConnID) {
												action = 'blocked';
											} else {
												action = 'release';
											}
										}
									});
								}
							});
							if (action === 'add') {
								let text = (rowSeat.RoomLabel) ? rowSeat.RoomLabel : '';
								text += (rowSeat.TableLabel) ? ' ' + rowSeat.TableLabel : '';
								text += (rowSeat.SeatLabel) ? ' ' + rowSeat.SeatLabel : '';
								if (rowSeat.SeatRow && rowSeat.SeatNumber) {
									text += ' ' + rowSeat.SeatRow + '/' + rowSeat.SeatNumber;
								} else if (rowSeat.TableNumber && rowSeat.SeatNumber) {
									text += ' ' + rowSeat.TableNumber + '/' + rowSeat.SeatNumber;
								} else if (rowSeat.SeatNumber) {
									text += ' ' + rowSeat.SeatNumber;
								}
								text = text.trim();
								this._userdata.Order.OrderDetail.push({
									ShoppingCartID: this.generateUUID(),
									ShoppingCartType: 'seat',
									ShoppingCartSortOrder: 201,
									ShoppingCartSeatName: rowSeat.SeatName,
									ShoppingCartRoomName: rowSeat.RoomName,
									ShoppingCartTableName: rowSeat.TableName,
									ShoppingCartTableNumber: rowSeat.TableNumber,
									ShoppingCartText: text,
									OrderDetailOrderID: this._userdata.Order.OrderID,
									OrderDetailEventID: this._userdata.Order.OrderEventID,
									OrderDetailType: 'seat',
									OrderDetailTypeID: rowSeat.SeatID,
									OrderDetailScanType: 'single',
									OrderDetailState: 'sold',
									OrderDetailSortOrder: 201,
									OrderDetailText: text,
									OrderDetailTaxPercent: rowSeat.SeatTaxPercent,
									OrderDetailGrossRegular: rowSeat.SeatGrossPrice,
									OrderDetailGrossDiscount: 0,
									OrderDetailGrossPrice: 0,
									OrderDetailTaxPrice: 0,
									OrderDetailNetPrice: 0
								});
							} else if (action === 'release') {
								let OrderDetail = [];
								_.each(this._userdata.Order.OrderDetail, (Item) => {
									if (Item.OrderDetailTypeID !== SeatID) {
										OrderDetail.push(Item);
									}
								});
								this._userdata.Order.OrderDetail = OrderDetail;
							}
							if (action !== 'blocked') {
								let order = new Order(this._clientConnID);
								this._userdata.Order = order._calculate(this._userdata.Order);
								let res = {
									SeatID: SeatID,
									SeatState: (action === 'release') ? 'free' : 'blocked'
								};
								SOCKET.io.to(this._userdata.Event.EventID).emit('order-update-seat', res);
								resolve(this._userdata.Order);

							} else {
								reject({SeatID: SeatID, SeatState: 'blocked'});
							}
						} else {
							if (rowSeat.SeatOrderID !== null) {
								reject({SeatID: SeatID, SeatState: 'sold'});
							} else if (rowSeat.SeatReservationID !== null) {
								reject({SeatID: SeatID, SeatState: 'reserved'});
							} else {
								reject({SeatID: SeatID, SeatState: 'blocked'});
							}
						}
					} else {
						reject(false);
					}
				}).catch(err => {
					console.log(err);
					reject();
				});
			} else {
				reject('no event ist set');
			}
		});
	}

	/**
	 * add special offer to shopping cart (not a special ticket !!!)
	 * @param values {Object} arra
	 * @returns {Promise<any>}
	 */
	addSpecialOffer(values) {
		return new Promise((resolve, reject) => {
			if (this._userdata.Event) {
				resolve(values);
			} else {
				reject('no event ist set');
			}
		});
	}

	/**
	 * set discount to shopping cart (order) item
	 * only allowd from intern user 'admin' or 'promoter'
	 * @param values {Object} Object
	 * @example
	 * {ID:'ShoppingCartDetailID', Discount: 1.23}
	 * @returns {Promise<any>}
	 */
	setDiscount(values) {
		return new Promise((resolve, reject) => {
			if (this._userdata.Event) {
				if (this._userdata.Event) {
					if (this._userdata.intern) {
						let OrderDetail = _.find(this._userdata.Order.OrderDetail, {ShoppingCartID: values.ID});
						OrderDetail.OrderDetailGrossDiscount = values.Discount;
						let order = new Order(this._clientConnID);
						this._userdata.Order = order._calculate(this._userdata.Order);
						resolve(this._userdata.Order);
					} else {
						reject('user not administrator');
					}
				} else {
					reject('user not logged in')
				}
			} else {
				reject('no event ist set');
			}
		});
	}

	/**
	 * set payment type
	 * @param Payment {String} on of 'cash' || 'mpay' || 'paypal' || 'transfer'
	 */
	setPayment(Payment) {
		return new Promise((resolve, reject) => {
			if (this._userdata.Event) {
				if (Payment === 'cash' || Payment === 'mpay' || Payment === 'paypal' || Payment === 'transfer') {
					if (this._userdata.intern || (!this._userdata.intern && (Payment === 'mpay' || Payment === 'paypal'))) {
						this._userdata.Order.OrderPayment = Payment;
						resolve(true);
					} else {
						reject('payment \'' + Payment + '\' is for external user not one of \'mpay\' || \'paypal\'');
					}
				} else {
					reject('payment \'' + Payment + '\' is not one of \'cash\' || \'mpay\' || \'paypal\' || \'transfer\'');
				}
			} else {
				reject('no event ist set');
			}
		});
	}

	/**
	 * empty shopping cart
	 * @returns {Promise<any>}
	 */
	empty() {
		return new Promise((resolve, reject) => {
			this._userdata.Order = null;
			resolve(null);
		});
	}

	/**
	 * delete item from shopping cart by unique ID
	 * @param DetailID {String} 32 character string one of ID ShoppingCart.OrderDetail[].OrderID
	 * @returns {Promise<any>}
	 */
	del(DetailID) {
		return new Promise((resolve, reject) => {
			if (this._userdata.Event) {
				let OrderDetail = [];
				_.each(this._userdata.Order.OrderDetail, Detail => {
					if (Detail.OrderID !== DetailID) {
						OrderDetail.push(Detail);
					}
				});
				this._userdata.Order.OrderDetail = OrderDetail;
				let order = new Order(this._clientConnID);
				this._userdata.Order = order._calculate(this._userdata.Order);
				resolve(this._userdata.Order);
			} else {
				reject('no event ist set');
			}
		});
	}

	/**
	 * fetch specific order by id with all OrderDetail items
	 * @param OrderID 32 character order id
	 * @returns {Promise<any>}
	 */
	fetchOrder(OrderID) {
		return new Promise((resolve, reject) => {
			let Order = null;
			DB.promiseSelect('innoOrder', null, {OrderID: OrderID}).then(resOrder => {
				if (_.size(resOrder) === 1) {
					Order = resOrder[0];
					return DB.promiseSelect('innoOrderDetail', null, {OrderDetailOrderID: OrderID}, 'OrderDetailSortOrder')
				} else {
					return;
				}
			}).then((resOrderDetail) => {
				if (_.isObject(Order)) {
					Order.OrderDetail = null;
					if (resOrderDetail && _.size(resOrderDetail)) {
						Order.OrderDetail = resOrderDetail;
						return DB.promiseSelect('innoOrderTax', null, {OrderTaxOrderID: OrderID}, 'OrderTaxPercent');
					} else {
						return;
					}
				} else {
					return;
				}
			}).then((resOrderTax) => {
				if (_.isObject(Order)) {
					Order.OrderTax = null;
					if (resOrderTax && _.size(resOrderTax)) {
						Order.OrderTax = resOrderTax;
					}
				}
				resolve(Order);
			}).catch(err => {
				console.log(err);
			});
		});
	}

	/**
	 * fetch all orders for active user event
	 * @param req
	 * @returns {Promise<any>}
	 * TODO: paging filtering (search)
	 */
	fetchAll(req) {
		console.log('============ req fetchAll');
		console.log(req);
		let where = {OrderEventID: this._userdata.Event.EventID, OrderType: req.OrderType};
		let fields = null;
		let orderby = 'OrderNumber';
		let from = 0;
		let count = 100;
		if (req) {
			if (req.order && req.order.by) {

			}
			if (req.order && req.order.dir) {

			}
			from = (req.from) ? req.from : 0;
			count = (req.count) ? req.count : 100;
		}
		return DB.promiseSelect(this.table, fields, where, orderby, from, count);
	}

	/**
	 * cancel item(s) from order<br>
	 * clear order items and set to canceled and update seats to free seats
	 * create new order from type credit (storno) OrderType = credit
	 * @param OrderID 32 character order id
	 * @param ScanCode {Array} array of item scan codes which will be effected for this cancel
	 * @returns {Promise<any>}
	 */
	cancelItem(OrderID, ScanCode) {
		let Credit = {};
		return new Promise((resolve, reject) => {
			this.fetchOrder(OrderID).then(Order => {
				if (_.size(Order.OrderDetail)) {
					Credit = _.clone(Order);
					Credit.OrderID = this.generateUUID();
					Credit.OrderCreditID = Order.OrderID;
					Credit.OrderType = 'credit';
					Credit.OrderState = 'open';
					Credit.OrderPayment = 'transfer';
					Credit.OrderDateTimeUTC = this.getDateTime();
					Credit.OrderPayedDateTimeUTC = null;
					Credit.OrderFrom = 'intern';
					Credit.OrderFromID = this._userdata.User.UserID;
					Credit.OrderDetail = [];
					Credit.OrderTax = {};
					_.each(Order.OrderDetail, OrderDetail => {
						if (ScanCode.indexOf(OrderDetail.OrderDetailScanCode) !== -1) {
							OrderDetail.ShoppingCartType = OrderDetail.OrderDetailType;
							OrderDetail.OrderDetailState = null;
							Credit.OrderDetail.push(OrderDetail);
						}
					});
					return this._getOrderNumber();
				} else {
					return false;
				}
			}).then(OrderNumber => {
				if (OrderNumber) {
					Credit.OrderNumber = OrderNumber.OrderNumber;
					Credit.OrderNumberText = OrderNumber.OrderNumberText;
					this._userdata.Order = this._calculate(Credit);
					return this.save();
				} else {
					return false;
				}
			}).then((res) => {
				resolve(res);
			}).catch(err => {
				console.log(err);
				reject(err);
			});
		});
	}

	/**
	 * save order to database
	 * @returns {Promise<any>}
	 */
	save() {
		return new Promise((resolve, reject) => {
			if (this._userdata.User && this._userdata.Event && this._userdata.Order && this._userdata.Order.OrderDetail) {
				let OrderID = this._userdata.Order.OrderID;
				this._getOrderNumber().then(OrderNumber => {
					if (this._userdata.Order.OrderType === 'credit') {
						this._userdata.Order.OrderGrossRegular *= -1;
						this._userdata.Order.OrderGrossDiscount *= -1;
						this._userdata.Order.OrderGrossPrice *= -1;
						this._userdata.Order.OrderTaxPrice *= -1;
						this._userdata.Order.OrderNetPrice *= -1;
					}
					let table = 'innoOrder';
					let data = {
						OrderID: OrderID,
						OrderEventID: this._userdata.Order.OrderEventID,
						OrderNumber: OrderNumber.OrderNumber,
						OrderNumberText: OrderNumber.OrderNumberText,
						OrderState: (this._userdata.Order.OrderPayment === 'transfer') ? 'open' : 'payed',
						OrderType: (this._userdata.Order.OrderType) ? this._userdata.Order.OrderType : 'order',
						OrderDateTimeUTC: this.getDateTime(),
						OrderPayedDateTimeUTC: this._userdata.Order.OrderPayedDateTimeUTC ? this._userdata.Order.OrderPayedDateTimeUTC : null,
						OrderLocationID: this._userdata.Order.OrderLocationID,
						OrderPromoterID: this._userdata.Order.OrderPromoterID,
						OrderPayment: this._userdata.Order.OrderPayment,
						OrderAcceptGTC: this._userdata.Order.OrderAcceptGTC,
						OrderFrom: this._userdata.Order.OrderFrom,
						OrderFromUserID: this._userdata.Order.OrderFromUserID,
						OrderUserID: this._userdata.Order.OrderUserID,
						OrderUserCompany: this._userdata.Order.OrderUserCompany,
						OrderUserCompanyUID: this._userdata.Order.OrderUserCompanyUID,
						OrderUserGender: this._userdata.Order.OrderUserGender,
						OrderUserTitle: this._userdata.Order.OrderUserTitle,
						OrderUserFirstname: this._userdata.Order.OrderUserFirstname,
						OrderUserLastname: this._userdata.Order.OrderUserLastname,
						OrderUserStreet: this._userdata.Order.OrderUserStreet,
						OrderUserCity: this._userdata.Order.OrderUserCity,
						OrderUserZIP: this._userdata.Order.OrderUserZIP,
						OrderUserCountryCountryISO2: this._userdata.Order.OrderUserCountryCountryISO2,
						OrderUserEmail: this._userdata.Order.OrderUserEmail,
						OrderUserPhone1: this._userdata.Order.OrderUserPhone1,
						OrderUserPhone2: this._userdata.Order.OrderUserPhone2,
						OrderUserFax: this._userdata.Order.OrderUserFax,
						OrderUserHomepage: this._userdata.Order.OrderUserHomepage,
						OrderUserLangCode: this._userdata.Order.OrderUserLangCode,
						OrderGrossRegular: this._userdata.Order.OrderGrossRegular,
						OrderGrossDiscount: this._userdata.Order.OrderGrossDiscount,
						OrderGrossPrice: this._userdata.Order.OrderGrossPrice,
						OrderTaxPrice: this._userdata.Order.OrderTaxPrice,
						OrderNetPrice: this._userdata.Order.OrderNetPrice
					};
					return DB.promiseInsert(table, data);
				}).then(res => {
					if (_.size(this._userdata.Order.OrderDetail)) {
						let table = 'innoOrderDetail';
						let fields = ['OrderDetailScanNumber'];
						let where = {OrderDetailEventID: this._userdata.Event.EventID};
						let order = 'OrderDetailScanNumber DESC';
						let from = 0;
						let count = 1;
						return DB.promiseSelect(table, fields, where, order, from, count);
					} else {
						return;
					}
				}).then(resScanNumber => {
					if (_.size(this._userdata.Order.OrderDetail)) {
						if (!_.size(resScanNumber)) {
							resScanNumber = [{OrderDetailScanNumber: 0}];
						}
						let rowScanNumber = parseInt(resScanNumber[0].OrderDetailScanNumber);
						let table = 'innoOrderDetail';
						let data = [];
						let promises = [];
						_.each(this._userdata.Order.OrderDetail, Item => {
							let OrderDetailScanCode = null;
							let OrderDetailScanType = null;
							rowScanNumber++;
							if (this._userdata.Order.OrderType === 'order') {
								let ean = (Math.floor(Math.random() * 9) + 1).toString() + numeral(rowScanNumber).format('0000');
								OrderDetailScanCode = (this._userdata.Event.EventPrefix + ean + this.getEan8Checksum(ean)).substr(0, 13);
								OrderDetailScanType = Item.OrderDetailScanType;
							} else if (this._userdata.Order.OrderType === 'credit') {
								Item.OrderDetailGrossRegular *= -1;
								Item.OrderDetailGrossDiscount *= -1;
								Item.OrderDetailGrossPrice *= -1;
								Item.OrderDetailTaxPrice *= -1;
								Item.OrderDetailNetPrice *= -1;
							}
							data.push({
								OrderDetailScanCode: OrderDetailScanCode,
								OrderDetailScanNumber: (this._userdata.Order.OrderType === 'order') ? rowScanNumber : Item.OrderDetailScanNumber,
								OrderDetailOrderID: OrderID,
								OrderDetailEventID: this._userdata.Order.OrderEventID,
								OrderDetailType: Item.OrderDetailType,
								OrderDetailTypeID: Item.OrderDetailTypeID,
								OrderDetailScanType: OrderDetailScanType,
								OrderDetailState: Item.OrderDetailState,
								OrderDetailSortOrder: Item.OrderDetailSortOrder,
								OrderDetailText: Item.OrderDetailText,
								OrderDetailTaxPercent: Item.OrderDetailTaxPercent,
								OrderDetailGrossRegular: Item.OrderDetailGrossRegular,
								OrderDetailGrossDiscount: Item.OrderDetailGrossDiscount,
								OrderDetailGrossPrice: Item.OrderDetailGrossPrice,
								OrderDetailTaxPrice: Item.OrderDetailTaxPrice,
								OrderDetailNetPrice: Item.OrderDetailNetPrice
							});
						});
						if (this._userdata.Order.OrderType === 'credit') {
							let updateWhereCredit = {conditions: 'OrderDetailEventID=? AND (', values: [this._userdata.Order.OrderEventID]};
							let orWhereCredit = '';
							_.each(this._userdata.Order.OrderDetail, Item => {
								updateWhereCredit.conditions += orWhereCredit + 'OrderDetailScanCode=?';
								updateWhereCredit.values.push(Item.OrderDetailScanCode);
								orWhereCredit = ' OR ';
							});
							updateWhereCredit.conditions += ')';
							promises.push(DB.promiseUpdate('innoOrderDetail', {OrderDetailState: 'canceled'}, updateWhereCredit));
						}
						promises.push(DB.promiseInsert(table, data));
						return Promise.all(promises);
					} else {
						return;
					}
				}).then(() => {
					if (_.size(this._userdata.Order.OrderTax)) {
						let OrderTax = [];
						_.each(this._userdata.Order.OrderTax, (TaxPrice, TaxPercent) => {
							if (this._userdata.Order.OrderType === 'credit') {
								TaxPrice *= -1;
							}
							OrderTax.push({
								OrderTaxOrderID: OrderID,
								OrderTaxEventID: this._userdata.Order.OrderEventID,
								OrderTaxPercent: TaxPercent,
								OrderTaxAmount: TaxPrice
							});
						});
						DB.promiseInsert('innoOrderTax', OrderTax);
					} else {
						return;
					}
				}).then(() => {
					if (_.find(this._userdata.Order.OrderDetail, {ShoppingCartType: 'seat'})) {
						let whereSeat = {conditions: 'SeatEventID=? AND (', values: [this._userdata.Order.OrderEventID]};
						let or = '';
						_.each(this._userdata.Order.OrderDetail, Item => {
							if (Item.OrderDetailType === 'seat') {
								whereSeat.conditions += or + 'SeatID=?';
								whereSeat.values.push(Item.OrderDetailTypeID);
								or = ' OR ';
							}
						});
						whereSeat.conditions += ')';
						return DB.promiseUpdate('innoSeat', {SeatOrderID: (this._userdata.Order.OrderType !== 'credit') ? OrderID : null}, whereSeat);
					} else {
						return;
					}
				}).then(() => {
					this.empty();
					resolve(OrderID);
				}).catch(err => {
					console.log(err);
					reject(err);
				});
			} else {
				reject('no user, event or shopping cart?');
			}
		});

	}

	/**
	 * create all PDF´s acording to a order
	 * @param OrderID {String} 32 character string of OrderID
	 * @returns {Promise<any>}
	 */
	createPDFs(OrderID) {
		return new Promise((resolve, reject) => {
			let Order = null;
			let EventLocation = null;
			let EventTranslation = null;
			let OrderDetail = null;
			let OrderTax = null;
			let table = 'innoOrder';
			let where = {'OrderID': OrderID};
			DB.promiseSelect(table, null, where).then(ret => {
				Order = ret[0];
				let table = 'viewEventLocation';
				let where = {'EventID': Order.OrderEventID};
				return DB.promiseSelect(table, null, where);
			}).then(ret => {
				EventLocation = ret[0];
				let TokensArray = [
					EventLocation.EventHandlingFeeLabel,
					EventLocation.EventShippingCostLabel,
					EventLocation.EventBillOrderNumberLabel,
					EventLocation.EventBillOrderSubjectLabel,
					EventLocation.EventBillCreditNumberLabel,
					EventLocation.EventBillCreditSubjectLabel,
					EventLocation.EventBillPayCashLabel,
					EventLocation.EventBillPayTransferLabel,
					EventLocation.EventBillPayCreditcardLabel,
					EventLocation.EventBillPayPayPalLabel,
					EventLocation.EventBillPayEPSLabel,
					EventLocation.EventSendMailOrderSubjectLabel,
					EventLocation.EventSendMailOrderContentLabel,
					EventLocation.EventSaleStartDateBeforeLabel,
					EventLocation.EventOfflineLabel,
					EventLocation.EventSaleEndDateAfterLabel
				];
				return DB.promiseTranslate(TokensArray, Order.OrderUserLangCode, EventLocation.EventLangCodeDefault, EventLocation.EventID);
			}).then(translation => {
				EventTranslation = translation;
				let table = 'innoOrderDetail';
				let where = {'OrderDetailOrderID': OrderID};
				return DB.promiseSelect(table, null, where, 'OrderDetailSortOrder, OrderDetailGrossPrice');
			}).then(ret => {
				OrderDetail = ret;
				let table = 'innoOrderTax';
				let where = {'OrderTaxOrderID': OrderID};
				return DB.promiseSelect(table, null, where, 'OrderTaxPercent');
			}).then(ret => {
				OrderTax = ret;

				(!fs.existsSync('files')) ? fs.mkdirSync('files') : null;
				(!fs.existsSync('files/' + Order.OrderEventID)) ? fs.mkdirSync('files/' + Order.OrderEventID) : null;
				(!fs.existsSync('files/' + Order.OrderEventID + '/orders')) ? fs.mkdirSync('files/' + Order.OrderEventID + '/orders') : null;
				(!fs.existsSync('files/' + Order.OrderEventID + '/tmp')) ? fs.mkdirSync('files/' + Order.OrderEventID + '/tmp') : null;

				this._createPDFBill(EventLocation, Order, OrderDetail, OrderTax);
				this._createPDFTickets(Order, OrderDetail);

				resolve();
			}).catch(err => {
				console.log(err);
				reject(err);
			});
		});
	}

	/**
	 * send bill and tickets with email to customer
	 * @param OrderID {String} 32 character string of OrderID
	 */
	sendMail(OrderID) {

	}

	/**
	 * create PDF bill
	 * @param EventLocation
	 * @param Order
	 * @param OrderDetail
	 * @param OrderTax
	 * @private
	 */
	_createPDFBill(EventLocation, Order, OrderDetail, OrderTax) {
		const font = 'Helvetica';
		const fontSize = 10;
		const marginLeft = 60;
		const lineHeight = 18;
		const posWidth = 34.28;
		const itemWidth = 250;
		const priceWidth = 70;
		const amountWidth = 50;
		const sumWidth = 70;

		numeral.locale('at');

		const doc = new PDFDocument({
			margins: {
				'top': 180,
				'left': marginLeft,
				'right': marginLeft,
				'bottom': 100
			},
			size: 'A4',
			info: {
				Title: 'BILL title',
				Producer: 'rm-ticketing',
				Creator: 'rm-ticketing',
				Author: 'Roman Marlovits',
				Subject: 'BILL subject',
				Keywords: 'bill document Keywords',
			}
		});
		doc.pipe(fs.createWriteStream('files/' + Order.OrderEventID + '/orders/' + Order.OrderNumber + '_' + Order.OrderID + '_bill.pdf'));

		if (fs.existsSync('files/' + Order.OrderEventID + '/bill.png')) {
			doc.image('files/' + Order.OrderEventID + '/bill.png', 0, 0, {
				width: 595.28,
				height: 841.89,
				align: 'center',
				valign: 'center'
			});
		}

		doc.fontSize(fontSize);

		if (Order.OrderUserCompany) {
			doc.font(font).text(Order.OrderUserCompany);
		}
		let name = Order.OrderUserGender + ' ' + Order.OrderUserFirstname + ' ' + Order.OrderUserLastname;
		doc.font(font).text(name);
		let street = Order.OrderUserStreet;
		doc.font(font).text(street);
		let zip_city = Order.OrderUserZIP + ' ' + Order.OrderUserCity;
		doc.font(font).text(zip_city);
		let country = Order.OrderUserCountryCountryISO2;
		doc.font(font).text(country);
		doc.moveUp();
		doc.font(font).text(EventLocation.LocationCity + ', ' + this.convertDate(Order.OrderDateTimeUTC), {
			align: 'right'
		});

		let number = 'Rechnung Nr.: ' + Order.OrderNumberText;
		doc.font(font + '-Bold').text(number, marginLeft, 280);

		let top = 300;
		let left = marginLeft;

		doc.text('Pos', left, top, {'width': posWidth});
		left += posWidth;
		doc.text('Item', left, top, {'width': itemWidth});
		left += itemWidth;
		doc.text('Price', left, top, {'width': priceWidth, align: 'right'});
		left += priceWidth;
		doc.text('Amount', left, top, {'width': amountWidth, align: 'right'});
		left += amountWidth;
		doc.text('Sum', left, top, {'width': sumWidth, align: 'right'});
		left += sumWidth;

		doc.moveTo(marginLeft - 3, 3 + top + (lineHeight / 2)).lineTo(left + 3, 3 + top + (lineHeight / 2)).stroke();

		doc.font(font);
		_.each(OrderDetail, (Detail, count) => {
			top += lineHeight;

			if (count % 2 != 0) {
				//doc.fillAndStroke('gray', 'white').rect(marginLeft - 3, top - (lineHeight / 2) + 3, left + 6 - marginLeft, lineHeight);
			}
			left = marginLeft;

			doc.fillColor('black').text('# ' + (count++), left, top, {'width': posWidth});
			left += posWidth;
			doc.text(Detail.OrderDetailText, left, top, {'width': itemWidth});
			left += itemWidth;
			doc.text(numeral(Detail.OrderDetailGrossPrice).format('0,0.00 $'), left, top, {'width': priceWidth, align: 'right'});
			left += priceWidth;
			doc.text(1, left, top, {'width': amountWidth, align: 'right'});
			left += amountWidth;
			doc.text(numeral(Detail.OrderDetailGrossPrice * 1).format('0,0.00 $'), left, top, {'width': sumWidth, align: 'right'});
			left += sumWidth;

		});

		doc.moveTo(marginLeft - 3, 3 + top + (lineHeight / 2)).lineTo(left + 3, 3 + top + (lineHeight / 2)).stroke();

		top += lineHeight;
		doc.font(font + '-Bold');
		doc.text(numeral(Order.OrderGrossPrice).format('0,0.00 $'), left - sumWidth, top, {'width': sumWidth, align: 'right'});

		doc.moveDown();
		doc.moveDown();

		doc.end();

	}

	/**
	 * create PDF tickets
	 * @param OrderDetail
	 * @private
	 */
	_createPDFTickets(Order, OrderDetail) {

		let promiseQRcodes = [];
		let doneTypeID = [];
		_.each(OrderDetail, (Detail, count) => {
			if (Detail.OrderDetailType === 'ticket' || Detail.OrderDetailType === 'special' || Detail.OrderDetailType === 'seat') {
				promiseQRcodes.push(QRCode.toFile('files/' + Order.OrderEventID + '/tmp/' + Detail.OrderDetailScanCode + '.png', Detail.OrderDetailScanCode, {
					//width: 100,
					margin: 1,
					color: {
						dark: '#000000',
						light: '#ffffff' // transparent: #0000
					}
				}));
				if (doneTypeID.indexOf(Detail.OrderDetailTypeID) === -1) {
					promiseQRcodes.push(DB.promiseSelect('innoQRCodeSetting', null, {'QRCodeSettingTypeID': Detail.OrderDetailTypeID}));
					doneTypeID.push(Detail.OrderDetailTypeID);
				}
			}
		});

		Promise.all(promiseQRcodes).then(promiseResults => {

			let QRCodeSettings = {};
			_.each(promiseResults, results => {
				if (results) {
					_.each(results, rowResult => {
						if (_.isUndefined(QRCodeSettings[rowResult.QRCodeSettingTypeID])) {
							QRCodeSettings[rowResult.QRCodeSettingTypeID] = [];
						}
						QRCodeSettings[rowResult.QRCodeSettingTypeID].push(rowResult);
					});
				}
			});

			const doc = new PDFDocument({
				autoFirstPage: false,
				margin: 0,
				size: 'A4',
				info: {
					Title: 'TICKET title',
					Producer: 'rm-ticketing',
					Creator: 'rm-ticketing',
					Author: 'Roman Marlovits',
					Subject: 'TICKET subject',
					Keywords: 'ticket document Keywords',
				}
			});
			doc.pipe(fs.createWriteStream('files/' + Order.OrderEventID + '/orders/' + Order.OrderNumber + '_' + Order.OrderID + '_ticket.pdf'));

			_.each(OrderDetail, (Detail, count) => {

				if (Detail.OrderDetailType === 'ticket' || Detail.OrderDetailType === 'special' || Detail.OrderDetailType === 'seat') {

					doc.addPage();

					if (fs.existsSync('files/' + Order.OrderEventID + '/' + Detail.OrderDetailTypeID + '.png')) {
						doc.image('files/' + Order.OrderEventID + '/' + Detail.OrderDetailTypeID + '.png', 0, 0, {
							width: 595.28,
							height: 841.89,
							align: 'center',
							valign: 'center'
						});
					}

					if (fs.existsSync('files/' + Order.OrderEventID + '/tmp/' + Detail.OrderDetailScanCode + '.png') && !_.isUndefined(QRCodeSettings[Detail.OrderDetailTypeID])) {
						_.each(QRCodeSettings[Detail.OrderDetailTypeID], QRcode => {
							doc.image('files/' + Order.OrderEventID + '/tmp/' + Detail.OrderDetailScanCode + '.png', QRcode.QRCodeSettingLeft, QRcode.QRCodeSettingTop, {
								width: QRcode.QRCodeSettingWidth,
								height: QRcode.QRCodeSettingWidth,
								align: 'center',
								valign: 'center'
							});
						});
					}

					try {
						fs.unlinkSync('files/' + Order.OrderEventID + '/tmp/' + Detail.OrderDetailScanCode + '.png');
					} catch (err) {
					}

				}


			});

			doc.end();
		}).catch(err => {
		});

	}

	/**
	 * _calculate taxes, gross and net, sum of order<br>
	 * @param Order {Object} order object
	 * @example
	 * {
	 *	Order: {		// main data for the order
	 *		data: {
	 *			OrderID: this.generateUUID(),
	 *			OrderEventID: this._userdata.Event.EventID,
	 *			OrderLocationID: this._userdata.Event.EventLocationID,
	 *			OrderPromoterID: this._userdata.Event.EventPromoterID,
	 *			OrderPayment: (this._userdata.intern) ? 'cash' : 'mpay',
	 *			OrderAcceptGTC: (this._userdata.intern) ? 1 : 0, 			// accept standard business terms (german = AGB)
	 *			OrderFrom: (this._userdata.intern) ? 'intern' : 'extern',
	 *			OrderFromUserID: (this._userdata.intern && this._userdata.User && this._userdata.User.UserID) ? this._userdata.User.UserID : null,
	 *		}
	 *	},
	 *	OrderDetail: [	// detail information for the order (each item of order)
	 *		{			// example for handling fee and/or shipping cost
	 *			ShoppingCartID: this.generateUUID(),
	 *			ShoppingCartType: 'handlingfee',
	 *			ShoppingCartSortOrder: 250,
	 *			ShoppingCartTicketName: this._userdata.Event.EventHandlingFeeName,
	 *			ShoppingCartText: '',
	 *			OrderDetailOrderID: this._userdata.Order.OrderID,
	 *			OrderDetailEventID: this._userdata.Order.OrderEventID,
	 *			OrderDetailType: 'handlingfee',
	 *			OrderDetailTypeID: null,
	 *			OrderDetailScanType: null,
	 *			OrderDetailState: 'sold',
	 *			OrderDetailSortOrder: 250,
	 *			OrderDetailText: this._userdata.Event.EventHandlingFeeLabel,
	 *			OrderDetailTaxPercent: this._userdata.Event.EventHandlingFeeTaxPercent,
	 *			OrderDetailGrossRegular: OrderDetailGrossRegular,
	 *			OrderDetailGrossDiscount: 0,
	 *			OrderDetailGrossPrice: 0,
	 *			OrderDetailTaxPrice: 0,
	 *			OrderDetailNetPrice: 0
	 *		}, {		// example for ticket
	 *			ShoppingCartID: this.generateUUID(),
	 *			ShoppingCartType: rowTicket.TicketType,
	 *			ShoppingCartSortOrder: rowTicket.TicketSortOrder,
	 *			ShoppingCartTicketName: rowTicket.TicketName,
	 *			ShoppingCartText: rowTicket.TicketLabel,
	 *			OrderDetailOrderID: this._userdata.Order.OrderID,
	 *			OrderDetailEventID: this._userdata.Order.OrderEventID,
	 *			OrderDetailType: rowTicket.TicketType,
	 *			OrderDetailTypeID: rowTicket.TicketID,
	 *			OrderDetailScanType: rowTicket.TicketScanType,
	 *			OrderDetailState: 'sold',
	 *			OrderDetailSortOrder: rowTicket.TicketSortOrder,
	 *			OrderDetailText: rowTicket.TicketLabel,
	 *			OrderDetailTaxPercent: rowTicket.TicketTaxPercent,
	 *			OrderDetailGrossRegular: rowTicket.TicketGrossPrice,
	 *			OrderDetailGrossDiscount: 0,
	 *			OrderDetailGrossPrice: 0,
	 *			OrderDetailTaxPrice: 0,
	 *			OrderDetailNetPrice: 0
	 *		}, {		// example for seat
	 *			ShoppingCartID: this.generateUUID(),
	 *			ShoppingCartType: 'seat',
	 *			ShoppingCartSortOrder: 201,
	 *			ShoppingCartSeatName: rowSeat.SeatName,
	 *			ShoppingCartRoomName: rowSeat.RoomName,
	 *			ShoppingCartTableName: rowSeat.TableName,
	 *			ShoppingCartTableNumber: rowSeat.TableNumber,
	 *			ShoppingCartText: text,
	 *			OrderDetailOrderID: this._userdata.Order.OrderID,
	 *			OrderDetailEventID: this._userdata.Order.OrderEventID,
	 *			OrderDetailType: 'seat',
	 *			OrderDetailTypeID: rowSeat.SeatID,
	 *			OrderDetailScanType: 'single',
	 *			OrderDetailState: 'sold',
	 *			OrderDetailSortOrder: 201,
	 *			OrderDetailText: text,
	 *			OrderDetailTaxPercent: rowSeat.SeatTaxPercent,
	 *			OrderDetailGrossRegular: rowSeat.SeatGrossPrice,
	 *			OrderDetailGrossDiscount: 0,
	 *			OrderDetailGrossPrice: 0,
	 *			OrderDetailTaxPrice: 0,
	 *			OrderDetailNetPrice: 0
	 *		}
	 *
	 *	]
	 * }
	 * @returns {Object} new order object with all _calculated date for prices and taxes
	 * @private
	 */
	_calculate(Order) {

		let roundFactor = 100;

		_.extend(Order, {
			OrderGrossRegular: 0,
			OrderGrossDiscount: 0,
			OrderGrossPrice: 0,
			OrderTaxPrice: 0,
			OrderNetPrice: 0,
		});

		let OrderDetail = [];
		let OrderTax = {};

		_.each(Order.OrderDetail, Item => {

			Item.OrderDetailGrossRegular *= roundFactor;
			Item.OrderDetailGrossDiscount *= roundFactor;
			Item.OrderDetailGrossPrice = Item.OrderDetailGrossRegular - Item.OrderDetailGrossDiscount;

			Item.OrderDetailTaxPrice = (Item.OrderDetailTaxPercent) ? Math.round(Item.OrderDetailGrossPrice / (100 + Item.OrderDetailTaxPercent) * Item.OrderDetailTaxPercent) : 0;
			Item.OrderDetailNetPrice = Math.round(Item.OrderDetailGrossPrice - Item.OrderDetailTaxPrice);

			Item.OrderDetailGrossRegular /= roundFactor;
			Item.OrderDetailGrossDiscount /= roundFactor;
			Item.OrderDetailGrossPrice /= roundFactor;
			Item.OrderDetailTaxPrice /= roundFactor;
			Item.OrderDetailNetPrice /= roundFactor;

			OrderDetail.push(Item);

			if (Item.OrderDetailTaxPercent && _.isUndefined(OrderTax[Item.OrderDetailTaxPercent])) {
				OrderTax[Item.OrderDetailTaxPercent] = Item.OrderDetailTaxPrice * roundFactor;
			} else if (Item.OrderDetailTaxPercent) {
				OrderTax[Item.OrderDetailTaxPercent] += Item.OrderDetailTaxPrice * roundFactor;
			}

			Order.OrderGrossRegular += Item.OrderDetailGrossRegular * roundFactor;
			Order.OrderGrossDiscount += Item.OrderDetailGrossDiscount * roundFactor;
			Order.OrderGrossPrice += Item.OrderDetailGrossPrice * roundFactor;
			Order.OrderTaxPrice += Item.OrderDetailTaxPrice * roundFactor;
			Order.OrderNetPrice += Item.OrderDetailNetPrice * roundFactor;

		});

		_.each(OrderTax, (OrderTaxPrice, OrderTaxPercent) => {
			OrderTax[OrderTaxPercent] = OrderTaxPrice /= roundFactor;
		});

		Order.OrderDetail = _.sortBy(OrderDetail, ['ShoppingCartSortOrder', 'ShoppingCartText']);
		Order.OrderTax = OrderTax;

		Order.OrderGrossRegular = Math.round(Order.OrderGrossRegular) / roundFactor;
		Order.OrderGrossDiscount = Math.round(Order.OrderGrossDiscount) / roundFactor;
		Order.OrderGrossPrice = Math.round(Order.OrderGrossPrice) / roundFactor;
		Order.OrderTaxPrice = Math.round(Order.OrderTaxPrice) / roundFactor;
		Order.OrderNetPrice = Math.round(Order.OrderNetPrice) / roundFactor;

		return Order;
	}

	_getScanCode() {

	}

	_getOrderNumber() {
		return new Promise((resolve, reject) => {

			// TODO: check if next year started or so (see database create table innoEvent, fields: EventOrderNumberBy and EventOrderNumberResetDateTimeUTC)
			// think about ist

			let table = 'innoOrder';
			let fields = ['OrderNumber'];
			let where = {OrderEventID: this._userdata.Event.EventID};
			let order = 'OrderNumber DESC';
			let from = 0;
			let count = 1;

			DB.promiseSelect(table, fields, where, order, from, count).then(resNumber => {
				let OrderNumber = parseInt(this._userdata.Event.EventStartBillNumber);
				if (_.size(resNumber)) {
					OrderNumber = parseInt(resNumber[0].OrderNumber) + 1;
				}
				let OrderNumberText = this._userdata.Event.EventPrefix + '-' + numeral(OrderNumber).format('000000');
				resolve({
					OrderNumber: OrderNumber,
					OrderNumberText: OrderNumberText
				});
			}).catch(err => {
				reject(err);
			});
		});
	}

}

module.exports = Order;
