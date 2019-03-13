USE ticketing_db;

DROP TABLE IF EXISTS `innoLocationSeat`;
CREATE TABLE `innoLocationSeat` (
  `LocationSeatID` varchar(32) NOT NULL COMMENT 'unique id of the table',
  `LocationSeatLocationID` varchar(32) NULL COMMENT 'unique id of the location that seat belongs to',
  `LocationSeatTableID` varchar(32) NULL COMMENT 'unique id of the table that seat belongs to',
  `LocationSeatName` varchar(100) NULL COMMENT 'name',
  
  PRIMARY KEY (`LocationSeatID`)
) ENGINE=InnoDB DEFAULT CHARSET=UTF8MB4;
