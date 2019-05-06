USE ticketing_db;

DROP VIEW IF EXISTS `viewSumOrderDetail`;
CREATE
VIEW `viewSumOrderDetail` AS 
SELECT 
	sum(OrderDetailGrossRegular) AS OrderDetailGrossRegular, 
    sum(OrderDetailGrossDiscount) AS OrderDetailGrossDiscount, 
    sum(OrderDetailGrossPrice) AS OrderDetailGrossPrice, 
    sum(OrderDetailNetPrice) AS OrderDetailNetPrice, 
    sum(OrderDetailTaxPrice) AS OrderDetailTaxPrice
FROM ticketing_db.innoOrderDetail;
