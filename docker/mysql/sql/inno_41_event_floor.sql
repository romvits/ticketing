USE ticketing_db;

DROP TABLE IF EXISTS `innoEventFloor`;
CREATE TABLE `innoEventFloor` (
  `EventFloorID` varchar(32) NOT NULL COMMENT 'unique id of the floor event',
  `LocationID` varchar(32) NULL COMMENT 'unique id of the location that floor belongs to',
  `FloorName` varchar(100) NULL COMMENT 'name',
  PRIMARY KEY (`EventFloorID`)
) ENGINE=InnoDB DEFAULT CHARSET=UTF8MB4;
