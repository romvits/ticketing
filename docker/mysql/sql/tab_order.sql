USE ticketing_db;

DROP TABLE IF EXISTS `tabOrder`;
CREATE TABLE `tabOrder` (
  `OrderID` varchar(32) NOT NULL COMMENT 'unique id of the order',
  `OrderEventID` varchar(32) NULL COMMENT 'unique id of the event that order belongs to',
  `OrderUserID` varchar(32) NULL COMMENT 'unique id of the user that order belongs to',
  PRIMARY KEY (`OrderID`),
  KEY `event` (`OrderEventID`),
  KEY `user` (`OrderUserID`)
) ENGINE=MyISAM DEFAULT CHARSET=UTF8MB4;
