USE ticketing_db;

SET FOREIGN_KEY_CHECKS = 0;

DROP TABLE IF EXISTS `innoSeat`;
CREATE TABLE `innoSeat` (
	`SeatID`                varchar(32) NOT NULL COMMENT 'unique id of the table',
	
    `SeatTableID`           varchar(32) NULL COMMENT 'unique id of the table that seat belongs to',
	`SeatRoomID`            varchar(32) NULL COMMENT 'unique id of the room that seat belongs to',
	
    `SeatNumber`            int(6) NULL COMMENT 'number',
	`SeatName`              varchar(100) NULL COMMENT 'name',

	`SeatSettings`          json NULL COMMENT 'settings for this seat (could be a canvas or svg object)',

	`SeatGrossPrice`        decimal(8,2) UNSIGNED NOT NULL DEFAULT 0.00 COMMENT 'price gross => brutto',
	`SeatTaxPercent`        decimal(5,2) UNSIGNED NOT NULL DEFAULT 0.00 COMMENT 'tax in percent',
 
  -- FOREIGN KEY Seat_TableID (`SeatTableID`) REFERENCES innoTable(`TableID`),
  PRIMARY KEY (`SeatID`)
) ENGINE=InnoDB DEFAULT CHARSET=UTF8MB4;

SET FOREIGN_KEY_CHECKS = 1;
