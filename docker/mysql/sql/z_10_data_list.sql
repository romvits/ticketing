USE ticketing_db;

-- Mock Data
INSERT INTO `t_list` (`list_id`,`label`,`table`,`pk`,`mask_id`,`limit`,`json`) VALUES ('mock_data','Mock Liste','t_mock_data','mock_id','mock_mask',100,'{"orderby": ["last_name","first_name","gender"],"editable":0}');
INSERT INTO `t_list_column` VALUES ('mock_data_col_1','mock_data',1,'gender','rt',80,0,'§§GENDER','{"rt_key": "gender", "rt_table": "v_gender", "rt_value": "gender_text"}');
INSERT INTO `t_list_column` VALUES ('mock_data_col_2','mock_data',2,'last_name','text',250,0,'§§LASTNAME','{}');
INSERT INTO `t_list_column` VALUES ('mock_data_col_3','mock_data',3,'first_name','text',250,0,'§§FIRSTNAME','{}');
INSERT INTO `t_list_column` VALUES ('mock_data_col_4','mock_data',4,'email','text','auto',0,'§§EMAIL','{}');
INSERT INTO `t_list_column` VALUES ('mock_data_col_5','mock_data',5,'phone','text',200,0,'§§PHONE','{}');

-- User
INSERT INTO `t_list` (`list_id`,`label`,`table`,`pk`,`mask_id`,`limit`,`json`) VALUES ('user','§§USERS','t_user','user_id','user_mask',100,'{"orderby": ["lastname","firstname","email"],"editable":0}');
INSERT INTO `t_list_column` VALUES ('user_user_id','user',1,'user_id','text',270,1,'§§USER_ID','{}');
INSERT INTO `t_list_column` VALUES ('user_lastname','user',1,'lastname','text',250,0,'§§LASTNAME','{}');
INSERT INTO `t_list_column` VALUES ('user_firstname','user',2,'firstname','text',250,0,'§§FIRSTNAME','{}');
INSERT INTO `t_list_column` VALUES ('user_email','user',3,'email','text','auto',0,'§§EMAIL','{}');
