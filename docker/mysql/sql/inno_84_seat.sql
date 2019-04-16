USE ticketing_db;

SET FOREIGN_KEY_CHECKS = 0;

DROP TABLE IF EXISTS `innoSeat`;
CREATE TABLE `innoSeat` (
	`SeatID`                varchar(32) NOT NULL COMMENT 'unique id of the table',
	
	`SeatLocationID`        varchar(32) NULL COMMENT 'unique id of the location that seat belongs to if NULL this seat belongs to a event',
	`SeatEventID`           varchar(32) NULL COMMENT 'unique id of the event that seat belongs to',
	`SeatFloorID`           varchar(32) NOT NULL COMMENT 'unique id of the floor that seat belongs to',
	`SeatRoomID`            varchar(32) NOT NULL COMMENT 'unique id of the room that seat belongs to',
    `SeatTableID`           varchar(32) NULL COMMENT 'unique id of the table that seat belongs to if NULL this seat belongs to a floor (no table for this seat eg cinema, theater or stadium)',

    `SeatOrderID`           varchar(32) NULL COMMENT 'id of the order that seat was assigned to',
    `SeatReservationID`     varchar(32) NULL COMMENT 'id of the reservation that seat was assigned to',
	
    `SeatNumber`            int(6) NULL COMMENT 'number',
	`SeatName`              varchar(100) NULL COMMENT 'name internal description',
	`SeatLabel`             varchar(100) NULL COMMENT 'label can be tokenized (eg §§SEAT, §§AREAONE or §§SECTORTWO)',

	`SeatSettings`          json NULL COMMENT 'settings for this seat (could be a canvas or svg object)',

	`SeatGrossPrice`        decimal(8,2) UNSIGNED NOT NULL DEFAULT 0.00 COMMENT 'price gross => brutto',
	`SeatTaxPercent`        decimal(5,2) UNSIGNED NOT NULL DEFAULT 0.00 COMMENT 'tax in percent',
 
	FOREIGN KEY Seat_LocationID (`SeatLocationID`)        REFERENCES innoLocation(`LocationID`),
	FOREIGN KEY Seat_EventID (`SeatEventID`)              REFERENCES innoEvent(`EventID`),
	FOREIGN KEY Seat_FloorID (`SeatFloorID`)              REFERENCES innoFloor(`FloorID`),
	FOREIGN KEY Seat_RoomID (`SeatRoomID`)                REFERENCES innoRoom(`RoomID`),
    FOREIGN KEY Seat_TableID (`SeatTableID`)              REFERENCES innoTable(`TableID`),

	FOREIGN KEY Seat_OrderID (`SeatOrderID`)              REFERENCES innoOrder(`OrderID`),
	FOREIGN KEY Seat_ReservationID (`SeatReservationID`)  REFERENCES innoReservation(`ReservationID`),

  PRIMARY KEY (`SeatID`)
) ENGINE=InnoDB DEFAULT CHARSET=UTF8MB4;

SET FOREIGN_KEY_CHECKS = 1;
