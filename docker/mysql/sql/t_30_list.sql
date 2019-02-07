USE ticketing_db;

DROP TABLE IF EXISTS `t_list`;
CREATE TABLE `t_list` (
  `list_id` VARCHAR(32) NOT NULL COMMENT 'unique id of the list - will be a auto generated 32 character string',
  `table` VARCHAR(100) NOT NULL COMMENT 'the name of the table or the view from where the data will be feched',
  `pk` VARCHAR(100) NOT NULL DEFAULT 'id' COMMENT 'which field is the PK field in this table? (default = id) OR (record_id)',
  `limit` INT(3) NOT NULL DEFAULT 0 COMMENT 'limit of records which will be fechted at once',
  `json` JSON NULL COMMENT 'json configuration string for the tabel, information like columns and so on',
  PRIMARY KEY (`list_id`))
ENGINE = MyISAM DEFAULT CHARSET=UTF8MB4;

INSERT INTO `t_list` (`list_id`,`table`,`pk`,`limit`,`json`) VALUES ('mock_data','t_mock_data','id',100,'{"columns": [{"name": "gender", "type": "rt_id", "rt_key": "gender", "rt_table": "v_gender", "rt_value": "gender_text"}, {"name": "first_name", "type": "text"}, {"name": "last_name", "type": "text"}], "orderby": "last_name"}');
