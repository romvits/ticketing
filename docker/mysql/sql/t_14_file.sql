USE ticketing_db;

DROP TABLE IF EXISTS `t_file`;
CREATE TABLE `t_file` (
  `file_id` VARCHAR(32) NOT NULL COMMENT 'unique id of the file - will be a auto generated 32 character string',
  `parent_id` varchar(200),
  `order` INT(6) NOT NULL DEFAULT 0 COMMENT 'sort order of the file',
  `file_name` varchar(200) NOT NULL DEFAULT '',
  `file_size` int(11) NOT NULL,
  `file` blob NOT NULL,
  PRIMARY KEY (`file_id`)
)
ENGINE = MyISAM DEFAULT CHARSET=UTF8MB4;
