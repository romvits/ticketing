USE ticketing_db;

SET FOREIGN_KEY_CHECKS = 0;

DROP TABLE IF EXISTS `innoFloor`;
CREATE TABLE `innoFloor` (
	`FloorID` 				varchar(32) NOT NULL COMMENT 'unique id of the floor event',
	
    `FloorLocationID` 		varchar(32) NULL COMMENT 'unique id of the location that floor belongs to if NULL this floor belongs to a event',
	`FloorEventID` 			varchar(32) NULL COMMENT 'unique id of the event that floor belongs to',
	
    `FloorName` 			varchar(100) NULL COMMENT 'name internal description',
	`FloorLabel` 			varchar(100) NULL DEFAULT '§§FLOOR_LABEL' COMMENT 'label can be tokenized',

	`FloorSVG`				longtext NULL COMMENT 'SVG html string for this floor',

	FOREIGN KEY `Floor_LocationID` (`FloorLocationID`) REFERENCES `innoLocation`(`LocationID`),
	FOREIGN KEY `Floor_EventID` (`FloorEventID`) REFERENCES `innoEvent`(`EventID`),
	PRIMARY KEY (`FloorID`)
) ENGINE=InnoDB DEFAULT CHARSET=UTF8MB4;

SET FOREIGN_KEY_CHECKS = 1;
