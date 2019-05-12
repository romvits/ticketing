USE ticketing_db;

DROP VIEW IF EXISTS `viewSumOrderDetail`;
CREATE
VIEW `viewSumOrderDetail` AS 
SELECT 
	sum(OrderDetailGrossRegular) AS GrossRegular, 
    sum(OrderDetailGrossDiscount) AS GrossDiscount, 
    sum(OrderDetailGrossPrice) AS GrossPrice, 
    sum(OrderDetailNetPrice) AS NetPrice, 
    sum(OrderDetailTaxPrice) AS TaxPrice
FROM ticketing_db.innoOrderDetail;
