USE ticketing_db;

SET FOREIGN_KEY_CHECKS = 0;

DROP TABLE IF EXISTS `innoTable`;
CREATE TABLE `innoTable` (
	`TableID`				varchar(32) NOT NULL COMMENT 'unique id of the table',
	`TableRoomID`			varchar(32) NULL COMMENT 'unique id of the room that table belongs to',
	`TableNumber`			int(6) NULL COMMENT 'number',
	`TableName`				varchar(100) NULL COMMENT 'name',

	`TableSettings`			json NULL COMMENT 'settings for this table (could be a canvas or svg object)',

	FOREIGN KEY Table_RoomID (`TableRoomID`) REFERENCES innoRoom(`RoomID`),
	PRIMARY KEY (`TableID`)
) ENGINE=InnoDB DEFAULT CHARSET=UTF8MB4;

SET FOREIGN_KEY_CHECKS = 1;
