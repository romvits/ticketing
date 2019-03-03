USE ticketing_db;

DROP TABLE IF EXISTS `tabTransChapter`;
CREATE TABLE `tabTransChapter` (
  `TransChapterID` varchar(32) NOT NULL COMMENT 'unique chapter id of the translation chapter',
  `TransChapterName` varchar(100) NULL COMMENT 'name',
  PRIMARY KEY (`TransChapterID`)
) ENGINE=MyISAM DEFAULT CHARSET=UTF8MB4;
