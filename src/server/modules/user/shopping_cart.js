import Module from './../module';
import Order from '../order/order';
import numeral from 'numeral';
import bwipjs from 'bwip-js';
import ean from 'ean';
import _ from 'lodash';

/**
 * user shopping cart actions
 * @extends Module
 */
class UserShoppingCart extends Module {

	/**
	 * constructor
	 * @param ClientConnID {String} 32 character string of connection ID from database table
	 */
	constructor(ClientConnID) {
		super(ClientConnID);
		this._userdata = SOCKET.io.sockets.connected[this._clientConnID].userdata;
		if (this._userdata.Event) {
			if (!_.isObject(this._userdata.ShoppingCart)) {
				this._userdata.ShoppingCart = {
					data: {
						OrderID: this.generateUUID(),
						OrderEventID: this._userdata.Event.EventID,
						OrderLocationID: this._userdata.Event.EventLocationID,
						OrderPromoterID: this._userdata.Event.EventPromoterID,
						OrderPayment: (this._userdata.intern) ? 'cash' : 'mpay',
						OrderAcceptGTC: (this._userdata.intern) ? 1 : 0, 			// accept standard business terms (german = AGB)
						OrderFrom: (this._userdata.intern) ? 'intern' : 'extern',
						OrderFromUserID: (this._userdata.intern && this._userdata.User && this._userdata.User.UserID) ? this._userdata.User.UserID : null,
					},
					OrderDetail: [],
					OrderTax: {}
				}
			}
			if (_.isUndefined(_.find(this._userdata.ShoppingCart.OrderDetail, {ShoppingCartType: 'handlingfee'}))) {
				let OrderDetailGrossRegular = (this._userdata.intern) ? this._userdata.Event.EventHandlingFeeGrossInternal : this._userdata.Event.EventHandlingFeeGrossExternal;
				if (OrderDetailGrossRegular || this._userdata.intern) {
					this._userdata.ShoppingCart.OrderDetail.push({
						ShoppingCartID: this.generateUUID(),
						ShoppingCartType: 'handlingfee',
						ShoppingCartSortOrder: 250,
						ShoppingCartTicketName: this._userdata.Event.EventHandlingFeeName,
						ShoppingCartText: '',
						data: {
							OrderDetailOrderID: this._userdata.ShoppingCart.data.OrderID,
							OrderDetailEventID: this._userdata.ShoppingCart.data.OrderEventID,
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
						}
					});
				}
			}
			if (_.isUndefined(_.find(this._userdata.ShoppingCart.OrderDetail, {ShoppingCartType: 'shippingcost'}))) {
				let OrderDetailGrossRegular = (this._userdata.intern) ? this._userdata.Event.EventShippingCostGrossInternal : this._userdata.Event.EventShippingCostGrossExternal;
				if (OrderDetailGrossRegular || this._userdata.intern) {
					this._userdata.ShoppingCart.OrderDetail.push({
						ShoppingCartID: this.generateUUID(),
						ShoppingCartType: 'shippingcost',
						ShoppingCartSortOrder: 249,
						ShoppingCartTicketName: this._userdata.Event.EventShippingCostName,
						ShoppingCartText: '',
						data: {
							OrderDetailOrderID: this._userdata.ShoppingCart.data.OrderID,
							OrderDetailEventID: this._userdata.ShoppingCart.data.OrderEventID,
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
						}
					});
				}
			}
			let order = new Order(this._clientConnID);
			this._userdata.ShoppingCart = order.calculate(this._userdata.ShoppingCart);
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
		_.extend(this._userdata.ShoppingCart.data, {
			OrderUserID: !_.isUndefined(User.UserID) ? User.UserID : this._userdata.ShoppingCart.UserID,
			OrderUserCompany: !_.isUndefined(User.UserCompany) ? User.UserCompany : this._userdata.ShoppingCart.UserCompany,
			OrderUserCompanyUID: !_.isUndefined(User.UserCompanyUID) ? User.UserCompanyUID : this._userdata.ShoppingCart.UserCompanyUID,
			OrderUserGender: !_.isUndefined(User.UserGender) ? User.UserGender : this._userdata.ShoppingCart.UserGender,
			OrderUserTitle: !_.isUndefined(User.UserTitle) ? User.UserTitle : this._userdata.ShoppingCart.UserTitle,
			OrderUserFirstname: !_.isUndefined(User.UserFirstname) ? User.UserFirstname : this._userdata.ShoppingCart.UserFirstname,
			OrderUserLastname: !_.isUndefined(User.UserLastname) ? User.UserLastname : this._userdata.ShoppingCart.UserLastname,
			OrderUserStreet: !_.isUndefined(User.UserStreet) ? User.UserStreet : this._userdata.ShoppingCart.UserStreet,
			OrderUserCity: !_.isUndefined(User.UserCity) ? User.UserCity : this._userdata.ShoppingCart.UserCity,
			OrderUserZIP: !_.isUndefined(User.UserZIP) ? User.UserZIP : this._userdata.ShoppingCart.UserZIP,
			OrderUserCountryCountryISO2: !_.isUndefined(User.UserCountryCountryISO2) ? User.OrderUserCountryCountryISO2 : this._userdata.ShoppingCart.OrderUserCountryCountryISO2,
			OrderUserEmail: !_.isUndefined(User.UserEmail) ? User.UserEmail : this._userdata.ShoppingCart.UserEmail,
			OrderUserPhone1: !_.isUndefined(User.UserPhone1) ? User.UserPhone1 : this._userdata.ShoppingCart.UserPhone1,
			OrderUserPhone2: !_.isUndefined(User.UserPhone2) ? User.UserPhone2 : this._userdata.ShoppingCart.UserPhone2,
			OrderUserFax: !_.isUndefined(User.UserFax) ? User.UserFax : this._userdata.ShoppingCart.UserFax,
			OrderUserHomepage: !_.isUndefined(User.UserHomepage) ? User.UserHomepage : this._userdata.ShoppingCart.UserHomepage,
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
				_.each(this._userdata.ShoppingCart.OrderDetail, (Item) => {
					if (Item.OrderDetailTypeID !== TicketID) {
						OrderDetail.push(Item);
					}
				});
				this._userdata.ShoppingCart.OrderDetail = OrderDetail;

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
							if (client.id != this._clientConnID && client.adapter.rooms[this._userdata.Event.EventID].sockets && client.userdata.ShoppingCart && client.userdata.ShoppingCart.OrderDetail) {
								_.each(client.userdata.ShoppingCart.OrderDetail, Detail => {
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
							this._userdata.ShoppingCart.OrderDetail.push({
								ShoppingCartID: this.generateUUID(),
								ShoppingCartType: rowTicket.TicketType,
								ShoppingCartSortOrder: rowTicket.TicketSortOrder,
								ShoppingCartTicketName: rowTicket.TicketName,
								ShoppingCartText: rowTicket.TicketLable,
								data: {
									OrderDetailOrderID: this._userdata.ShoppingCart.data.OrderID,
									OrderDetailEventID: this._userdata.ShoppingCart.data.OrderEventID,
									OrderDetailType: rowTicket.TicketType,
									OrderDetailTypeID: rowTicket.TicketID,
									OrderDetailScanType: rowTicket.TicketScanType,
									OrderDetailState: 'sold',
									OrderDetailSortOrder: rowTicket.TicketSortOrder,
									OrderDetailText: rowTicket.TicketLable,
									OrderDetailTaxPercent: rowTicket.TicketTaxPercent,
									OrderDetailGrossRegular: rowTicket.TicketGrossPrice,
									OrderDetailGrossDiscount: 0,
									OrderDetailGrossPrice: 0,
									OrderDetailTaxPrice: 0,
									OrderDetailNetPrice: 0
								}
							});
						}
						let order = new Order(this._clientConnID);
						this._userdata.ShoppingCart = order.calculate(this._userdata.ShoppingCart);

						SOCKET.io.to(this._userdata.Event.EventID).emit('shopping-cart-update-ticket', {
							TicketID: rowTicket.TicketID,
							TicketType: rowTicket.TicketType,
							TicketAvailable: availableTicket - Amount
						});
						resolve(this._userdata.ShoppingCart);

						let availableVisitors = maximumVisitors - actualVisitors - Amount;
						SOCKET.io.to(this._userdata.Event.EventID).emit('shopping-cart-update-event', {
							EventAvailableVisitors: (this._userdata.Event.EventMaximumVisitors) ? availableVisitors : null
						});

					}).catch(err => {
						console.log(err);
						reject();
					});
				} else {
					let order = new Order(this._clientConnID);
					this._userdata.ShoppingCart = order.calculate(this._userdata.ShoppingCart);
					resolve(this._userdata.ShoppingCart);
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
								if (client.adapter.rooms[this._userdata.Event.EventID].sockets && client.userdata.ShoppingCart && client.userdata.ShoppingCart.OrderDetail) {
									_.each(client.userdata.ShoppingCart.OrderDetail, Detail => {
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
								this._userdata.ShoppingCart.OrderDetail.push({
									ShoppingCartID: this.generateUUID(),
									ShoppingCartType: 'seat',
									ShoppingCartSortOrder: 201,
									ShoppingCartSeatName: rowSeat.SeatName,
									ShoppingCartRoomName: rowSeat.RoomName,
									ShoppingCartTableName: rowSeat.TableName,
									ShoppingCartTableNumber: rowSeat.TableNumber,
									ShoppingCartText: text,
									data: {
										OrderDetailOrderID: this._userdata.ShoppingCart.data.OrderID,
										OrderDetailEventID: this._userdata.ShoppingCart.data.OrderEventID,
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
									}
								});
							} else if (action === 'release') {
								let OrderDetail = [];
								_.each(this._userdata.ShoppingCart.OrderDetail, (Item) => {
									if (Item.OrderDetailTypeID !== SeatID) {
										OrderDetail.push(Item);
									}
								});
								this._userdata.ShoppingCart.OrderDetail = OrderDetail;
							}
							if (action !== 'blocked') {
								let order = new Order(this._clientConnID);
								this._userdata.ShoppingCart = order.calculate(this._userdata.ShoppingCart);
								let res = {
									SeatID: SeatID,
									SeatState: (action === 'release') ? 'free' : 'blocked'
								};
								SOCKET.io.to(this._userdata.Event.EventID).emit('shopping-cart-update-seat', res);
								resolve(this._userdata.ShoppingCart);

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
						let OrderDetail = _.find(this._userdata.ShoppingCart.OrderDetail, {ShoppingCartID: values.ID});
						OrderDetail.data.OrderDetailGrossDiscount = values.Discount;
						let order = new Order(this._clientConnID);
						this._userdata.ShoppingCart = order.calculate(this._userdata.ShoppingCart);
						resolve(this._userdata.ShoppingCart);
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
						this._userdata.ShoppingCart.data.OrderPayment = Payment;
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
			this._userdata.ShoppingCart = null;
			resolve(null);
		});
	}

	/**
	 * delete item from shopping cart by unique ID
	 * @param DetailID {String} 32 character string one of ID ShoppingCart.OrderDetail[].ShoppingCartID
	 * @returns {Promise<any>}
	 */
	del(DetailID) {
		return new Promise((resolve, reject) => {
			if (this._userdata.Event) {
				let OrderDetail = [];
				_.each(this._userdata.ShoppingCart.OrderDetail, Detail => {
					if (Detail.ShoppingCartID !== DetailID) {
						OrderDetail.push(Detail);
					}
				});
				this._userdata.ShoppingCart.OrderDetail = OrderDetail;
				let order = new Order(this._clientConnID);
				this._userdata.ShoppingCart = order.calculate(this._userdata.ShoppingCart);
				resolve(this._userdata.ShoppingCart);
			} else {
				reject('no event ist set');
			}
		});
	}

	/**
	 * start pay process
	 */
	save() {
		return new Promise((resolve, reject) => {
			if (this._userdata.User && this._userdata.Event && this._userdata.ShoppingCart && this._userdata.ShoppingCart.OrderDetail) {
				if (this._userdata.ShoppingCart.data.OrderPayment === 'transfer') {
					this._userdata.ShoppingCart.data.OrderState = 'open';
				} else {
					this._userdata.ShoppingCart.data.OrderState = 'payed';
				}
				this._userdata.ShoppingCart.data.OrderDateTimeUTC = this.getDateTime();

				let table = 'innoOrder';
				let fields = ['OrderNumber'];
				let where = {OrderEventID: this._userdata.Event.EventID};
				let order = 'OrderNumber DESC';
				let from = 0;
				let count = 1;

				DB.promiseSelect(table, fields, where, order, from, count).then(resNumber => {
					if (_.size(resNumber)) {
						let rowNumber = resNumber[0];
						this._userdata.ShoppingCart.data.OrderNumber = parseInt(rowNumber.OrderNumber) + 1;
					} else {
						this._userdata.ShoppingCart.data.OrderNumber = parseInt(this._userdata.Event.EventStartBillNumber);
					}
					this._userdata.ShoppingCart.data.OrderNumberText = this._userdata.Event.EventPrefix + '-' + numeral(this._userdata.ShoppingCart.data.OrderNumber).format('000000');
					return DB.promiseInsert('innoOrder', this._userdata.ShoppingCart.data);
				}).then(res => {
					let table = 'innoOrderDetail';
					let fields = ['OrderDetailScanNumber'];
					let where = {OrderDetailEventID: this._userdata.Event.EventID};
					let order = 'OrderDetailScanNumber DESC';
					let from = 0;
					let count = 1;
					return DB.promiseSelect(table, fields, where, order, from, count);
				}).then(resScanNumber => {
					if (!_.size(resScanNumber)) {
						resScanNumber = [{OrderDetailScanNumber: 0}];
					}
					let rowScanNumber = parseInt(resScanNumber[0].OrderDetailScanNumber);
					let OrderDetail = [];
					_.each(this._userdata.ShoppingCart.OrderDetail, Item => {
						rowScanNumber++;
						let ean = (Math.floor(Math.random() * 9) + 1).toString() + numeral(rowScanNumber).format('0000');
						Item.data.OrderDetailScanCode = (this._userdata.Event.EventPrefix + ean + this.getEan8Checksum(ean)).substr(0, 13);
						Item.data.OrderDetailScanNumber = rowScanNumber;
						OrderDetail.push(Item.data);
					});
					return DB.promiseInsert('innoOrderDetail', OrderDetail);
				}).then(() => {
					if (_.find(this._userdata.ShoppingCart.OrderDetail, {ShoppingCartType: 'seat'})) {
						let whereSeat = {conditions: 'SeatEventID=? AND (', values: [this._userdata.ShoppingCart.data.OrderEventID]};
						let or = '';
						_.each(this._userdata.ShoppingCart.OrderDetail, Item => {
							if (Item.data.OrderDetailType === 'seat') {
								whereSeat.conditions += or + 'SeatID=?';
								whereSeat.values.push(Item.data.OrderDetailTypeID);
								or = ' OR ';
							}
						});
						whereSeat.conditions += ')';
						return DB.promiseUpdate('innoSeat', {SeatOrderID: this._userdata.ShoppingCart.data.OrderID}, whereSeat);
					} else {
						return;
					}
				}).then(res => {
					if (_.size(this._userdata.ShoppingCart.OrderTax)) {
						let OrderTax = [];
						_.each(this._userdata.ShoppingCart.OrderTax, (TaxPrice, TaxPercent) => {
							OrderTax.push({
								OrderTaxOrderID: this._userdata.ShoppingCart.data.OrderID,
								OrderTaxPercent: TaxPercent,
								OrderTaxAmount: TaxPrice
							});
						});
						DB.promiseInsert('innoOrderTax', OrderTax);
					} else {
						return;
					}
				}).then(res => {
					this.empty();
					resolve(true);
				}).catch(err => {
					console.log(err);
					reject(err);
				});
			} else {
				reject('no user, event or shopping cart?');
			}
		});

	}

}

module.exports = UserShoppingCart;
