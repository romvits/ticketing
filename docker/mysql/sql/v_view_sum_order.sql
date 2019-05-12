USE ticketing_db;

DROP VIEW IF EXISTS `viewSumOrder`;
CREATE
VIEW `viewSumOrder` AS 
SELECT 
	sum(OrderGrossRegular) AS GrossRegular, 
    sum(OrderGrossDiscount) AS GrossDiscount, 
    sum(OrderGrossPrice) AS GrossPrice, 
    sum(OrderNetPrice) AS NetPrice, 
    sum(OrderTaxPrice) AS TaxPrice
FROM ticketing_db.innoOrder;