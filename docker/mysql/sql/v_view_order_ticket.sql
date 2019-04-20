USE ticketing_db;

DROP VIEW IF EXISTS `viewOrderTicket`;
CREATE
VIEW `viewOrderTicket` AS 
SELECT
    `innoTicket`.`TicketID`,
    `innoTicket`.`TicketEventID`,
    `innoTicket`.`TicketType`,
    `innoTicket`.`TicketName`,
    `innoTicket`.`TicketLable`,
    `innoTicket`.`TicketContingent`,
    `innoTicket`.`TicketScanType`, 
    `innoTicket`.`TicketGrossPrice`,
    `innoTicket`.`TicketTaxPercent`
FROM 
	`innoTicket`
