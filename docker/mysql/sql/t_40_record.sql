USE ticketing_db;

DROP TABLE IF EXISTS `t_record`;
CREATE TABLE `t_record` (
	`record_id` VARCHAR(32) NOT NULL COMMENT 'unique id of the record - will be a auto generated 32 character string',
    `table` VARCHAR(100) NOT NULL COMMENT 'the name of the table where the data will be stored or feched',
	`pk` VARCHAR(100) NOT NULL DEFAULT 'id' COMMENT 'which field is the PK field in this table? (default = id) OR (record_id)',
	`json` JSON NULL COMMENT 'json configuration string for the record',
	PRIMARY KEY (`record_id`))
ENGINE = MyISAM DEFAULT CHARSET=UTF8MB4;

INSERT INTO `t_record` VALUES ('mock_record','t_mock_data','id','{}');
