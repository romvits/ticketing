USE ticketing_db;

CREATE
VIEW `viewEventSpecial` AS 
SELECT
	`innoEventSpecial`.*,
	`innoEvent`.`EventPrefix` AS `EventPrefix`
FROM 
	(`innoEventSpecial`
	INNER JOIN `innoEvent` ON ((`innoEventSpecial`.`EventSpecialEventID` = `innoEvent`.`EventID`)));
