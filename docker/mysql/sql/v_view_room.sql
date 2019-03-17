USE ticketing_db;

DROP VIEW IF EXISTS `viewRoom`;
CREATE
VIEW `viewRoom` AS 
SELECT
	`innoRoom`.*,
	`innoEvent`.`EventPrefix` AS `EventPrefix`,
	`innoFloor`.`FloorName` AS `FloorName`
FROM 
	`innoRoom`
	INNER JOIN `innoEvent` ON (`innoRoom`.`RoomEventID` = `innoEvent`.`EventID`)
	INNER JOIN `innoFloor` ON (`innoRoom`.`RoomFloorID` = `innoFloor`.`FloorID`);
