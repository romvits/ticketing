USE ticketing_db;

SET FOREIGN_KEY_CHECKS = 0;

DROP TABLE IF EXISTS `feList`;
CREATE TABLE `feList` (
  `ListID` 						VARCHAR(32) NOT NULL COMMENT 'unique id of the list - will be a auto generated 32 character string',
  `ListName`					VARCHAR(100) NOT NULL COMMENT 'name of the list - will be used to identify the list in humen language',
  `ListLabel`					VARCHAR(100) NOT NULL COMMENT 'the name of the list - will be used for translation',
  `ListTable` 					VARCHAR(100) NOT NULL COMMENT 'the name of the table or the view from where the data will be feched',
  `ListPK` 						VARCHAR(100) NOT NULL DEFAULT 'id' COMMENT 'which field is the PK field in this table? (default = id) OR (record_id)',
  `ListMaskID`					VARCHAR(32) COMMENT 'default mask_id for this list - if row has mask_id field this value will be used',
  `ListLimit` 					TINYINT(3) NOT NULL DEFAULT 50 COMMENT 'limit of records which will be fechted at once',
  `ListJSON` 					JSON NULL COMMENT 'json configuration string for the tabel, information like columns and so on',

  PRIMARY KEY (`ListID`))
ENGINE = InnoDB DEFAULT CHARSET=UTF8MB4;

DROP TABLE IF EXISTS `feListColumn`;
CREATE TABLE `feListColumn` (
  `ListColumnID` 				VARCHAR(32) NOT NULL COMMENT 'unique id of the list - will be a auto generated 32 character string',
  `ListColumnListID`			VARCHAR(32) NOT NULL COMMENT 'id of the list this column is related to',
  `ListColumnName` 				VARCHAR(100) NOT NULL COMMENT 'the name of the column - must be a field name of "table" from database table',
  `ListColumnLabel` 			VARCHAR(100) NOT NULL COMMENT 'the name of the column - will be used for translation',
  `ListColumnOrder` 			TINYINT(3) NOT NULL COMMENT 'sort order of the column',
  `ListColumnType` 				VARCHAR(100) NOT NULL COMMENT 'the type of the column',
  `ListColumnWidth` 			VARCHAR(4) NOT NULL COMMENT 'the initial width of the column - px or auto (auto should be used only by one column for each list)',
  `ListColumnEditable` 			TINYINT(1) NOT NULL COMMENT 'is this field editable?',
  `ListColumnJSON` 				JSON NULL COMMENT 'json configuration string for the column - depends on type of column (eg. rt_id)',

  FOREIGN KEY ListColumn_ListColumnListID (`ListColumnListID`)    REFERENCES feList(`ListID`),
  PRIMARY KEY (`ListColumnID`, `ListColumnListID`))
ENGINE = InnoDB DEFAULT CHARSET=UTF8MB4;

SET FOREIGN_KEY_CHECKS = 1;

-- Mock Data
INSERT INTO `feList` VALUES ('mock_data','Testdata List','§§LIST_MOCKDATA','tabMockData','MockDataID','mock_mask',100,'{"orderby": [{"MockDataLastname":""},{"MockDataFirstname":""},{"MockDataGender":""}],"editable":0}');
INSERT INTO `feListColumn` VALUES ('mock_data_col_1','mock_data','MockDataGender','§§USER_GENDER',1,'rt',80,0,'{"rt_key": "gender", "rt_table": "rtGender", "rt_value": "gender_text"}');
INSERT INTO `feListColumn` VALUES ('mock_data_col_2','mock_data','MockDataLastname','§§USER_LASTNAME',2,'text',250,0,'{}');
INSERT INTO `feListColumn` VALUES ('mock_data_col_3','mock_data','MockDataFirstname','§§USER_FIRSTNAME',3,'text',250,0,'{}');
INSERT INTO `feListColumn` VALUES ('mock_data_col_4','mock_data','MockDataEmail','§§USER_EMAIL',4,'text','auto',0,'{}');
INSERT INTO `feListColumn` VALUES ('mock_data_col_5','mock_data','MockDataPhone','§§USER_PHONE',5,'text',200,0,'{}');

-- User
INSERT INTO `feList` VALUES ('user','User List','§§LIST_USER','viewUserOrderList','UserID','user_mask',100,'{"orderby": [{"UserLastname":""},{"UserFirstname":""},{"UserCompany":""},{"UserEmail":""}],"editable":0}');
INSERT INTO `feListColumn` VALUES ('user_user_id','user','UserID','§§USER_ID',1,'text',280,1,'{}');
INSERT INTO `feListColumn` VALUES ('user_company','user','UserCompany','§§USER_COMPANY',2,'text',250,0,'{}');
INSERT INTO `feListColumn` VALUES ('user_lastname','user','UserLastname','§§USER_LASTNAME',3,'text',250,0,'{}');
INSERT INTO `feListColumn` VALUES ('user_firstname','user','UserFirstname','§§USER_FIRSTNAME',4,'text',250,0,'{}');
INSERT INTO `feListColumn` VALUES ('user_type','user','UserType','§§USER_TYPE',5,'text',70,0,'{}');
INSERT INTO `feListColumn` VALUES ('user_email','user','UserEmail','§§USER_EMAIL',6,'text','auto',0,'{}');
INSERT INTO `feListColumn` VALUES ('user_order_count','user','UserOrderCount','§§USER_ORDER_COUNT',7,'int',50,0,'{}');
INSERT INTO `feListColumn` VALUES ('user_order_from_count','user','UserOrderFromCount','§§USER_ORDER_FROM_COUNT',8,'int',50,0,'{}');
INSERT INTO `feListColumn` VALUES ('user_credit_from_count','user','UserCreditFromCount','§§USER_CREDIT_FROM_COUNT',9,'int',50,0,'{}');

