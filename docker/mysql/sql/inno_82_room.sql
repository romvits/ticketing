USE ticketing_db;

SET FOREIGN_KEY_CHECKS = 0;

DROP TABLE IF EXISTS `innoRoom`;
CREATE TABLE `innoRoom` (
	`RoomID`				varchar(32) NOT NULL COMMENT 'unique id of the room',
	`RoomFloorID`			varchar(32) NULL COMMENT 'unique id of the floor that room belongs to',
	`RoomName`				varchar(100) NULL COMMENT 'name',
	`RoomLabel` 			varchar(100) NULL COMMENT 'label can be tokenized (eg §§FIRSTROOM)',

	`RoomSVGShape`			varchar(500) NULL COMMENT 'Shape coordinates for this room. this belongs/references to the FloorSVG from datbase table floor',
    
	FOREIGN KEY Room_FloorID (`RoomFloorID`) REFERENCES innoFloor(`FloorID`),
	PRIMARY KEY (`RoomID`)
) ENGINE=InnoDB DEFAULT CHARSET=UTF8MB4;

SET FOREIGN_KEY_CHECKS = 0;
