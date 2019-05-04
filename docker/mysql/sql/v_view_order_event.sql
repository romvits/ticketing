USE ticketing_db;

DROP VIEW IF EXISTS `viewOrderEvent`;
CREATE
VIEW `viewOrderEvent` AS 
SELECT
    `innoEvent`.`EventID`,
    `innoEvent`.`EventPromoterID`,
    
    `innoEvent`.`EventPrefix`,
    
    `innoEvent`.`EventOrderNumberBy`,
    `innoEvent`.`EventStartBillNumber`,
    `innoEvent`.`EventDefaultTaxTicketPercent`,
    `innoEvent`.`EventDefaultTaxSeatPercent`, 
    
    
	`innoEvent`.`EventHandlingFeeName`,
    `innoEvent`.`EventHandlingFeeLabel`,
    `innoEvent`.`EventHandlingFeeGrossInternal`,
    `innoEvent`.`EventHandlingFeeGrossExternal`,
    `innoEvent`.`EventHandlingFeeTaxPercent`,
  
    `innoEvent`.`EventShippingCostName`,
    `innoEvent`.`EventShippingCostLabel`,
    `innoEvent`.`EventShippingCostGrossInternal`,
    `innoEvent`.`EventShippingCostGrossExternal`,
    `innoEvent`.`EventShippingCostTaxPercent`
FROM 
	`innoEvent`
