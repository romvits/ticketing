USE ticketing_db;

DROP VIEW IF EXISTS `viewOrderTicket`;
CREATE
VIEW `viewOrderTicket` AS 
SELECT
    `innoTicket`.`TicketID`,
    `innoTicket`.`TicketLable`,
    `innoTicket`.`TicketQuota`,
    `innoTicket`.`TicketScanType`, 
    `innoTicket`.`TicketGrossPrice`,
    `innoTicket`.`TicketTaxPercent`
FROM 
	`innoTicket`
