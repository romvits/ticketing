USE ticketing_db;

CREATE
VIEW `viewTicket` AS
SELECT
	`innoTicket`.*,
	`innoEvent`.`EventPrefix` AS `EventPrefix`
FROM 
	`innoTicket` 
INNER JOIN `innoEvent` ON `innoTicket`.`TicketEventID` = `innoEvent`.`EventID`;
