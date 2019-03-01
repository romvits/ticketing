USE ticketing_db;

DROP TABLE IF EXISTS `tabRoom`;
CREATE TABLE `tabRoom` (
  `RoomID` varchar(32) NOT NULL COMMENT 'unique id of the room',
  `RoomLocationID` varchar(32) NULL COMMENT 'unique id of the location that floor belongs to',
  `RoomFloorID` varchar(32) NULL COMMENT 'unique id of the floor that room belongs to',
  `RoomName` varchar(100) NULL COMMENT 'name',
  PRIMARY KEY (`RoomID`),
  UNIQUE INDEX `UNIQUEID` (`RoomID`,`RoomLocationID`,`RoomFloorID`) VISIBLE
) ENGINE=MyISAM DEFAULT CHARSET=UTF8MB4;
