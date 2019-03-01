USE ticketing_db;

DROP TABLE IF EXISTS `tabEvent`;
CREATE TABLE `tabEvent` (
  `EventID` varchar(32) NOT NULL COMMENT 'unique id of the event',
  `EventLocationID` varchar(32) NULL COMMENT 'unique id of the location that event belongs to',
  `EventName` varchar(100) NULL COMMENT 'name',
  PRIMARY KEY (`EventID`),
  UNIQUE INDEX `UNIQUEID` (`EventID`,`EventLocationID`) VISIBLE
) ENGINE=MyISAM DEFAULT CHARSET=UTF8MB4;
