USE ticketing_db;

DROP VIEW IF EXISTS `viewSumOrderEventTax`;
CREATE VIEW `viewSumOrderEventTax` AS 
SELECT 
    `innoOrder`.`OrderEventID` AS `EventID`,
	sum(`OrderTaxAmount`) AS `TaxAmount`
FROM 
	`innoOrderTax` 
LEFT JOIN `innoOrder` ON `innoOrder`.`OrderID` = `innoOrderTax`.`OrderTaxOrderID` GROUP BY `innoOrder`.`OrderEventID` ;