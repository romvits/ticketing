USE ticketing_db;

DROP TABLE IF EXISTS `innoEventFloor`;
CREATE TABLE `innoEventFloor` (
  `EventFloorID` varchar(32) NOT NULL COMMENT 'unique id of the floor event',
  `EventFloorEventID` varchar(32) NULL COMMENT 'unique id of the event that floor belongs to',
  `EventFloorName` varchar(100) NULL COMMENT 'name',
  
  FOREIGN KEY EVENTFLOOR_EVENTID (`EventFloorEventID`) REFERENCES innoEvent(`EventID`),
  PRIMARY KEY (`EventFloorID`)
) ENGINE=InnoDB DEFAULT CHARSET=UTF8MB4;
