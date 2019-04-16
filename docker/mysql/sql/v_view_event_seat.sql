USE ticketing_db;

DROP VIEW IF EXISTS `viewRoom`;
CREATE
VIEW `viewRoom` AS 
SELECT
	`innoRoom`.*,
	`innoEvent`.`EventPrefix` AS `EventPrefix`,
	`innoFloor`.`FloorName` AS `FloorName`,
	`innoFloor`.`FloorLocationId` AS `LocationID`,
	`innoFloor`.`FloorEventId` AS `EventID`
FROM 
	`innoRoom`
	INNER JOIN `innoFloor` ON (`innoRoom`.`RoomFloorID` = `innoFloor`.`FloorID`)
	INNER JOIN `innoEvent` ON (`innoEvent`.`EventID` = `innoFloor`.`FloorEventID`)