USE ticketing_db;

DROP VIEW IF EXISTS `viewOrderDetail`;
DROP TABLE IF EXISTS `innoOrderDetail`;
DROP TABLE IF EXISTS `innoOrder`;
DROP TABLE IF EXISTS `innoOrderTax`;

CREATE TABLE `innoOrder` (
  `OrderID` varchar(32) NOT NULL COMMENT 'unique id of the order',
  `OrderEventID` varchar(32) NOT NULL COMMENT 'unique id of the event that order belongs to',
  `OrderEventPrefix` varchar(3) NOT NULL COMMENT 'prefix of the event when the order was created',
  `OrderEventYear` int(4) NOT NULL COMMENT 'year of the event when the order was created',
  `OrderNumber` int(6) NOT NULL COMMENT 'consecutive number of the order (why 6 digits and not less => it could be a stadium with more than 100.000 visitors and orders)',
  `OrderNumberText` varchar(14) NOT NULL COMMENT '3 character prefix and year 4 digits of the event plus delimiter (-) and consecutive number of the order (example: ZBB2020-123456)',
  `OrderType` enum('or','cr') NOT NULL COMMENT 'type of order => or=order (Rechnung) | cr=credit (Gutschrift)',
  `OrderState` enum('in','bt','pa') NOT NULL COMMENT 'state of order => in=initialized | bt=bank transfer | pa=payed',
  `OrderFrom` enum('ex','in') NOT NULL COMMENT 'from of order => ex=external (online page) | in=internal (admin page)',
  `OrderFromUserID` varchar(32) NULL COMMENT 'unique id of the user the order was created (only if OrderFrom = in)',
  `OrderUserID` varchar(32) NOT NULL COMMENT 'unique id of the user that order belongs to',
  `OrderUserAddress1` varchar(70) NULL COMMENT '1 line of oder address field',
  `OrderUserAddress2` varchar(70) NULL COMMENT '2 line of oder address field',
  `OrderUserAddress3` varchar(70) NULL COMMENT '3 line of oder address field',
  `OrderUserAddress4` varchar(70) NULL COMMENT '4 line of oder address field',
  `OrderUserAddress5` varchar(70) NULL COMMENT '5 line of oder address field',
  `OrderUserEmail` varchar(254) NOT NULL COMMENT 'email address of user where mail was sent',
  `OrderGrossPrice` decimal(10,2) NOT NULL DEFAULT 0.00 COMMENT 'price gross => brutto',
  `OrderNetPrice` decimal(10,2) NOT NULL DEFAULT 0.00 COMMENT 'price net => netto',
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
  `OrderDetailID` varchar(32) NOT NULL COMMENT 'unique id of the order detail',
  `OrderDetailOrderID` varchar(32) NULL COMMENT 'unique id of the order that order detail belongs to',
  `OrderDetailTypeID` varchar(32) NULL COMMENT 'id of the record from table => ticket | seat | special | extra',
  `OrderDetailScancode` varchar(18) NULL COMMENT 'unique scancode of the order detail => 3 event prefix, 4 event year, EAN (2 rand digits, 6 ean code)',
  `OrderDetailType` enum('ticket','seat','special','extra') NOT NULL COMMENT 'type of order detail => ticket=entry ticket | seat=seat at location | specail=upselling like Tortengarantie | extra=additional costs like shipping or handling fee',
  `OrderDetailText` varchar(150) NULL COMMENT 'text of the line in the bill',
  `OrderDetailGrossRegular` decimal(10,2) NOT NULL DEFAULT 0.00 COMMENT 'regular gross => brutto regular price',
  `OrderDetailGrossDiscount` decimal(10,2) NOT NULL DEFAULT 0.00 COMMENT 'amount gross discount => brutto discount gross',
  `OrderDetailGrossPrice` decimal(10,2) NOT NULL DEFAULT 0.00 COMMENT 'price gross => brutto subtract amount discount gross',
  `OrderDetailTaxPercent` decimal(10,2) NOT NULL DEFAULT 0.00 COMMENT 'tax in percent',
  `OrderDetailTax` decimal(10,2) NOT NULL DEFAULT 0.00 COMMENT 'tax amount => calculated from OrderDetailPriceGross',
  `OrderDetailNetPrice` decimal(10,2) NOT NULL DEFAULT 0.00 COMMENT 'price net => netto',
  PRIMARY KEY (`OrderDetailID`),
  FOREIGN KEY (OrderDetailOrderID) references innoOrder (OrderID)
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

INSERT INTO innoOrder (`OrderID`,`OrderEventID`,`OrderUserID`) VALUES
('order1','event1','user1'),
('order2','event1','user2'),
('order3','event2','user1'),
('order4','event3','user2');

INSERT INTO innoOrderDetail (`OrderDetailID`,`OrderDetailOrderID`,`OrderDetailText`) VALUES
('detail01','order1','prod1'),('detail02','order1','prod2'),('detail03','order1','prod3'),('detail04','order1','prod4'),
('detail05','order2','prod1'),('detail06','order2','prod2'),('detail07','order2','prod3'),('detail08','order2','prod4'),('detail09','order2','prod5'),('detail10','order2','prod6'),('detail11','order2','prod7'),('detail12','order2','prod8'),
('detail13','order3','prod1'),('detail14','order3','prod2'),('detail15','order3','prod3'),
('detail16','order4','prod1'),('detail17','order4','prod2'),('detail18','order4','prod3'),('detail19','order4','prod4'),('detail20','order4','prod5');

