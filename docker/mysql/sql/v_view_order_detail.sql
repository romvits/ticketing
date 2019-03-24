USE ticketing_db;

DROP VIEW IF EXISTS `viewOrderDetail`;
CREATE
VIEW `viewOrderDetail` AS 
SELECT
	`innoOrderDetail`.`OrderDetailScanCode` AS `ScanCode`,
	`innoOrder`.`OrderID`,
	`innoOrder`.`OrderEventID` AS `EventID`,
	`innoOrder`.`OrderUserID` AS `UserID`,
	`innoOrderDetail`.`OrderDetailTypeID` AS `TypeID`,
	`innoOrderDetail`.`OrderDetailType` AS `Type`,
	`innoOrderDetail`.`OrderDetailText` AS `Text`,
	`innoOrderDetail`.`OrderDetailTaxPercent` AS `TaxPercent`,
	`innoOrderDetail`.`OrderDetailGrossRegular` AS `GrossRegular`,
	`innoOrderDetail`.`OrderDetailGrossDiscount` AS `GrossDiscount`,
	`innoOrderDetail`.`OrderDetailGrossPrice` AS `GrossPrice`
FROM `innoOrder` 
	INNER JOIN `innoOrderDetail` ON `innoOrder`.`OrderID` = `innoOrderDetail`.`OrderDetailOrderID`;
