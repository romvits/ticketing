USE ticketing_db;

DROP TABLE IF EXISTS `innoLocationSeat`;
CREATE TABLE `innoLocationSeat` (
  `SeatID` varchar(32) NOT NULL COMMENT 'unique id of the table',
  `SeatLocationID` varchar(32) NULL COMMENT 'unique id of the location that seat belongs to',
  `SeatFloorID` varchar(32) NULL COMMENT 'unique id of the floor that seat belongs to',
  `SeatRoomID` varchar(32) NULL COMMENT 'unique id of the room that seat belongs to',
  `SeatTableID` varchar(32) NULL COMMENT 'unique id of the table that seat belongs to',
  `SeatName` varchar(100) NULL COMMENT 'name',
  PRIMARY KEY (`SeatID`),
  UNIQUE INDEX `UNIQUEID` (`SeatID`,`SeatLocationID`,`SeatFloorID`,`SeatRoomID`,`SeatTableID`) VISIBLE
) ENGINE=InnoDB DEFAULT CHARSET=UTF8MB4;
