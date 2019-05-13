USE ticketing_db;

DROP VIEW IF EXISTS `viewSumOrderEvent`;
CREATE
VIEW `viewSumOrderEvent` AS 
SELECT 
	OrderEventID AS EventID,
	sum(OrderGrossRegular) AS GrossRegular, 
    sum(OrderGrossDiscount) AS GrossDiscount, 
    sum(OrderGrossPrice) AS GrossPrice, 
    sum(OrderNetPrice) AS NetPrice, 
    sum(OrderTaxPrice) AS TaxPrice
FROM ticketing_db.innoOrder GROUP BY EventID;