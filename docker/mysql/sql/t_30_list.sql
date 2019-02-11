USE ticketing_db;

DROP TABLE IF EXISTS `t_list`;
CREATE TABLE `t_list` (
  `list_id` VARCHAR(32) NOT NULL COMMENT 'unique id of the list - will be a auto generated 32 character string',
  `table` VARCHAR(100) NOT NULL COMMENT 'the name of the table or the view from where the data will be feched',
  `pk` VARCHAR(100) NOT NULL DEFAULT 'id' COMMENT 'which field is the PK field in this table? (default = id) OR (record_id)',
  `limit` TINYINT(3) NOT NULL DEFAULT 50 COMMENT 'limit of records which will be fechted at once',
  `json` JSON NULL COMMENT 'json configuration string for the tabel, information like columns and so on',
  PRIMARY KEY (`list_id`))
ENGINE = MyISAM DEFAULT CHARSET=UTF8MB4;

INSERT INTO `t_list` (`list_id`,`table`,`pk`,`limit`,`json`) VALUES ('mock_data','t_mock_data','id',100,'{"orderby": "last_name","editable":1}');

DROP TABLE IF EXISTS `t_list_column`;
CREATE TABLE `t_list_column` (
  `column_id` VARCHAR(32) NOT NULL COMMENT 'unique id of the list - will be a auto generated 32 character string',
  `list_id` VARCHAR(32) NOT NULL COMMENT 'id of the list this column is related to',
  `order` TINYINT(3) NOT NULL DEFAULT 1 COMMENT 'sort order of the column',
  `name` VARCHAR(100) NOT NULL COMMENT 'the name of the column - must be a field name of "table" from database table t_list',
  `label` VARCHAR(100) NOT NULL COMMENT 'the name of the column - will be used for translation',
  `type` VARCHAR(100) NOT NULL COMMENT 'the type of the column',
  `json` JSON NULL COMMENT 'json configuration string for the column - depends on type of column (eg. rt_id)',
  PRIMARY KEY (`list_id`, `column_id`))
ENGINE = MyISAM DEFAULT CHARSET=UTF8MB4;

INSERT INTO `t_list_column` VALUES ('mock_data_col_1','mock_data',1,'gender','§§GENDER','rt','{"rt_key": "gender", "rt_table": "v_gender", "rt_value": "gender_text"}');
INSERT INTO `t_list_column` VALUES ('mock_data_col_2','mock_data',2,'first_name','§§FIRSTNAME','text','{}');
INSERT INTO `t_list_column` VALUES ('mock_data_col_3','mock_data',3,'last_name','§§LASTNAME','text','{}');


