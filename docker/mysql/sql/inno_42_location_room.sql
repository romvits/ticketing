USE ticketing_db;

DROP TABLE IF EXISTS `innoLocationRoom`;
CREATE TABLE `innoLocationRoom` (
  `LocationRoomID` varchar(32) NOT NULL COMMENT 'unique id of the room',
  `LocationRoomLocationID` varchar(32) NULL COMMENT 'unique id of the location that floor belongs to',
  `LocationRoomFloorID` varchar(32) NULL COMMENT 'unique id of the floor that room belongs to',
  `LocationRoomName` varchar(100) NULL COMMENT 'name',

  FOREIGN KEY LocationRoom_LocationID (`LocationRoomLocationID`) REFERENCES innoLocation(`LocationID`),
  FOREIGN KEY LocationRoom_FloorID (`LocationRoomFloorID`) REFERENCES innoLocationFloor(`LocationFloorID`),
  PRIMARY KEY (`LocationRoomID`)
) ENGINE=InnoDB DEFAULT CHARSET=UTF8MB4;
