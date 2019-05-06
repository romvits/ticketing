USE ticketing_db;

DROP VIEW IF EXISTS `viewSumOrder`;
CREATE
VIEW `viewSumOrder` AS 
SELECT 
	sum(OrderGrossRegular) AS OrderGrossRegular, 
    sum(OrderGrossDiscount) AS OrderGrossDiscount, 
    sum(OrderGrossPrice) AS OrderGrossPrice, 
    sum(OrderNetPrice) AS OrderNetPrice, 
    sum(OrderTaxPrice) AS OrderTaxPrice
FROM ticketing_db.innoOrder;