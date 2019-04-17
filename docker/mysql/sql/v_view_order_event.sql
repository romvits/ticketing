USE ticketing_db;

DROP VIEW IF EXISTS `viewOrderEvent`;
CREATE
VIEW `viewOrderEvent` AS 
SELECT
    `innoEvent`.`EventPromoterID`,
    `innoEvent`.`EventOrderNumberBy`,
    `innoEvent`.`EventDefaultTaxTicketPercent`,
    `innoEvent`.`EventDefaultTaxSeatPercent`, 
    `innoEvent`.`EventInternalHandlingFeeGross`,
    `innoEvent`.`EventInternalHandlingFeeTaxPercent`,
    `innoEvent`.`EventInternalShippingCostGross`,
    `innoEvent`.`EventInternalShippingCostTaxPercent`,
    `innoEvent`.`EventExternalHandlingFeeGross`,
    `innoEvent`.`EventExternalHandlingFeeTaxPercent`,
    `innoEvent`.`EventExternalShippingCostGross`,
    `innoEvent`.`EventExternalShippingCostTaxPercent`
FROM 
	`innoEvent`
