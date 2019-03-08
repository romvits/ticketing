USE ticketing_db;

DROP TABLE IF EXISTS `tabLocationFloor`;
CREATE TABLE `tabLocationFloor` (
  `FloorID` varchar(32) NOT NULL COMMENT 'unique id of the floor',
  `FloorLocationID` varchar(32) NULL COMMENT 'unique id of the location that floor belongs to',
  `FloorEventID` varchar(32) NULL COMMENT 'unique id of the event that floor belongs to',
  `FloorName` varchar(100) NULL COMMENT 'name',
  PRIMARY KEY (`FloorID`),
  UNIQUE INDEX `UNIQUEID` (`FloorID`,`FloorLocationID`,`FloorEventID`) VISIBLE
) ENGINE=MyISAM DEFAULT CHARSET=UTF8MB4;
