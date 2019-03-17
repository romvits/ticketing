USE ticketing_db;

DROP TABLE IF EXISTS `innoFloor`;
CREATE TABLE `innoFloor` (
  `FloorID` varchar(32) NOT NULL COMMENT 'unique id of the floor event',
  `FloorLocationID` varchar(32) NULL COMMENT 'unique id of the location that floor belongs to',
  `FloorEventID` varchar(32) NULL COMMENT 'unique id of the event that floor belongs to',
  `FloorName` varchar(100) NULL COMMENT 'name',
  
  FOREIGN KEY Floor_LocationID (`FloorLocationID`) REFERENCES innoLocation(`LocationID`),
  FOREIGN KEY Floor_EventID (`FloorEventID`) REFERENCES innoEvent(`EventID`),
  PRIMARY KEY (`FloorID`)
) ENGINE=InnoDB DEFAULT CHARSET=UTF8MB4;
