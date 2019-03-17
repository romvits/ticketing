USE ticketing_db;

DROP TABLE IF EXISTS `innoRoom`;
CREATE TABLE `innoRoom` (
  `RoomID` varchar(32) NOT NULL COMMENT 'unique id of the room',
  `RoomLocationID` varchar(32) NULL COMMENT 'unique id of the location that floor belongs to',
  `RoomEventID` varchar(32) NULL COMMENT 'unique id of the event that floor belongs to',
  `RoomFloorID` varchar(32) NULL COMMENT 'unique id of the floor that room belongs to',
  `RoomName` varchar(100) NULL COMMENT 'name',

  FOREIGN KEY Room_LocationID (`RoomLocationID`) REFERENCES innoLocation(`LocationID`),
  FOREIGN KEY Room_EventID (`RoomEventID`) REFERENCES innoEvent(`EventID`),
  FOREIGN KEY Room_FloorID (`RoomFloorID`) REFERENCES innoFloor(`FloorID`),
  PRIMARY KEY (`RoomID`)
) ENGINE=InnoDB DEFAULT CHARSET=UTF8MB4;
