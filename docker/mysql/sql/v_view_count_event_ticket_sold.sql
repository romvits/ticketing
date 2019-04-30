USE ticketing_db;

DROP VIEW IF EXISTS `viewCountEventTicketSold`;
CREATE
VIEW `viewCountEventTicketSold` AS 
SELECT
	`innoOrder`.`OrderEventID` AS `EventID`,
	`innoOrderDetail`.`OrderDetailTypeID` AS `TicketID`,
	`innoOrderDetail`.`OrderDetailType` AS `Type`,
	count(`innoOrderDetail`.`OrderDetailScanCode`) AS `count`
FROM (`innoOrder` 
	INNER JOIN `innoOrderDetail` ON `innoOrder`.`OrderID` = `innoOrderDetail`.`OrderDetailOrderID`)  WHERE `innoOrderDetail`.`OrderDetailState` = 'sold' AND (`innoOrderDetail`.`OrderDetailType` = 'ticket' OR `innoOrderDetail`.`OrderDetailType` = 'special') GROUP BY `TicketID`, `EventID`, `Type`
