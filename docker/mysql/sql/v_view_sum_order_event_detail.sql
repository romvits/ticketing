USE ticketing_db;

DROP VIEW IF EXISTS `viewSumOrderEventDetail`;
CREATE
VIEW `viewSumOrderEventDetail` AS 
SELECT 
	OrderDetailEventID AS EventID,
	sum(OrderDetailGrossRegular) AS GrossRegular, 
    sum(OrderDetailGrossDiscount) AS GrossDiscount, 
    sum(OrderDetailGrossPrice) AS GrossPrice, 
    sum(OrderDetailNetPrice) AS NetPrice, 
    sum(OrderDetailTaxPrice) AS TaxPrice
FROM ticketing_db.innoOrderDetail GROUP BY EventID;
