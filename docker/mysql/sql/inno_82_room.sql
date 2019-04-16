USE ticketing_db;

SET FOREIGN_KEY_CHECKS = 0;

DROP TABLE IF EXISTS `innoRoom`;
CREATE TABLE `innoRoom` (
	`RoomID`				varchar(32) NOT NULL COMMENT 'unique id of the room',

	`RoomLocationID`        varchar(32) NULL COMMENT 'unique id of the location that room belongs to if NULL this room belongs to a event',
	`RoomEventID`           varchar(32) NULL COMMENT 'unique id of the event that room belongs to',
	`RoomFloorID`			varchar(32) NOT NULL COMMENT 'unique id of the floor that room belongs to',

	`RoomName`				varchar(100) NULL COMMENT 'name internal description',
	`RoomLabel` 			varchar(100) NULL COMMENT 'label can be tokenized (eg §§FIRSTROOM)',

	`RoomSVGShape`			varchar(500) NULL COMMENT 'Shape coordinates for this room. this belongs/references to the FloorSVG from datbase table floor',
    
	FOREIGN KEY Room_LocationID (`RoomLocationID`) REFERENCES innoLocation(`LocationID`),
	FOREIGN KEY Room_EventID (`RoomEventID`) REFERENCES innoEvent(`EventID`),
	FOREIGN KEY Room_FloorID (`RoomFloorID`) REFERENCES innoFloor(`FloorID`),
	PRIMARY KEY (`RoomID`)
) ENGINE=InnoDB DEFAULT CHARSET=UTF8MB4;

SET FOREIGN_KEY_CHECKS = 0;
