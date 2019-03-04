USE ticketing_db;

DROP TABLE IF EXISTS `tabOrderDetail`;
CREATE TABLE `tabOrderDetail` (
  `OrderDetailID` varchar(32) NOT NULL COMMENT 'unique id of the order detail',
  `OrderDetailOrderID` varchar(32) NULL COMMENT 'unique id of the order that order detail belongs to',
  `OrderDetailEventID` varchar(32) NULL COMMENT 'unique id of the event that order detail belongs to',
  PRIMARY KEY (`OrderDetailID`),
  KEY `order` (`OrderDetailOrderID`),
  KEY `event` (`OrderDetailEventID`)
) ENGINE=MyISAM DEFAULT CHARSET=UTF8MB4;
