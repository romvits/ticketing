USE ticketing_db;

DROP VIEW IF EXISTS `viewOrderDetail`;
DROP TABLE IF EXISTS `innoOrderDetail`;
DROP TABLE IF EXISTS `innoOrder`;

CREATE TABLE `innoOrder` (
  `OrderID` varchar(32) NOT NULL COMMENT 'unique id of the order',
  `OrderEventID` varchar(32) NULL COMMENT 'unique id of the event that order belongs to',
  `OrderUserID` varchar(32) NULL COMMENT 'unique id of the user that order belongs to',
  PRIMARY KEY (`OrderID`),
  KEY `event` (`OrderEventID`),
  KEY `user` (`OrderUserID`)
) ENGINE=InnoDB DEFAULT CHARSET=UTF8MB4;

CREATE TABLE `innoOrderDetail` (
  `OrderDetailID` varchar(32) NOT NULL COMMENT 'unique id of the order detail',
  `OrderDetailOrderID` varchar(32) NULL COMMENT 'unique id of the order that order detail belongs to',
  `OrderDetailTypeID` varchar(32) NULL COMMENT 'unique id of the record from table => ticket | seat | special | extra',
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

