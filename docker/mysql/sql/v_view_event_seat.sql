USE ticketing_db;

DROP VIEW IF EXISTS `viewEventSeat`;
CREATE
VIEW `viewEventSeat` AS 
SELECT
    `innoSeat`.`SeatID`,
    `innoSeat`.`SeatEventID`,
    `innoSeat`.`SeatOrderID`,
    `innoSeat`.`SeatReservationID`,
    `innoSeat`.`SeatName`,
    `innoSeat`.`SeatLabel`,
    `innoSeat`.`SeatNumber`,
    `innoSeat`.`SeatGrossPrice`, 
    `innoSeat`.`SeatTaxPercent`,
    `innoRoom`.`RoomName`,
    `innoRoom`.`RoomLabel`,
    `innoTable`.`TableName`,
    `innoTable`.`TableLabel`,
    `innoTable`.`TableNumber`    
FROM (`innoSeat`
	LEFT JOIN `innoRoom` ON `innoRoom`.`RoomID` = `innoSeat`.`SeatRoomID`
    LEFT JOIN `innoTable` ON `innoTable`.`TableID` = `innoSeat`.`SeatTableID`)