USE ticketing_db;

DROP TABLE IF EXISTS `myisamFile`;
CREATE TABLE `myisamFile` (
  `FileID` VARCHAR(32) NOT NULL COMMENT 'unique id of the file - will be a auto generated 32 character string',
  `FileParentID` varchar(32),
  `FileOrder` INT(6) NOT NULL DEFAULT 0 COMMENT 'sort order of the file',
  `FileFileName` varchar(200) NOT NULL DEFAULT '',
  `FileFileSize` int(11) NOT NULL,
  `FileFile` blob NOT NULL,
  PRIMARY KEY (`FileID`, `FileParentID`)
)
ENGINE=MyISAM DEFAULT CHARSET=UTF8MB4;
