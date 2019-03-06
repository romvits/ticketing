USE ticketing_db;

DROP VIEW IF EXISTS `viewOrderDetail`;
DROP TABLE IF EXISTS `innoOrderDetail`;
DROP TABLE IF EXISTS `innoOrder`;
DROP TABLE IF EXISTS `innoOrderTax`;

CREATE TABLE `innoOrder` (
  `OrderID` varchar(32) NOT NULL COMMENT 'unique id of the order',
  `OrderNumber` int(6) UNSIGNED ZEROFILL NULL COMMENT 'consecutive number of the order (why 6 digits and not less => it could be a stadium with more than 100.000 visitors and orders)',
  `OrderNumberText` varchar(14) NULL COMMENT '7 character prefix delimiter (-) and consecutive number of the order (example: ZBB2020-123456)',

  `OrderEventID` varchar(32) NOT NULL COMMENT 'unique id of the event that order belongs to',
  `OrderEventPrefix` varchar(7) NULL COMMENT 'prefix of the event when the order was created',

  `OrderType` enum('or','re','cr') NOT NULL DEFAULT 'or' COMMENT 'type of order => or=order (Rechnung) | re=reservation (Reservierung) | cr=credit (Gutschrift)',
  `OrderPayment` enum('ca','mp','pa','tr') NOT NULL DEFAULT 'ca' COMMENT 'payment method => ca=cash | mp=mpay | pa=paypal | tr=transfer',
  `OrderState` enum('op','in','bt','pa') NOT NULL DEFAULT 'in' COMMENT 'state of order => op=open | in=initialized | bt=bank transfer | pa=payed',

  `OrderFrom` enum('ex','in') NOT NULL DEFAULT 'ex' COMMENT 'from of order => ex=external (online page) | in=internal (admin page)',
  `OrderFromUserID` varchar(32) NULL COMMENT 'unique id of the user the order was created (only if OrderFrom = in)',

  `OrderUserID` varchar(32) NULL COMMENT 'unique id of the user that order belongs to',
  `OrderUserAddress1` varchar(150) NULL COMMENT '1 line of oder address field',
  `OrderUserAddress2` varchar(150) NULL COMMENT '2 line of oder address field',
  `OrderUserAddress3` varchar(150) NULL COMMENT '3 line of oder address field',
  `OrderUserAddress4` varchar(150) NULL COMMENT '4 line of oder address field',
  `OrderUserAddress5` varchar(150) NULL COMMENT '5 line of oder address field',
  `OrderUserEmail` varchar(250) NULL COMMENT 'actual email address of user => is used to send mail to customer',
  `OrderUserPhone` varchar(20) NULL COMMENT 'actual phone number of user',

  `OrderGrossPrice` decimal(10,2) NULL DEFAULT 0.00 COMMENT 'price gross => brutto',
  `OrderNetPrice` decimal(10,2) NULL DEFAULT 0.00 COMMENT 'price net => netto',
  PRIMARY KEY (`OrderID`),
  KEY `event` (`OrderEventID`),
  KEY `user` (`OrderUserID`)
) ENGINE=InnoDB DEFAULT CHARSET=UTF8MB4;

CREATE TABLE `innoOrderTax` (
  `OrderTaxOrderID` varchar(32) NOT NULL COMMENT 'unique id of the order that order tax belongs to',
  `OrderTaxPercent` decimal(10,2) NOT NULL DEFAULT 0.00 COMMENT 'tax in percent',
  `OrderTaxAmount` decimal(10,2) NOT NULL DEFAULT 0.00 COMMENT 'tax amount',
  PRIMARY KEY (`OrderTaxOrderID`,`OrderTaxPercent`)
) ENGINE=InnoDB DEFAULT CHARSET=UTF8MB4;

CREATE TABLE `innoOrderDetail` (
  `OrderDetailScancode` varchar(15) NOT NULL COMMENT 'unique scancode of the order detail => 7 chars event prefix, EAN (1 digit rand, 6 digits number, 1 check digit)',
  `OrderDetailOrderID` varchar(32) NOT NULL COMMENT 'unique id of the order that order detail belongs to',
  `OrderDetailTypeID` varchar(32) NULL COMMENT 'id of the record from table => ticket | seat | special | extra',
  `OrderDetailType` enum('ti','se','sp','sc','hf') NOT NULL COMMENT 'type of order detail => ti=entry ticket | se=seat at location | sp=upselling like Tortengarantie | sc=shipping costs | hf=handling fee',
  `OrderDetailEANRand` tinyint(1) ZEROFILL NOT NULL DEFAULT 0 COMMENT 'EAN8 code first digit random',
  `OrderDetailNumber` int(6) ZEROFILL NOT NULL DEFAULT 0 COMMENT 'ean 6 digits => continuous numerating depanding on event prefix',
  `OrderDetailEANCheckDigit` tinyint(1) ZEROFILL NOT NULL DEFAULT 0 COMMENT 'check digit for the EAN8 code',
  `OrderDetailText` varchar(150) NULL COMMENT 'text of the line in the bill',
  `OrderDetailGrossRegular` decimal(10,2) NOT NULL DEFAULT 0.00 COMMENT 'regular gross => brutto regular price',
  `OrderDetailGrossDiscount` decimal(10,2) NOT NULL DEFAULT 0.00 COMMENT 'amount gross discount => brutto discount gross',
  `OrderDetailGrossPrice` decimal(10,2) NOT NULL DEFAULT 0.00 COMMENT 'price gross => brutto subtract amount discount gross',
  `OrderDetailTaxPercent` decimal(10,2) NOT NULL DEFAULT 0.00 COMMENT 'tax in percent',
  `OrderDetailTax` decimal(10,2) NOT NULL DEFAULT 0.00 COMMENT 'tax amount => calculated from OrderDetailPriceGross',
  `OrderDetailNetPrice` decimal(10,2) NOT NULL DEFAULT 0.00 COMMENT 'price net => netto',
  PRIMARY KEY (`OrderDetailScancode`, `OrderDetailOrderID`)
) ENGINE=InnoDB DEFAULT CHARSET=UTF8MB4;

CREATE
    ALGORITHM = UNDEFINED
    DEFINER = `root`@`localhost`
    SQL SECURITY DEFINER
VIEW `viewOrderDetail` AS
SELECT
	`innoOrder`.`OrderID`,
	`innoOrder`.`OrderEventID` AS `EventID`,
	`innoOrder`.`OrderUserID` AS `UserID`,
	`innoOrderDetail`.`OrderDetailTypeID` AS `TypeID`,
	`innoOrderDetail`.`OrderDetailType` AS `Type`,
	`innoOrderDetail`.`OrderDetailText` AS `Text`,
	`innoOrderDetail`.`OrderDetailTaxPercent` AS `TaxPercent`,
	`innoOrderDetail`.`OrderDetailTax` AS `Tax`,
	`innoOrderDetail`.`OrderDetailNetPrice` AS `NetPrice`,
	`innoOrderDetail`.`OrderDetailGrossRegular` AS `GrossRegular`,
	`innoOrderDetail`.`OrderDetailGrossDiscount` AS `GrossDiscount`,
	`innoOrderDetail`.`OrderDetailGrossPrice` AS `GrossPrice`
FROM
	(`innoOrder`
	INNER JOIN `innoOrderDetail` ON ((`innoOrder`.`OrderID` = `innoOrderDetail`.`OrderDetailOrderID`)));
