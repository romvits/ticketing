USE ticketing_db;

DROP VIEW IF EXISTS `viewRoom`;
CREATE
VIEW `viewRoom` AS 
SELECT
	`innoRoom`.*,
	`innoEvent`.`EventPrefix` AS `EventPrefix`,
	`innoEvent`.`EventID` AS `EventID`,
	`innoFloor`.`FloorName` AS `FloorName`,
	`innoFloor`.`FloorLocationID` AS `LocationID`
FROM 
	`innoRoom`
	INNER JOIN `innoFloor` ON (`innoFloor`.`FloorID` = `innoRoom`.`RoomFloorID`)
	INNER JOIN `innoEvent` ON (`innoEvent`.`EventID` = `innoFloor`.`FloorEventID`)
