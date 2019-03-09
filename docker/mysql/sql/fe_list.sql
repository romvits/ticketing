USE ticketing_db;

DROP TABLE IF EXISTS `feList`;
CREATE TABLE `feList` (
  `ListID` VARCHAR(32) NOT NULL COMMENT 'unique id of the list - will be a auto generated 32 character string',
  `ListName` VARCHAR(100) NOT NULL COMMENT 'name of the list - will be used to identify the list in humen language',
  `ListTable` VARCHAR(100) NOT NULL COMMENT 'the name of the table or the view from where the data will be feched',
  `ListPK` VARCHAR(100) NOT NULL DEFAULT 'id' COMMENT 'which field is the PK field in this table? (default = id) OR (record_id)',
  `ListMaskID` VARCHAR(32) COMMENT 'default mask_id for this list - if row has mask_id field this value will be used',
  `ListLimit` TINYINT(3) NOT NULL DEFAULT 50 COMMENT 'limit of records which will be fechted at once',
  `ListJSON` JSON NULL COMMENT 'json configuration string for the tabel, information like columns and so on',
  PRIMARY KEY (`ListID`))
ENGINE = MyISAM DEFAULT CHARSET=UTF8MB4;

DROP TABLE IF EXISTS `feListColumn`;
CREATE TABLE `feListColumn` (
  `ListColumnID` VARCHAR(32) NOT NULL COMMENT 'unique id of the list - will be a auto generated 32 character string',
  `ListColumnListID` VARCHAR(32) NOT NULL COMMENT 'id of the list this column is related to',
  `ListColumnOrder` TINYINT(3) NOT NULL COMMENT 'sort order of the column',
  `ListColumnName` VARCHAR(100) NOT NULL COMMENT 'the name of the column - must be a field name of "table" from database table t_list',
  `ListColumnType` VARCHAR(100) NOT NULL COMMENT 'the type of the column',
  `ListColumnWidth` VARCHAR(4) NOT NULL COMMENT 'the initial width of the column - px or auto (auto should be used only by one column for each list)',
  `ListColumnEditable` TINYINT(1) NOT NULL COMMENT 'is this field editable?',
  `ListColumnLabel` VARCHAR(100) NOT NULL COMMENT 'the name of the column - will be used for translation',
  `ListColumnJSON` JSON NULL COMMENT 'json configuration string for the column - depends on type of column (eg. rt_id)',
  PRIMARY KEY (`ListColumnID`, `ListColumnListID`))
ENGINE = MyISAM DEFAULT CHARSET=UTF8MB4;

-- Mock Data
INSERT INTO `feList` VALUES ('mock_data','§§MOCKDATALIST','tabMockData','MockDataID','mock_mask',100,'{"orderby": ["MockDataLastname","MockDataFirstname","MockDataGender"],"editable":0}');
INSERT INTO `feListColumn` VALUES ('mock_data_col_1','mock_data',1,'MockDataGender','rt',80,0,'§§GENDER','{"rt_key": "gender", "rt_table": "rtGender", "rt_value": "gender_text"}');
INSERT INTO `feListColumn` VALUES ('mock_data_col_2','mock_data',2,'MockDataLastname','text',250,0,'§§LASTNAME','{}');
INSERT INTO `feListColumn` VALUES ('mock_data_col_3','mock_data',3,'MockDataFirstname','text',250,0,'§§FIRSTNAME','{}');
INSERT INTO `feListColumn` VALUES ('mock_data_col_4','mock_data',4,'MockDataEmail','text','auto',0,'§§EMAIL','{}');
INSERT INTO `feListColumn` VALUES ('mock_data_col_5','mock_data',5,'MockDataPhone','text',200,0,'§§PHONE','{}');

-- User
INSERT INTO `feList` VALUES ('user','§§USERSLIST','innoUser','UserID','user_mask',100,'{"orderby": ["UserLastname","UserFirstname","UserEmail"],"editable":0}');
INSERT INTO `feListColumn` VALUES ('user_user_id','user',1,'UserID','text',270,1,'§§USER_ID','{}');
INSERT INTO `feListColumn` VALUES ('user_lastname','user',1,'UserLastname','text',250,0,'§§LASTNAME','{}');
INSERT INTO `feListColumn` VALUES ('user_firstname','user',2,'UserFirstname','text',250,0,'§§FIRSTNAME','{}');
INSERT INTO `feListColumn` VALUES ('user_email','user',3,'UserEmail','text','auto',0,'§§EMAIL','{}');

