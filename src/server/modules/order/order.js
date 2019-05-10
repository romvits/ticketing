import Module from './../module';
import User from './../user/user';
import _ from 'lodash';
import randtoken from "rand-token";

/**
 * floor module
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
	}

	/**
	 * create order
	 * @param Order
	 * @returns {Promise<any>}
	 */
	create(Order) {
		return new Promise((resolve, reject) => {

			let OrderUserID = Order.OrderUserID ? Order.OrderUserID : null;
			let OrderFromUserID = Order.OrderFromUserID ? Order.OrderFromUserID : null;

			_.extend(Order, {'OrderID': this.generateUUID()});

			let result = {};

			let Event = null;
			let User = null;
			let UserFrom = null;
			let OrderDetail = [];
			let SpecialOffer = [];
			let OrderTax = [];

			let OrderDateTimeUTC = this.getDateTime();

			DB.promiseSelect('viewOrderEvent', null, {'EventID': Order.OrderEventID}).then((resEvent) => {
				if (_.size(resEvent)) {
					Event = resEvent[0];
				} else {
					Event = null;
				}
				return this._fetchUser(OrderUserID);
			}).then(resUser => {
				User = resUser;
				return this._fetchUser(OrderFromUserID);
			}).then(resUserFrom => {
				UserFrom = resUserFrom;
				return this._fetchSpecialOffer(Order.OrderSpecialOfferID, Order.OrderID);
			}).then((resSpecialOffer) => {
				SpecialOffer = resSpecialOffer;
				return this._fetchSpecialOfferUser(Order.SpecialOfferUserCode, Order.OrderID);
			}).then((resSpecialOffer) => {
				SpecialOffer = resSpecialOffer;
				return this._fetchOrderDetail(Order.OrderDetail, Order, Event, UserFrom ? true : false);
			}).then((resOrderDetail) => {
				// =================================================================
				// calculate some values like price and discount and taxes and so on
				// =================================================================
				OrderDetail = resOrderDetail;
				/*
				console.log('Event =============================');
				console.log(Event);

				console.log('User ==============================');
				console.log(User);

				console.log('UserFrom ==========================');
				console.log(UserFrom);

				console.log('SpecialOffer ======================');
				console.log(SpecialOffer);

				console.log('OrderDetail =======================');
				console.log(OrderDetail);

				console.log('OrderTax ==========================');
				console.log(OrderTax);

				console.log('OrderNumber =======================');
				console.log(OrderNumber);
				*/
				return this._fetchOrderNumber(Event);
			}).then((OrderNumber) => {

				if (_.size(OrderDetail)) {

					delete Order.OrderSpecialOfferUserCode;
					delete Order.OrderDetail;
					Order.OrderPromoterID = Event.EventPromoterID;

					return DB.promiseInsert(this.table, Order);
				} else { // no detail products?
					return
				}
			}).then((resInsertOrder) => {
				if (_.size(OrderDetail)) {
					return DB.promiseInsert('innoOrderDetail', OrderDetail);
				} else { // no detail products?
					return
				}
			}).then((resInsertDetail) => {
				return this._createOrderTax(OrderDetail, Order.OrderID);
			}).then((res) => {


				return this._createPDF(Order.OrderID);
			}).then((res) => {
				resolve(result);
			});
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
	 *
	 * @param req
	 * @returns {Promise<any>}
	 */
	fetchAll(req) {
		let where = {OrderEventID: this._userdata.Event.EventID};
		let fields = null;
		let orderby = null;
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
	 * delete for order is not allowed, only storno for items of order is available
	 */
	delete() {
		return new Promise((resolve, reject) => {
			resolve();
		});
	}

	/**
	 * cancel item(s) from order<br>
	 * clear order items and set to canceled and update seats to free seats
	 * create new order from type credit (storno) OrderType = credit
	 * @param OrderDetailScanCodeS {Array} array of item scan codes which will be effected for this cancel
	 * @returns {Promise<any>}
	 * TODO: implementation
	 */
	cancelItem(ItemScanCodeS) {
		return new Promise((resolve, reject) => {
			resolve({canceled: ItemScanCodeS});
		});
	}

	/**
	 * calculate taxes, gross and net, sum of order<br>
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
	 *			OrderDetailOrderID: this._userdata.ShoppingCart.OrderID,
	 *			OrderDetailEventID: this._userdata.ShoppingCart.OrderEventID,
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
	 *			ShoppingCartText: rowTicket.TicketLable,
	 *			OrderDetailOrderID: this._userdata.ShoppingCart.OrderID,
	 *			OrderDetailEventID: this._userdata.ShoppingCart.OrderEventID,
	 *			OrderDetailType: rowTicket.TicketType,
	 *			OrderDetailTypeID: rowTicket.TicketID,
	 *			OrderDetailScanType: rowTicket.TicketScanType,
	 *			OrderDetailState: 'sold',
	 *			OrderDetailSortOrder: rowTicket.TicketSortOrder,
	 *			OrderDetailText: rowTicket.TicketLable,
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
	 *			OrderDetailOrderID: this._userdata.ShoppingCart.OrderID,
	 *			OrderDetailEventID: this._userdata.ShoppingCart.OrderEventID,
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
	 * @returns {Object} new order object with all calculated date for prices and taxes
	 */
	calculate(Order) {

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

			Item.OrderDetailGrossRegular *= 100;
			Item.OrderDetailGrossDiscount *= 100;
			Item.OrderDetailGrossPrice = Item.OrderDetailGrossRegular - Item.OrderDetailGrossDiscount;
			Item.OrderDetailTaxPrice = (Item.OrderDetailTaxPercent) ? Math.round(Item.OrderDetailGrossPrice / (100 + Item.OrderDetailTaxPercent) * Item.OrderDetailTaxPercent) : 0;
			Item.OrderDetailNetPrice = Math.round(Item.OrderDetailGrossPrice - Item.OrderDetailTaxPrice);

			Item.OrderDetailGrossRegular /= 100;
			Item.OrderDetailGrossDiscount /= 100;
			Item.OrderDetailGrossPrice /= 100;
			Item.OrderDetailTaxPrice /= 100;
			Item.OrderDetailNetPrice /= 100;

			OrderDetail.push(Item);

			if (Item.OrderDetailTaxPercent && _.isUndefined(OrderTax[Item.OrderDetailTaxPercent])) {
				OrderTax[Item.OrderDetailTaxPercent] = Item.OrderDetailTaxPrice * 100;
			} else if (Item.OrderDetailTaxPercent) {
				OrderTax[Item.OrderDetailTaxPercent] += Item.OrderDetailTaxPrice * 100;
			}

			Order.OrderGrossRegular += Item.OrderDetailGrossRegular * 100;
			Order.OrderGrossDiscount += Item.OrderDetailGrossDiscount * 100;
			Order.OrderGrossPrice += Item.OrderDetailGrossPrice * 100;
			Order.OrderTaxPrice += Item.OrderDetailTaxPrice * 100;
			Order.OrderNetPrice += Item.OrderDetailNetPrice * 100;

		});

		_.each(OrderTax, (OrderTaxPrice, OrderTaxPercent) => {
			OrderTax[OrderTaxPercent] = OrderTaxPrice /= 100;
		});

		Order.OrderDetail = _.sortBy(OrderDetail, ['ShoppingCartSortOrder', 'ShoppingCartText']);
		Order.OrderTax = OrderTax;

		Order.OrderGrossRegular = Math.round(Order.OrderGrossRegular) / 100;
		Order.OrderGrossDiscount = Math.round(Order.OrderGrossDiscount) / 100;
		Order.OrderGrossPrice = Math.round(Order.OrderGrossPrice) / 100;
		Order.OrderTaxPrice = Math.round(Order.OrderTaxPrice) / 100;
		Order.OrderNetPrice = Math.round(Order.OrderNetPrice) / 100;


		return Order;
	}

	/**
	 *  save order
	 *
	 */
	save(Order) {

	}

	/**
	 * create order detail
	 * @param values
	 * @private
	 */
	_createOrderDetail(OrderDetail) {
		return new Promise((resolve, reject) => {
			DB.promiseInsert('innoOrderDetail', OrderDetail).then(res => {
				resolve();
			}).catch(err => {
				console.log(err);
				reject(err);
			});
		});
	}

	/**
	 * create order tax
	 * @param values
	 * @returns {Promise<any>}
	 * @private
	 */
	_createOrderTax(values) {
		return new Promise((resolve, reject) => {
			resolve();
		});
	}

	/**
	 * create PDF
	 * @param OrderID
	 * @private
	 */
	_createPDF(OrderID) {
		return new Promise((resolve, reject) => {
			resolve();
		});
	}

	/**
	 * fetch user
	 * @param UserID
	 * @returns {Promise<any>}
	 * @private
	 */
	_fetchUser(UserID) {
		return new Promise((resolve, reject) => {
			if (UserID) {
				let user = new User(this.getConnID(), this.getConnUserID());
				user.fetch(UserID).then(res => {
					if (_.size(res)) {
						resolve(res[0]);
					} else {
						resolve(null);
					}
				}).catch(err => {
					reject(err);
				});
			} else {
				resolve(null);
			}
		});
	}

	/**
	 * fetch order detail
	 * @param Details {Array} array of order detail items
	 * @param Order {Object} object of order
	 * @param Event {Object} object of event
	 * @param internal {Boolean} is this internal order
	 * @returns {Promise<any>}
	 * @private
	 */
	_fetchOrderDetail(Details, Order, Event, internal) {
		return new Promise((resolve, reject) => {

			let OrderID = Order.OrderID;
			let EventID = Event.EventID;
			let EventPrefix = Event.EventPrefix;

			let OrderType = 'External';
			if (internal) {
				OrderType = 'Internal';
			}

			let FeeCost = [];

			let HandlingFee = _.find(Details, {'OrderDetailType': 'handlingfee'});
			if (Event['EventHandlingFeeGross' + OrderType] || _.isObject(HandlingFee)) {
				let Detail = {
					OrderDetailType: 'handlingfee',
					OrderDetailTypeID: null,
					OrderDetailName: Event.EventHandlingFeeName ? Event.EventHandlingFeeName : 'Handling Fee',
					OrderDetailLabel: Event.EventHandlingFeeLabel ? Event.EventHandlingFeeLabel : null,
					OrderDetailScanType: 'noscan',
					OrderDetailGrossRegular: Event['EventHandlingFeeGross' + OrderType] ? Event['EventHandlingFeeGross' + OrderType] : 0,
					OrderDetailGrossDiscount: 0,
					OrderDetailGrossPrice: Event['EventHandlingFeeGross' + OrderType] ? Event['EventHandlingFeeGross' + OrderType] : 0,
					OrderDetailTaxPercent: Event.EventHandlingFeeTaxPercent ? Event.EventHandlingFeeTaxPercent : 0
				}
				if (internal) {
					if (HandlingFee && _.isObject(HandlingFee)) {
						_.extend(Detail, HandlingFee);
						if (HandlingFee.OrderDetailGrossPrice) {
							Detail.OrderDetailGrossRegular = HandlingFee.OrderDetailGrossPrice;
						}
						if (HandlingFee.OrderDetailGrossDiscount) {
							Detail.OrderDetailGrossPrice = Detail.OrderDetailGrossPrice - HandlingFee.OrderDetailGrossDiscount;
						}
					}
				}
				_.extend(Detail, {
					'OrderDetailID': this.generateUUID(),
				});
				FeeCost.push(Detail);
			}

			if (internal) {
				let ShippingCost = _.find(Details, {'OrderDetailType': 'shippingcost'});
				if (Event.EventShippingCostGross || _.isObject(ShippingCost)) {
					let Detail = {
						OrderDetailType: 'shippingcost',
						OrderDetailTypeID: null,
						OrderDetailName: Event.EventShippingCostName ? Event.EventShippingCostName : 'Handling Fee',
						OrderDetailLabel: Event.EventShippingCostLabel ? Event.EventShippingCostLabel : null,
						OrderDetailScanType: 'noscan',
						OrderDetailGrossRegular: Event.EventShippingCostGross ? Event.EventShippingCostGross : 0,
						OrderDetailGrossDiscount: 0,
						OrderDetailGrossPrice: Event.EventShippingCostGross ? Event.EventShippingCostGross : 0,
						OrderDetailTaxPercent: Event.EventShippingCostTaxPercent ? Event.EventShippingCostTaxPercent : 0
					}
					if (ShippingCost && _.isObject(ShippingCost)) {
						_.extend(Detail, ShippingCost);
						if (ShippingCost.OrderDetailGrossPrice) {
							Detail.OrderDetailGrossRegular = ShippingCost.OrderDetailGrossPrice;
						}
						if (ShippingCost.OrderDetailGrossDiscount) {
							Detail.OrderDetailGrossPrice = Detail.OrderDetailGrossPrice - ShippingCost.OrderDetailGrossDiscount;
						}
					}
					_.extend(Detail, {
						'OrderDetailID': this.generateUUID(),
					});
					FeeCost.push(Detail);
				}
			}

			let Items = []; // temporary store Details into Items Array (to split each item 'detail' into one big array => Amount of tickets or specials)
			_.each(Details, Detail => {
				if (Detail.OrderDetailType == 'ticket' || Detail.OrderDetailType == 'special') {
					Detail.Amount = (Detail.Amount) ? Detail.Amount : 1;
					for (var i = 0; i < Detail.Amount; i++) {
						_.extend(Detail, {
							'OrderDetailID': this.generateUUID(),
						});
						Items.push(_.clone(Detail));
					}
				} else {
					_.extend(Detail, {
						'OrderDetailID': this.generateUUID(),
					});
					Items.push(_.clone(Detail));
				}
			});

			Details = FeeCost;
			let promiseSelect = [];
			let TicketID = [];
			let whereTicket = {conditions: 'TicketEventID=? AND (', values: [EventID]};
			let orTicket = '';
			let SeatID = [];
			let whereSeat = {conditions: 'SeatEventID=? AND (', values: [EventID]};
			let orSeat = '';
			_.each(Items, Detail => {
				if (Detail.OrderDetailType === 'ticket' || Detail.OrderDetailType === 'special') {
					if (TicketID.indexOf(Detail.OrderDetailTypeID) === -1) {
						whereTicket.conditions += orTicket + 'TicketID=?';
						orTicket = ' OR ';
						whereTicket.values.push(Detail.OrderDetailTypeID);
						TicketID.push(Detail.OrderDetailTypeID);
					}
				} else if (Detail.OrderDetailType === 'seat') {
					if (SeatID.indexOf(Detail.OrderDetailTypeID) === -1) {
						whereSeat.conditions += orSeat + 'SeatID=?';
						orSeat = ' OR ';
						whereSeat.values.push(Detail.OrderDetailTypeID);
						SeatID.push(Detail.OrderDetailTypeID);
					}
				}
			});

			if (_.size(TicketID)) {
				whereTicket.conditions += ')';
				promiseSelect.push(DB.promiseSelect('viewOrderTicket', null, whereTicket));
			}

			if (_.size(SeatID)) {
				whereSeat.conditions += ')';
				promiseSelect.push(DB.promiseSelect('viewOrderSeat', null, whereSeat));
			}

			Promise.all(promiseSelect).then(resSelect => {
				_.each(resSelect, rowSelect => {
					_.each(rowSelect, Detail => {
						if (!_.isUndefined(Detail.TicketID)) {
							_.each(Items, Detail => {
								if (Detail.OrderDetailType === 'ticket' || Detail.OrderDetailType === 'special') {
									let Ticket = _.find(rowSelect, {'TicketID': Detail.OrderDetailTypeID});
									if (Ticket) {
										let TicketScanType = Ticket.TicketScanType ? Ticket.TicketScanType : 'single';
										let TicketGrossPrice = Ticket.TicketGrossPrice ? Ticket.TicketGrossPrice : 0;
										let TicketTaxPercent = Ticket.TicketTaxPercent ? Ticket.TicketTaxPercent : 0;
										let OrderDetailGrossDiscount = Detail.OrderDetailGrossDiscount ? Detail.OrderDetailGrossDiscount : 0;
										_.extend(Detail, {
											OrderDetailScanType: TicketScanType,
											OrderDetailName: Ticket.TicketName,
											OrderDetailLabel: Ticket.TicketLable,
											OrderDetailGrossRegular: TicketGrossPrice,
											OrderDetailGrossDiscount: OrderDetailGrossDiscount,
											OrderDetailGrossPrice: TicketGrossPrice - OrderDetailGrossDiscount,
											OrderDetailTaxPercent: TicketTaxPercent ? TicketTaxPercent : 0
										});
										Details.push(Detail);
									}
								}
							});

						} else if (!_.isUndefined(Detail.SeatID)) {
							let Item = _.find(Items, {'OrderDetailTypeID': Detail.SeatID});
							if (Item) {
								let SeatState = Detail.SeatState ? Detail.SeatState : null;
								let SeatGrossPrice = Detail.SeatGrossPrice ? Detail.SeatGrossPrice : 0;
								let SeatTaxPercent = Detail.SeatTaxPercent ? Detail.SeatTaxPercent : 0;
								let OrderDetailGrossDiscount = Item.OrderDetailGrossDiscount ? Item.OrderDetailGrossDiscount : 0;
								_.extend(Item, {
									OrderDetailScanType: 'single',
									OrderDetailName: Detail.SeatName,
									OrderDetailNumber: Detail.SeatNumber,
									OrderDetailLabel: Detail.SeatLabel,
									OrderDetailState: SeatState,
									OrderDetailGrossRegular: SeatGrossPrice,
									OrderDetailGrossDiscount: OrderDetailGrossDiscount,
									OrderDetailGrossPrice: SeatGrossPrice - OrderDetailGrossDiscount,
									OrderDetailTaxPercent: SeatTaxPercent ? SeatTaxPercent : 0
								});
								if (Detail.SeatOrderID === null && Detail.SeatReservationID === null && Detail.SeatState === null) {
									Details.push(Item);
								} else { // ERROR: Seat already in order or reservation or wrong state!

								}
							}
						}
					});
				});

				let Ticket = _.filter(Details, {OrderDetailType: 'ticket'});
				let Special = _.filter(Details, {OrderDetailType: 'special'});
				let Seat = _.filter(Details, {OrderDetailType: 'seat'});
				let HandlingFee = _.filter(Details, {OrderDetailType: 'handlingfee'});
				let ShippingCost = _.filter(Details, {OrderDetailType: 'shippingcost'});

				let res = [];
				if (!_.isUndefined(Ticket) || !_.isUndefined(Special) || !_.isUndefined(Seat)) {
					let sortOrder = 1;
					_.each([Ticket, Special, Seat, HandlingFee, ShippingCost], Items => {
						if (!_.isUndefined(Items) && _.isArray(Items)) {
							_.sortBy(Items, ['OrderDetailName', 'OrderDetailLabel']);
							_.each(Items, Item => {
								let GrossPrice = (Item.OrderDetailGrossPrice >= 0) ? Item.OrderDetailGrossPrice : 0;
								let TaxPercent = Item.OrderDetailTaxPercent;
								let TaxPrice = Math.ceil(((GrossPrice / (100 + TaxPercent)) * TaxPercent) * 100) / 100;
								let NetPrice = GrossPrice - TaxPrice;
								res.push({
									OrderDetailScanCode: EventPrefix + randtoken.generate(15 - EventPrefix.length),
									OrderDetailScanType: Item.OrderDetailScanType,
									OrderDetailOrderID: OrderID,
									OrderDetailType: Item.OrderDetailType,
									OrderDetailTypeID: Item.OrderDetailTypeID,
									OrderDetailState: 'sold',
									OrderDetailSortOrder: sortOrder,
									OrderDetailText: null,
									OrderDetailGrossRegular: Item.OrderDetailGrossRegular,
									OrderDetailGrossDiscount: Item.OrderDetailGrossDiscount,
									OrderDetailGrossPrice: GrossPrice,
									OrderDetailTaxPercent: TaxPercent,
									OrderDetailTaxPrice: TaxPrice,
									OrderDetailNetPrice: NetPrice
								});
								sortOrder++;
							});
						}
					});
				}

				resolve(res);
			}).catch(err => {
				reject(err);
			});
		});
	}

	/**
	 * special offer
	 * @param SpecialOfferID
	 * @returns {Promise<any>}
	 * @private
	 */
	_fetchSpecialOffer(SpecialOfferID) {
		return new Promise((resolve, reject) => {
			if (SpecialOfferID) {
				DB.promiseSelect('innoSpecialOffer', null, {'SpecialOfferID': SpecialOfferID}).then((res) => {

					return DB.promiseSelect('innoSpecialOfferDetail', null, {'SpecialOfferDetailSpecialOfferID': SpecialOfferID});
				}).then(res => {

				});
			} else {
				resolve();
			}
		});
	}

	/**
	 * special offer with user code
	 * @param SpecialOfferUserCode
	 * @returns {Promise<any>}
	 * @private
	 */
	_fetchSpecialOfferUser(SpecialOfferUserCode) {
		return new Promise((resolve, reject) => {
			resolve();
		});
	}

	/**
	 * create order number
	 * @param EventOrderNumberBy
	 * @param EventID
	 * @param EventPromoterID
	 * @returns {Promise<any>}
	 * @private
	 */
	_fetchOrderNumber(Event) {
		// Event.EventOrderNumberBy, Event.EventID, Event.EventPromoterID
		return new Promise((resolve, reject) => {
			resolve();
		});
	}

}

module.exports = Order;
