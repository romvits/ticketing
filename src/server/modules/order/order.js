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
	create(values) {
		return new Promise((resolve, reject) => {

			let OrderFrom = values.OrderFrom;
			let OrderFromUserID = values.OrderFromUserID;
			let OrderUserID = values.OrderUserID;

			if ((OrderFrom === 'intern' && OrderFromUserID) || (OrderFrom === 'extern' && OrderUserID)) {

				_.extend(values, {'OrderID': this.generateUUID()});

				let result = {};

				let Event = null;
				let User = null;
				let UserFrom = null;
				let OrderDetail = [];
				let SpecialOffer = [];
				let OrderTax = [];

				values.OrderDateTimeUTC = this.getDateTime();

				db.promiseSelect('viewOrderEvent', null, {'EventID': values.OrderEventID}).then((resEvent) => {
					Event = resEvent;
					return this._fetchUser(values.OrderUserID);
				}).then(resUser => {
					User = resUser;
					return this._fetchUser(values.OrderFromUserID);
				}).then(resUserFrom => {
					UserFrom = resUserFrom;
					return this._fetchSpecialOffer(values.OrderSpecialOfferID, values.OrderID);
				}).then((resSpecialOffer) => {
					if (resSpecialOffer) {
						SpecialOffer = resSpecialOffer;
					}
					return this._fetchSpecialOfferUser(values.SpecialOfferUserCode, values.OrderID);
				}).then((resSpecialOffer) => {
					if (resSpecialOffer) {
						SpecialOffer = resSpecialOffer;
					}
					return this._fetchOrderDetail(values.OrderDetail, values.OrderID, values.OrderEventID);
				}).then((resOrderDetail) => {
					OrderDetail = resOrderDetail;
					return this._createOrderDetail(OrderDetail, SpecialOffer);
				}).then((res) => {
					return this._createOrderTax(OrderDetail, values.OrderID);
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

					delete values.OrderSpecialOfferUserCode;
					delete values.OrderHandlingFeeGrossDiscount;
					delete values.OrderShippingCostGrossDiscount;
					delete values.OrderDetail;
					values.OrderPromoterID = Event.EventPromoterID;

					return this._createOrder(this.table, values);
				}).then(() => {
					return this._createPDF(values.OrderID);
				}).then((res) => {
					resolve(result);
				});
			} else {
				reject('TODO: PROBLEM ERROR MSG');
			}
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
					resolve(res);
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
	_fetchOrderDetail(Detail, OrderID, EventID) {
		return new Promise((resolve, reject) => {

			let Items = [];
			_.each(Detail, Item => {
				if (Item.OrderDetailType == 'ticket' || Item.OrderDetailType == 'special') {
					Item.Amount = (Item.Amount) ? Item.Amount : 1;
					for (var i = 0; i < Item.Amount; i++) {
						Items.push(Item);
					}
				} else {
					Items.push(Item);
				}
			});

			let promiseAllFetchDetailSeat = [];
			let TicketID = [];
			let whereTicket = {'conditions': '', 'values': []};
			let or = '';
			_.each(Items, Item => {
				_.extend(Item, {
					'OrderDetailID': this.generateUUID(),
					'OrderDetailOrderID': OrderID
				});
				delete Item.Amount;
				if (TicketID.indexOf(Item.OrderDetailTypeID) === -1) {
					if (Item.OrderDetailType === 'ticket' || Item.OrderDetailType === 'special') {
						whereTicket.conditions += or + 'TicketID=?';
						or = ' OR ';
						whereTicket.values.push(Item.OrderDetailTypeID);
						TicketID.push(Item.OrderDetailTypeID);
					} else if (Item.OrderDetailType === 'seat') {
						promiseAllFetchDetailSeat.push(db.promiseSelect('viewOrderSeat', null, {'SeatID': Item.OrderDetailTypeID, 'SeatEventID': EventID}));
					}
				}
			});

			console.log(Items);

			resolve();
			/*
			let resOrderDetail = [];
			console.log(resOrderDetail);

			_.each(resOrderDetail, OrderDetail => {
			});

			return Promise.all(promiseAllFetchDetailSeat).then(resDetailSeat => {
				_.each(resDetailSeat, rowDetailSeat => {
					let Seat = rowDetailSeat[0];
					let Detail = _.find(resOrderDetail, {'OrderDetailTypeID': Seat.SeatID});
					if (Detail) {
						let SeatState = Seat.SeatState ? Seat.SeatState : null;
						let SeatGrossPrice = Seat.SeatGrossPrice ? Seat.SeatGrossPrice : 0;
						let SeatTaxPercent = Seat.SeatTaxPercent ? Seat.SeatTaxPercent : 0;
						let OrderDetailGrossDiscount = Seat.OrderDetailGrossDiscount ? Seat.OrderDetailGrossDiscount : 0;
						_.extend(Detail, {
							OrderDetailScanType: 'single',
							OrderDetailOrderID: OrderID,
							OrderDetailState: SeatState,
							OrderDetailGrossRegular: SeatGrossPrice,
							OrderDetailGrossDiscount: OrderDetailGrossDiscount,
							OrderDetailGrossPrice: SeatGrossPrice - OrderDetailGrossDiscount,
							OrderDetailTaxPercent: SeatTaxPercent ? SeatTaxPercent : 0
						});
					}
					//console.log(Detail);
				});
				if (_.size(TicketID)) {
					return db.promiseSelect('viewOrderTicket', null, whereTicket);
				} else {
					return
				}
			}).then(resDetailTicket => {
				_.each(OrderDetail, Detail => {
					if (Detail.OrderDetailType == 'ticket' || Detail.OrderDetailType == 'special') {
						console.log(Detail);
					}
				});
				_.each(resDetailTicket, rowDetailTicket => {
					console.log(rowDetailTicket);
				});
				resolve();
			}).catch(err => {
				reject(err);
			});
			*/
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
	 */
	storno() {
		return new Promise((resolve, reject) => {
			resolve();
		});
	}
}

module.exports = Order;
