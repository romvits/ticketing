USE ticketing_db;

DROP TABLE IF EXISTS `feRecord`;
CREATE TABLE `feRecord` (
	`RecordID` VARCHAR(32) NOT NULL COMMENT 'unique id of the record - will be a auto generated 32 character string',
    `RecordTable` VARCHAR(100) NOT NULL COMMENT 'the name of the table where the data will be stored or feched',
	`RecordPK` VARCHAR(100) NOT NULL DEFAULT 'id' COMMENT 'which field is the PK field in this table? (default = id) OR (record_id)',
	`RecordJSON` JSON NULL COMMENT 'json configuration string for the record',
	PRIMARY KEY (`RecordID`))
ENGINE = MyISAM DEFAULT CHARSET=UTF8MB4;

INSERT INTO `feRecord` VALUES ('mock_record','t_mock_data','id','{}');
