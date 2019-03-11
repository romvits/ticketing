USE ticketing_db;

DROP TABLE IF EXISTS `tabFile`;
CREATE TABLE `tabFile` (
  `FileID` VARCHAR(32) NOT NULL COMMENT 'unique id of the file - will be a auto generated 32 character string',
  `FileParentID` varchar(32),
  `FileOrder` INT(6) NOT NULL DEFAULT 0 COMMENT 'sort order of the file',
  `FileFile_name` varchar(200) NOT NULL DEFAULT '',
  `FileFile_size` int(11) NOT NULL,
  `FileFile` blob NOT NULL,
  PRIMARY KEY (`FileID`, `FileParentID`)
)
ENGINE = MyISAM DEFAULT CHARSET=UTF8MB4;
