USE ticketing_db;

DROP TABLE IF EXISTS `innoSeat`;
CREATE TABLE `innoSeat` (
  `SeatID` varchar(32) NOT NULL COMMENT 'unique id of the table',
  `SeatLocationID` varchar(32) NULL COMMENT 'unique id of the location that seat belongs to',
  `SeatEventID` varchar(32) NULL COMMENT 'unique id of the event that seat belongs to',
  `SeatTableID` varchar(32) NULL COMMENT 'unique id of the table that seat belongs to',
  `SeatName` varchar(100) NULL COMMENT 'name',
  
  FOREIGN KEY Seat_LocationID (`SeatLocationID`) REFERENCES innoLocation(`LocationID`),
  FOREIGN KEY Seat_EventID (`SeatEventID`) REFERENCES innoEvent(`EventID`),
  FOREIGN KEY Seat_TableID (`SeatTableID`) REFERENCES innoTable(`TableID`),
  PRIMARY KEY (`SeatID`)
) ENGINE=InnoDB DEFAULT CHARSET=UTF8MB4;
