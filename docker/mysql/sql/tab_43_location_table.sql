USE ticketing_db;

DROP TABLE IF EXISTS `tabLocationTable`;
CREATE TABLE `tabLocationTable` (
  `TableID` varchar(32) NOT NULL COMMENT 'unique id of the table',
  `TableLocationID` varchar(32) NULL COMMENT 'unique id of the location that table belongs to',
  `TableFloorID` varchar(32) NULL COMMENT 'unique id of the floor that table belongs to',
  `TableRoomID` varchar(32) NULL COMMENT 'unique id of the room that table belongs to',
  `TableName` varchar(100) NULL COMMENT 'name',
  PRIMARY KEY (`TableID`),
  UNIQUE INDEX `UNIQUEID` (`TableID`,`TableLocationID`,`TableFloorID`,`TableRoomID`) VISIBLE
) ENGINE=MyISAM DEFAULT CHARSET=UTF8MB4;
