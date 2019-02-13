USE ticketing_db;

DROP TABLE IF EXISTS `t_list`;
CREATE TABLE `t_list` (
  `list_id` VARCHAR(32) NOT NULL COMMENT 'unique id of the list - will be a auto generated 32 character string',
  `label` VARCHAR(100) NOT NULL COMMENT 'label of the list - will be used to identify the list in humen language',
  `table` VARCHAR(100) NOT NULL COMMENT 'the name of the table or the view from where the data will be feched',
  `pk` VARCHAR(100) NOT NULL DEFAULT 'id' COMMENT 'which field is the PK field in this table? (default = id) OR (record_id)',
  `limit` TINYINT(3) NOT NULL DEFAULT 50 COMMENT 'limit of records which will be fechted at once',
  `json` JSON NULL COMMENT 'json configuration string for the tabel, information like columns and so on',
  PRIMARY KEY (`list_id`))
ENGINE = MyISAM DEFAULT CHARSET=UTF8MB4;

INSERT INTO `t_list` (`list_id`,`label`,`table`,`pk`,`limit`,`json`) VALUES ('mock_data','Mock Liste','t_mock_data','id',100,'{"orderby": "last_name","editable":1}');

DROP TABLE IF EXISTS `t_list_column`;
CREATE TABLE `t_list_column` (
  `column_id` VARCHAR(32) NOT NULL COMMENT 'unique id of the list - will be a auto generated 32 character string',
  `list_id` VARCHAR(32) NOT NULL COMMENT 'id of the list this column is related to',
  `order` TINYINT(3) NOT NULL COMMENT 'sort order of the column',
  `name` VARCHAR(100) NOT NULL COMMENT 'the name of the column - must be a field name of "table" from database table t_list',
  `type` VARCHAR(100) NOT NULL COMMENT 'the type of the column',
  `label` VARCHAR(100) NOT NULL COMMENT 'the name of the column - will be used for translation',
  `json` JSON NULL COMMENT 'json configuration string for the column - depends on type of column (eg. rt_id)',
  PRIMARY KEY (`column_id`, `list_id`))
ENGINE = MyISAM DEFAULT CHARSET=UTF8MB4;

INSERT INTO `t_list_column` VALUES ('mock_data_col_1','mock_data',1,'gender','rt','§§GENDER','{"rt_key": "gender", "rt_table": "v_gender", "rt_value": "gender_text"}');
INSERT INTO `t_list_column` VALUES ('mock_data_col_2','mock_data',2,'first_name','text','§§FIRSTNAME','{}');
INSERT INTO `t_list_column` VALUES ('mock_data_col_3','mock_data',3,'last_name','text','§§LASTNAME','{}');

-- list groups
DROP TABLE IF EXISTS `t_list_group`;
CREATE TABLE `t_list_group` (
  `list_group_id` VARCHAR(32) NOT NULL COMMENT 'unique id of the list group - will be a auto generated 32 character string',
  `label` VARCHAR(100) NOT NULL COMMENT 'label of the list group - will be used to identify the list group in humen language',
  PRIMARY KEY (`list_group_id`))
ENGINE = MyISAM DEFAULT CHARSET=UTF8MB4;

DROP TABLE IF EXISTS `t_list_group_list`;
CREATE TABLE `t_list_group_list` (
  `list_group_id` VARCHAR(32) NOT NULL COMMENT 'id of the list group',
  `list_id` VARCHAR(32) NOT NULL COMMENT 'id of the list which extends the list group',
  PRIMARY KEY (`list_group_id`,`list_id`))
ENGINE = MyISAM DEFAULT CHARSET=UTF8MB4;


