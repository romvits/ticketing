USE ticketing_db;

DROP TABLE IF EXISTS `innoLocationFloor`;
CREATE TABLE `innoLocationFloor` (
  `LocationFloorID` varchar(32) NOT NULL COMMENT 'unique id of the floor event',
  `LocationFloorLocationID` varchar(32) NULL COMMENT 'unique id of the location that floor belongs to',
  `LocationFloorName` varchar(100) NULL COMMENT 'name',
  
  FOREIGN KEY LOCATIONFLOOR_EVENTID (`LocationFloorID`) REFERENCES innoEvent(`EventID`),
  PRIMARY KEY (`LocationFloorID`)
) ENGINE=InnoDB DEFAULT CHARSET=UTF8MB4;
