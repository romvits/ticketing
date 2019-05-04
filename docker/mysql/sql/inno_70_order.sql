USE ticketing_db;

SET FOREIGN_KEY_CHECKS = 0;

DROP VIEW IF EXISTS `viewOrderDetail`;
DROP TABLE IF EXISTS `innoOrderDetail`;
DROP TABLE IF EXISTS `innoOrderTax`;
DROP TABLE IF EXISTS `innoOrder`;

CREATE TABLE `innoOrder` (
  `OrderID`                                                  varchar(32) NOT NULL COMMENT 'unique id of the order',
  `OrderPromoterID`                                          varchar(32) NOT NULL COMMENT 'unique id of the Promoter that order belongs to',
  `OrderEventID`                                             varchar(32) NOT NULL COMMENT 'id of the event that order belongs to',
  `OrderSpecialOfferID`                                      varchar(32) NULL COMMENT 'id of special offer if there is a related special offer for this event and it was selected during the ONLINE order process => is available on the page',
  `OrderNumber`                                              int(6) UNSIGNED ZEROFILL NULL COMMENT 'consecutive number of the order (why 6 digits and not less => it could be a stadium with more than 100.000 visitors and orders)',
  `OrderNumberText`                                          varchar(12) NULL COMMENT '5 character prefix delimiter (-) and consecutive number of the order (example: ZBB20-123456)',
  `OrderTID`                                                 varchar(11) NULL COMMENT 'transaction id 5 character prefix and 6 random characters (eg. for mpay)',
  `OrderType`                                                enum('order','credit') NOT NULL DEFAULT 'order' COMMENT 'type of order => or=order (Rechnung) | cr=credit (Gutschrift)',
  `OrderState`                                               enum('open','payed','refunded') NOT NULL DEFAULT 'open' COMMENT 'state of order => op=open | pa=payed | re=refunded (a credit is refunded)',
  `OrderPayment`                                             enum('cash','mpay','paypal','transfer') NOT NULL DEFAULT 'cash' COMMENT 'payment method => ca=cash | mp=mpay | pa=paypal | tr=transfer',
  `OrderCreditID`                                            varchar(32) NULL COMMENT 'id of order to which this credit belongs to',
  `OrderDateTimeUTC`                                         datetime NOT NULL COMMENT 'order date time',
  `OrderPayedDateTimeUTC`                                    datetime NULL COMMENT 'order date time payed',
  `OrderFrom`                                                enum('extern','intern') NOT NULL DEFAULT 'extern' COMMENT 'from of order => ex=external (online page) | in=internal (admin page)',
  `OrderFromUserID`                                          varchar(32) NULL COMMENT 'unique id of the user the order was created (only if OrderFrom = in)',
  `OrderUserID`                                              varchar(32) NOT NULL COMMENT 'unique id of the user that order belongs to => if null a new user will be created',
  `OrderUserLangCode`                                        varchar(5) NOT NULL DEFAULT 'de-at' COMMENT 'actual lang code',
  `OrderUserCompany`                                         varchar(150) NULL COMMENT 'company',
  `OrderUserCompanyUID`                                      varchar(30) NULL COMMENT 'company UID',
  `OrderUserGender`                                          enum('m','f') NULL COMMENT 'gender m=male | f=female',
  `OrderUserTitle`                                           varchar(50) NULL COMMENT 'academical title',
  `OrderUserFirstname`                                       varchar(50) NULL COMMENT 'first name',
  `OrderUserLastname`                                        varchar(50) NULL COMMENT 'last name',
  `OrderUserStreet`                                          varchar(120) NULL COMMENT 'street',
  `OrderUserCity`                                            varchar(100) NULL COMMENT 'city',
  `OrderUserZIP`                                             varchar(20) NULL COMMENT 'zip',
  `OrderUserCountryCountryISO2`                              varchar(2) NULL COMMENT 'country',
  `OrderUserEmail`                                           varchar(250) NULL COMMENT 'actual email address of user => is used to send mail to customer',
  `OrderUserPhone1`                                          varchar(30) NULL COMMENT 'actual phone number of user',
  `OrderUserPhone2`                                          varchar(30) NULL COMMENT 'actual phone number of user',
  `OrderUserFax`                                             varchar(30) NULL COMMENT 'actual fax number of user',
  `OrderUserHomepage`                                        varchar(250) NULL COMMENT 'actual homepage of user',
  `OrderGrossRegular`                                        decimal(8,2) NOT NULL DEFAULT 0.00 COMMENT 'regular gross => brutto regular price',
  `OrderGrossDiscount`                                       decimal(8,2) NOT NULL DEFAULT 0.00 COMMENT 'amount gross discount => brutto discount gross',
  `OrderGrossPrice`                                          decimal(8,2) NOT NULL DEFAULT 0.00 COMMENT 'price gross => brutto',
  `OrderNetPrice`                                            decimal(8,2) NOT NULL DEFAULT 0.00 COMMENT 'price net => netto',
  `OrderComment`                                             longtext COMMENT 'comment fot this order',
  FOREIGN KEY Order_EventID (`OrderEventID`)                 REFERENCES innoEvent(`EventID`),
  FOREIGN KEY Order_CreditID (`OrderCreditID`)               REFERENCES innoOrder(`OrderID`),
  FOREIGN KEY Order_FromUserID (`OrderFromUserID`)           REFERENCES innoUser(`UserID`),
  FOREIGN KEY Order_UserID (`OrderUserID`)                   REFERENCES innoUser(`UserID`),
  FOREIGN KEY Order_Country (`OrderUserCountryCountryISO2`)  REFERENCES feCountry(`CountryISO2`),
  PRIMARY KEY (`OrderID`)  
) ENGINE=InnoDB DEFAULT CHARSET=UTF8MB4;

CREATE TABLE `innoOrderTax` (
  `OrderTaxOrderID`                                          varchar(32) NOT NULL COMMENT 'unique id of the order that order tax belongs to',
  `OrderTaxPercent`                                          decimal(5,2) NOT NULL DEFAULT 0.00 COMMENT 'tax in percent',
  `OrderTaxAmount`                                           decimal(8,2) NOT NULL DEFAULT 0.00 COMMENT 'tax amount',
  FOREIGN KEY OrderTax_OrderID (`OrderTaxOrderID`)           REFERENCES innoOrder(`OrderID`),
  PRIMARY KEY (`OrderTaxOrderID`,`OrderTaxPercent`)
) ENGINE=InnoDB DEFAULT CHARSET=UTF8MB4;

CREATE TABLE `innoOrderDetail` (
  `OrderDetailScanCode`                                      varchar(13) NOT NULL COMMENT 'unique scancode of the order detail => 5 chars event prefix, EAN (1 digit rand from 1-9 => 0 is reserved for preprint!, 6 digits number, 1 check digit)',
  `OrderDetailScanNumber`                                    int (6) UNSIGNED ZEROFILL NOT NULL DEFAULT 000000 COMMENT 'consecutive number for the event',
  `OrderDetailScanType`                                      enum('noscan','single','multi','inout','test') NOT NULL DEFAULT 'single' COMMENT 'noscan = handlingfee and shipping cost',
  `OrderDetailEventID`                                       varchar(32) NOT NULL COMMENT 'unique id of the event that order detail belongs to',
  `OrderDetailOrderID`                                       varchar(32) NOT NULL COMMENT 'unique id of the order that order detail belongs to',
  `OrderDetailType`                                          enum('ticket','seat','special','shippingcost','handlingfee') NOT NULL COMMENT 'type of order detail => ti=entry ticket | se=seat at location | sp=special = >upselling like Tortengarantie | sc=shipping cost | hf=handling fee',
  `OrderDetailTypeID`                                        varchar(32) NULL COMMENT 'id of the record from table => ticket (ti) | seat (se) | special (sp) | if null its extra (shippincost or handlingfee comes from table innnoEvent)',
  `OrderDetailState`                                         enum('sold','canceled') NOT NULL COMMENT 'state of order detail => so=sold | ca=canceled',
  `OrderDetailSortOrder`                                     tinyint(2) UNSIGNED NOT NULL DEFAULT 0 COMMENT 'sort order for the bill',
  `OrderDetailText`                                          varchar(150) NULL COMMENT 'text of the line in the bill',
  `OrderDetailGrossRegular`                                  decimal(8,2) NOT NULL DEFAULT 0.00 COMMENT 'regular gross => brutto regular price',
  `OrderDetailGrossDiscount`                                 decimal(8,2) NOT NULL DEFAULT 0.00 COMMENT 'amount gross discount => brutto discount gross',
  `OrderDetailTaxPercent`                                    decimal(5,2) NOT NULL DEFAULT 0.00 COMMENT 'tax in percent',
  `OrderDetailNetPrice`                                      decimal(8,2) NOT NULL DEFAULT 0.00 COMMENT 'price net => netto price for this detail item',
  `OrderDetailTaxPrice`                                      decimal(8,2) NOT NULL DEFAULT 0.00 COMMENT 'tax price',
  `OrderDetailGrossPrice`                                    decimal(8,2) NOT NULL DEFAULT 0.00 COMMENT 'price gross => brutto subtract amount discount gross',
  FOREIGN KEY OrderDetail_OrderID (`OrderDetailOrderID`)     REFERENCES innoOrder(`OrderID`),
  PRIMARY KEY (`OrderDetailScancode`, `OrderDetailOrderID`)
) ENGINE=InnoDB DEFAULT CHARSET=UTF8MB4;

SET FOREIGN_KEY_CHECKS = 1;
