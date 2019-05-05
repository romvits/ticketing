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

			Order.OrderDateTimeUTC = this.getDateTime();

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
	 * delete for order is not allowed, only storno for items of order is available
	 */
	delete() {
		return new Promise((resolve, reject) => {
			resolve();
		});
	}

	/**
	 *
	 * @param OrderID {String} id of order which will be effected by this cancel
	 * @param ItemIDs {Array} array of item ids which will be effected for this cancel
	 * @returns {Promise<any>}
	 */
	cancel(OrderID, ItemIDs) {
		return new Promise((resolve, reject) => {
			resolve();
		});
	}

	/**
	 * calculate taxes, gross and net, sum of order
	 * @param Items {Array} array of order items
	 */
	calculate(Items) {

		let Order = {
			OrderGrossRegular: 0,
			OrderGrossDiscount: 0,
			OrderGrossPrice: 0,
			OrderTaxPrice: 0,
			OrderNetPrice: 0,
			OrderTax: {},
			OrderDetail: []
		};

		_.each(Items, (Item, Index) => {

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

			if (Item.OrderDetailType === 'seat') {
				Item.OrderDetailSortOrder = 800;
			}

			Order.OrderDetail.push(Item);

			if (Item.OrderDetailTaxPercent && _.isUndefined(Order.OrderTax[Item.OrderDetailTaxPercent])) {
				Order.OrderTax[Item.OrderDetailTaxPercent] = Item.OrderDetailTaxPrice * 100;
			} else if (Item.OrderDetailTaxPercent) {
				Order.OrderTax[Item.OrderDetailTaxPercent] += Item.OrderDetailTaxPrice * 100;
			}
			Order.OrderGrossRegular += Item.OrderDetailGrossRegular * 100;
			Order.OrderGrossDiscount += Item.OrderDetailGrossDiscount * 100;
			Order.OrderGrossPrice += Item.OrderDetailGrossPrice * 100;
			Order.OrderTaxPrice += Item.OrderDetailTaxPrice * 100;
			Order.OrderNetPrice += Item.OrderDetailNetPrice * 100;

		});

		Order.OrderDetail = _.sortBy(Order.OrderDetail, ['OrderDetailSortOrder', 'OrderDetailText']);

		_.each(Order.OrderTax, (OrderTaxPrice, OrderTaxPercent) => {
			Order.OrderTax[OrderTaxPercent] = OrderTaxPrice /= 100;
		});

		Order.OrderGrossRegular = Math.round(Order.OrderGrossRegular) / 100;
		Order.OrderGrossDiscount = Math.round(Order.OrderGrossDiscount) / 100;
		Order.OrderGrossPrice = Math.round(Order.OrderGrossPrice) / 100;
		Order.OrderTaxPrice = Math.round(Order.OrderTaxPrice) / 100;
		Order.OrderNetPrice = Math.round(Order.OrderNetPrice) / 100;

		return Order;
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
