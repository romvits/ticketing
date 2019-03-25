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
  `ListColumnName` VARCHAR(100) NOT NULL COMMENT 'the name of the column - must be a field name of "table" from database table',
  `ListColumnType` VARCHAR(100) NOT NULL COMMENT 'the type of the column',
  `ListColumnWidth` VARCHAR(4) NOT NULL COMMENT 'the initial width of the column - px or auto (auto should be used only by one column for each list)',
  `ListColumnEditable` TINYINT(1) NOT NULL COMMENT 'is this field editable?',
  `ListColumnLabel` VARCHAR(100) NOT NULL COMMENT 'the name of the column - will be used for translation',
  `ListColumnJSON` JSON NULL COMMENT 'json configuration string for the column - depends on type of column (eg. rt_id)',
  PRIMARY KEY (`ListColumnID`, `ListColumnListID`))
ENGINE = MyISAM DEFAULT CHARSET=UTF8MB4;

-- Mock Data
INSERT INTO `feList` VALUES ('mock_data','§§LIST_MOCKDATA','tabMockData','MockDataID','mock_mask',100,'{"orderby": [{"MockDataLastname":""},{"MockDataFirstname":""},{"MockDataGender":""}],"editable":0}');
INSERT INTO `feListColumn` VALUES ('mock_data_col_1','mock_data',1,'MockDataGender','rt',80,0,'§§USER_GENDER','{"rt_key": "gender", "rt_table": "rtGender", "rt_value": "gender_text"}');
INSERT INTO `feListColumn` VALUES ('mock_data_col_2','mock_data',2,'MockDataLastname','text',250,0,'§§USER_LASTNAME','{}');
INSERT INTO `feListColumn` VALUES ('mock_data_col_3','mock_data',3,'MockDataFirstname','text',250,0,'§§USER_FIRSTNAME','{}');
INSERT INTO `feListColumn` VALUES ('mock_data_col_4','mock_data',4,'MockDataEmail','text','auto',0,'§§USER_EMAIL','{}');
INSERT INTO `feListColumn` VALUES ('mock_data_col_5','mock_data',5,'MockDataPhone','text',200,0,'§§USER_PHONE','{}');

-- User
INSERT INTO `feList` VALUES ('user','§§LIST_USER','viewUserOrderList','UserID','user_mask',100,'{"orderby": [{"UserLastname":""},{"UserFirstname":""},{"UserCompany":""},{"UserEmail":""}],"editable":0}');
INSERT INTO `feListColumn` VALUES ('user_user_id','user',1,'UserID','text',280,1,'§§USER_ID','{}');
INSERT INTO `feListColumn` VALUES ('user_company','user',2,'UserCompany','text',250,0,'§§USER_COMPANY','{}');
INSERT INTO `feListColumn` VALUES ('user_lastname','user',3,'UserLastname','text',250,0,'§§USER_LASTNAME','{}');
INSERT INTO `feListColumn` VALUES ('user_firstname','user',4,'UserFirstname','text',250,0,'§§USER_FIRSTNAME','{}');
INSERT INTO `feListColumn` VALUES ('user_type','user',5,'UserType','text',70,0,'§§USER_TYPE','{}');
INSERT INTO `feListColumn` VALUES ('user_email','user',6,'UserEmail','text','auto',0,'§§USER_EMAIL','{}');
INSERT INTO `feListColumn` VALUES ('user_order_count','user',7,'UserOrderCount','int',50,0,'§§USER_ORDER_COUNT','{}');
INSERT INTO `feListColumn` VALUES ('user_order_from_count','user',8,'UserOrderFromCount','int',50,0,'§§USER_ORDER_FROM_COUNT','{}');
INSERT INTO `feListColumn` VALUES ('user_credit_from_count','user',9,'UserCreditFromCount','int',50,0,'§§USER_CREDIT_FROM_COUNT','{}');
