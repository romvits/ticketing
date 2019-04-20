import Module from './../module';
import _ from 'lodash';
import User from './../user/user';

/**
 * floor module
 */
class Order extends Module {

	/**
	 * constructor for order
	 * @param ConnID {String} 32 character string of connection ID
	 * @param ConnUserID {String} 32 character string of user ID
	 */
	constructor(ConnID = null, ConnUserID = null) {
		super(ConnID, ConnUserID);
		this.pk = 'OrderID';
		this.table = 'innoOrder';
		this.view = 'viewOrder';
		this.fields = {
			'OrderID': {'type': 'string', 'length': 32, 'empty': false}, // varchar(32) NOT NULL COMMENT 'unique id of the order',
			'OrderNumber': {'type': 'integer', 'length': 6, 'empty': false}, // int(6) UNSIGNED ZEROFILL NULL COMMENT 'consecutive number of the order (why 6 digits and not less => it could be a stadium with more than 100.000 visitors and orders)',
			'OrderNumberText': {'type': 'string', 'length': 14, 'empty': false}, // varchar(14) NULL COMMENT '7 character prefix delimiter (-) and consecutive number of the order (example: ZBB2020-123456)',
			'OrderEventID': {'type': 'string', 'length': 32, 'empty': false}, // varchar(32) NOT NULL COMMENT 'id of the event that order belongs to',
			'OrderType': {'type': 'enum', 'empty': false}, // enum('order','credit') NOT NULL DEFAULT 'order' COMMENT 'type of order => or=order (Rechnung) | cr=credit (Gutschrift)',
			'OrderState': {'type': 'enum', 'empty': false}, // enum('open','payed') NOT NULL DEFAULT 'open' COMMENT 'state of order => op=open | pa=payed',
			'OrderPayment': {'type': 'enum', 'empty': false}, // enum('cash','mpay','paypal','transfer') NOT NULL DEFAULT 'cash' COMMENT 'payment method => ca=cash | mp=mpay | pa=paypal | tr=transfer',
			'OrderCreditID': {'type': 'string', 'length': 32, 'empty': false}, // varchar(32) NULL COMMENT 'id of order to which this credit belongs to',
			'OrderDateTimeUTC': {'type': 'datetime', 'empty': false}, // datetime NOT NULL COMMENT 'order date time',
			'OrderPayedDateTimeUTC': {'type': 'datetime', 'empty': true}, // datetime NOT NULL COMMENT 'order date time payed',
			'OrderFrom': {'type': 'string', 'length': 32, 'empty': false}, // enum('extern','intern') NOT NULL DEFAULT 'extern' COMMENT 'from of order => ex=external (online page) | in=internal (admin page)',
			'OrderFromUserID': {'type': 'string', 'length': 32, 'empty': false}, // varchar(32) NULL COMMENT 'unique id of the user the order was created (only if OrderFrom = in)',
			'OrderUserID': {'type': 'string', 'length': 32, 'empty': false}, // varchar(32) NULL COMMENT 'unique id of the user that order belongs to',
			'OrderCompany': {'type': 'string', 'length': 150, 'empty': false}, // varchar(150) NULL COMMENT 'company',
			'OrderCompanyUID': {'type': 'string', 'length': 30, 'empty': false}, // varchar(30) NULL COMMENT 'company UID',
			'OrderGender': {'type': 'enum', 'empty': false}, // enum('m','f') NULL COMMENT 'gender m=male | f=female',
			'OrderTitle': {'type': 'string', 'length': 50, 'empty': true}, // varchar(50) NULL COMMENT 'academical title',
			'OrderFirstname': {'type': 'string', 'length': 50, 'empty': false}, // varchar(50) NULL COMMENT 'first name',
			'OrderLastname': {'type': 'string', 'length': 50, 'empty': false}, // varchar(50) NULL COMMENT 'last name',
			'OrderStreet': {'type': 'string', 'length': 120, 'empty': false}, // varchar(120) NULL COMMENT 'street',
			'OrderCity': {'type': 'string', 'length': 100, 'empty': false}, // varchar(100) NULL COMMENT 'city',
			'OrderZIP': {'type': 'string', 'length': 20, 'empty': false}, // varchar(20) NULL COMMENT 'zip',
			'OrderCountryCountryISO2': {'type': 'enum', 'table': 'feCountry', 'pk': 'CountryISO2', 'empty': true}, // varchar(2) NULL COMMENT 'country',
			'OrderUserEmail': {'type': 'string', 'length': 250, 'empty': false}, // varchar(250) NULL COMMENT 'actual email address of user => is used to send mail to customer',
			'OrderUserPhone1': {'type': 'string', 'length': 30, 'empty': false}, // varchar(30) NULL COMMENT 'actual phone number of user',
			'OrderUserPhone2': {'type': 'string', 'length': 30, 'empty': false}, // varchar(30) NULL COMMENT 'actual phone number of user',
			'OrderUserFax': {'type': 'string', 'length': 30, 'empty': false}, // varchar(30) NULL COMMENT 'actual phone number of user',
			'OrderUserHomepage': {'type': 'string', 'length': 250, 'empty': false}, // varchar(250) NULL COMMENT 'actual phone number of user',
			'OrderGrossPrice': {'type': 'decimal', 'length': '6,2', 'empty': false}, // decimal(8,2) NULL DEFAULT 0.00 COMMENT 'price gross => brutto',
			'OrderNetPrice': {'type': 'decimal', 'length': '3,2', 'empty': false}, // decimal(8,2) NULL DEFAULT 0.00 COMMENT 'price net => netto',
		}
	}

	/**
	 * create order
	 * @param values
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

			db.promiseSelect('viewOrderEvent', null, {'EventID': Order.OrderEventID}).then((resEvent) => {
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
				console.log(resOrderDetail);
				OrderDetail = resOrderDetail;
				return this._createOrderDetail(OrderDetail, SpecialOffer);
			}).then((res) => {
				return this._createOrderTax(OrderDetail, Order.OrderID);
			}).then((res) => {
				return this._createOrderNumber(Event);
			}).then((OrderNumber) => {
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

				delete Order.OrderSpecialOfferUserCode;
				delete Order.OrderHandlingFeeGrossDiscount;
				delete Order.OrderShippingCostGrossDiscount;
				delete Order.OrderDetail;
				Order.OrderPromoterID = Event.EventPromoterID;

				return this._createOrder(this.table, Order);
			}).then(() => {
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
	 * create order detail
	 * @param values
	 * @private
	 */
	_createOrderDetail(values) {
		return new Promise((resolve, reject) => {
			resolve();
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
	 * create order number
	 * @param EventOrderNumberBy
	 * @param EventID
	 * @param EventPromoterID
	 * @returns {Promise<any>}
	 * @private
	 */
	_createOrderNumber(Event) {
		// Event.EventOrderNumberBy, Event.EventID, Event.EventPromoterID
		return new Promise((resolve, reject) => {
			resolve();
		});
	}

	/**
	 * create order
	 * @param values
	 * @private
	 */
	_createOrder(values) {
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
	 * @param values
	 * @returns {Promise<any>}
	 * @private
	 */
	_fetchOrderDetail(Details, Order, Event, internal) {
		return new Promise((resolve, reject) => {

			let OrderID = Order.OrderID;
			let EventID = Event.EventID;

			let OrderType = 'External';
			if (internal) {
				OrderType = 'Internal';
			}

			let FeeCost = [];

			let HandlingFee = _.find(Details, {'OrderDetailType': 'handlingfee'});
			if (Event['EventHandlingFeeGross' + OrderType] || _.isObject(HandlingFee)) {
				let Detail = {
					OrderDetailType: 'handlingfee',
					OrderDetailName: Event.EventHandlingFeeName ? Event.EventHandlingFeeName : 'Handling Fee',
					OrderDetailLabel: Event.EventHandlingFeeLabel ? Event.EventHandlingFeeLabel : null,
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
					'OrderDetailOrderID': OrderID
				});
				FeeCost.push(Detail);
			}

			if (internal) {
				let ShippingCost = _.find(Details, {'OrderDetailType': 'shippingcost'});
				if (Event.EventShippingCostGross || _.isObject(ShippingCost)) {
					let Detail = {
						OrderDetailType: 'shippingcost',
						OrderDetailName: Event.EventShippingCostName ? Event.EventShippingCostName : 'Handling Fee',
						OrderDetailLabel: Event.EventShippingCostLabel ? Event.EventShippingCostLabel : null,
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
						'OrderDetailOrderID': OrderID
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
							'OrderDetailOrderID': OrderID
						});
						Items.push(Detail);
					}
				} else {
					_.extend(Detail, {
						'OrderDetailID': this.generateUUID(),
						'OrderDetailOrderID': OrderID
					});
					Items.push(Detail);
				}
			});

			Details = FeeCost;
			let promiseAllFetchDetailSeat = [];
			let TicketID = [];
			let whereTicket = {'conditions': 'TicketEventID=? AND (', 'values': [EventID]};
			let or = '';
			_.each(Items, Detail => {
				delete Detail.Amount;
				if (TicketID.indexOf(Detail.OrderDetailTypeID) === -1) {
					if (Detail.OrderDetailType === 'ticket' || Detail.OrderDetailType === 'special') {
						whereTicket.conditions += or + 'TicketID=?';
						or = ' OR ';
						whereTicket.values.push(Detail.OrderDetailTypeID);
						TicketID.push(Detail.OrderDetailTypeID);
					} else if (Detail.OrderDetailType === 'seat') {
						promiseAllFetchDetailSeat.push(db.promiseSelect('viewOrderSeat', null, {'SeatID': Detail.OrderDetailTypeID, 'SeatEventID': EventID}));
					}
				}
			});

			return Promise.all(promiseAllFetchDetailSeat).then(resPromises => {
				_.each(resPromises, resSelect => {
					let Seat = resSelect[0];
					if (Seat) {
						let Detail = _.find(Items, {'OrderDetailTypeID': Seat.SeatID});
						if (Detail) {
							let SeatState = Seat.SeatState ? Seat.SeatState : null;
							let SeatGrossPrice = Seat.SeatGrossPrice ? Seat.SeatGrossPrice : 0;
							let SeatTaxPercent = Seat.SeatTaxPercent ? Seat.SeatTaxPercent : 0;
							let OrderDetailGrossDiscount = Detail.OrderDetailGrossDiscount ? Detail.OrderDetailGrossDiscount : 0;
							_.extend(Detail, {
								OrderDetailScanType: 'single',
								OrderDetailName: Seat.SeatName,
								OrderDetailNumber: Seat.SeatNumber,
								OrderDetailLabel: Seat.SeatLabel,
								OrderDetailState: SeatState,
								OrderDetailGrossRegular: SeatGrossPrice,
								OrderDetailGrossDiscount: OrderDetailGrossDiscount,
								OrderDetailGrossPrice: SeatGrossPrice - OrderDetailGrossDiscount,
								OrderDetailTaxPercent: SeatTaxPercent ? SeatTaxPercent : 0
							});
							if (Seat.SeatOrderID === null && Seat.SeatReservationID === null && Seat.SeatState === null) {
								Details.push(Detail);
							} else { // ERROR: Seat already in order or reservation or wrong state!

							}
						}
					}
				});
				if (_.size(TicketID)) {
					whereTicket.conditions += ')';
					return db.promiseSelect('viewOrderTicket', null, whereTicket);
				} else {
					return
				}
			}).then(resSelect => {
				_.each(Items, Detail => {
					if (Detail.OrderDetailType === 'ticket' || Detail.OrderDetailType === 'special') {
						let Ticket = _.find(resSelect, {'TicketID': Detail.OrderDetailTypeID});
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

				let Ticket = _.filter(Details, {OrderDetailType: 'ticket'});
				let Special = _.filter(Details, {OrderDetailType: 'special'});
				let Seat = _.filter(Details, {OrderDetailType: 'seat'});
				let HandlingFee = _.filter(Details, {OrderDetailType: 'handlingfee'});
				let ShippingCost = _.filter(Details, {OrderDetailType: 'shippingcost'});

				let res = [];
				let sortOrder = 1;
				_.each([Ticket, Special, Seat, HandlingFee, ShippingCost], Items => {
					if (!_.isUndefined(Items) && _.isArray(Items)) {
						_.sortBy(Items, ['OrderDetailName', 'OrderDetailLabel']);
						_.each(Items, Item => {
							Item.OrderSortOrder = sortOrder;
							res.push(Item);
							sortOrder++;
						});
					}
				});
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
				db.promiseSelect('innoSpecialOffer', null, {'SpecialOfferID': SpecialOfferID}).then((res) => {

					return db.promiseSelect('innoSpecialOfferDetail', null, {'SpecialOfferDetailSpecialOfferID': SpecialOfferID});
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

}

module.exports = Order;
