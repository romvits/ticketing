USE ticketing_db;

DROP VIEW IF EXISTS `viewSumOrderTax`;
CREATE
VIEW `viewSumOrderTax` AS 
SELECT 
	sum(OrderTaxAmount) AS TaxAmount
FROM ticketing_db.innoOrderTax;
