USE ticketing_db;

DROP VIEW IF EXISTS `viewOrderSeat`;
CREATE
VIEW `viewOrderSeat` AS 
SELECT
    `innoSeat`.`SeatID`,
    `innoSeat`.`SeatOrderID`,
    `innoSeat`.`SeatReservationID`,
    `innoSeat`.`SeatLabel`,
    `innoSeat`.`SeatNumber`,
    `innoSeat`.`SeatGrossPrice`, 
    `innoSeat`.`SeatTaxPercent`,
	`innoOrderDetail`.`OrderDetailState` AS `SeatState`
FROM 
	`innoSeat`
	LEFT JOIN `innoOrderDetail` ON (`innoOrderDetail`.`OrderDetailTypeID` = `innoSeat`.`SeatID`)