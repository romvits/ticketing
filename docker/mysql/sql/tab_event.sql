USE ticketing_db;

DROP TABLE IF EXISTS `tabEvent`;
CREATE TABLE `tabEvent` (
  `EventID` varchar(32) NOT NULL COMMENT 'unique id of the event',
  `EventPromoterID` varchar(32) NULL COMMENT 'unique id of the promoter that event belongs to',
  `EventLocationID` varchar(32) NULL COMMENT 'unique id of the location that event belongs to',
  `EventName` varchar(100) NULL COMMENT 'name',
  `EventPrefix` varchar(7) NULL COMMENT 'prefix of the event eg ZBB2020',
  PRIMARY KEY (`EventID`),
  UNIQUE INDEX `UNIQUEID` (`EventID`,`EventLocationID`) VISIBLE
) ENGINE=MyISAM DEFAULT CHARSET=UTF8MB4;
