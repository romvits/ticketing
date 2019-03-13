CREATE
VIEW `viewOrderDetail` AS 
SELECT
	`innoOrder`.`OrderID`,
	`innoOrder`.`OrderEventID` AS `EventID`,
	`innoOrder`.`OrderUserID` AS `UserID`,
	`innoOrderDetail`.`OrderDetailTypeID` AS `TypeID`,
	`innoOrderDetail`.`OrderDetailType` AS `Type`,
	`innoOrderDetail`.`OrderDetailText` AS `Text`,
	`innoOrderDetail`.`OrderDetailTaxPercent` AS `TaxPercent`,
	`innoOrderDetail`.`OrderDetailTax` AS `Tax`,
	`innoOrderDetail`.`OrderDetailNetPrice` AS `NetPrice`,
	`innoOrderDetail`.`OrderDetailGrossRegular` AS `GrossRegular`,
	`innoOrderDetail`.`OrderDetailGrossDiscount` AS `GrossDiscount`,
	`innoOrderDetail`.`OrderDetailGrossPrice` AS `GrossPrice`
FROM 
	(`innoOrder`
	INNER JOIN `innoOrderDetail` ON ((`innoOrder`.`OrderID` = `innoOrderDetail`.`OrderDetailOrderID`)));
