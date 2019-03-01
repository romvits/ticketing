USE ticketing_db;

DROP TABLE IF EXISTS `tabFloor`;
CREATE TABLE `tabFloor` (
  `FloorID` varchar(32) NOT NULL COMMENT 'unique id of the floor',
  `FloorLocationID` varchar(32) NULL COMMENT 'unique id of the location that floor belongs to',
  `FloorName` varchar(100) NULL COMMENT 'name',
  PRIMARY KEY (`FloorID`),
  UNIQUE INDEX `UNIQUEID` (`FloorID`,`FloorLocationID`) VISIBLE
) ENGINE=MyISAM DEFAULT CHARSET=UTF8MB4;
