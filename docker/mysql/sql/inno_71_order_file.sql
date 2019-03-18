USE ticketing_db;

DROP TABLE IF EXISTS `innoOrderFile`;
CREATE TABLE `innoOrderFile` (
  `OrderFileID` VARCHAR(32) NOT NULL COMMENT 'unique id of the order/credit',
  `OrderFile` mediumblob NOT NULL COMMENT 'pdf file (order or credit)',
  `OrderTicket` longblob NULL COMMENT 'pdf file with tickets for this order, could be null if it as credit',
  FOREIGN KEY FileID_OrderID (`OrderFileID`) REFERENCES innoOrder(`OrderID`),
  PRIMARY KEY (`FileOrderID`)
)
ENGINE=InnoDB DEFAULT CHARSET=UTF8MB4;
