USE ticketing_db;

DROP TABLE IF EXISTS `archiveRow`;
CREATE TABLE `archiveRow` (
  `ArchiveRowID` bigint(20) unsigned auto_increment NOT NULL,
  `ArchiveRowTableName` varchar(50) NULL,
  `ArchiveRecordID` varchar(32) NULL,
  `ArchiveUserID` varchar(32) NULL,
  `ArchiveDateTime` datetime NULL,
  PRIMARY KEY (`ArchiveRowID`)
)
ENGINE=MyISAM DEFAULT CHARSET=UTF8MB4;

DROP TABLE IF EXISTS `archiveRowData`;
CREATE TABLE `archiveRowData` (
  `ArchiveRowID` bigint(20) NULL,
  `ArchiveRowDataColumnName` varchar(50) NULL,
  `ArchiveRowDataColumnData` longtext NULL
)
ENGINE=ARCHIVE DEFAULT CHARSET=UTF8MB4;
