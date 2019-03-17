USE ticketing_db;

CREATE
VIEW `viewEventTicket` AS 
SELECT
	`innoEventTicket`.*,
	`innoEvent`.`EventPrefix` AS `EventPrefix`
FROM 
	(`innoEventTicket`
	INNER JOIN `innoEvent` ON ((`innoEventTicket`.`EventTicketEventID` = `innoEvent`.`EventID`)));
