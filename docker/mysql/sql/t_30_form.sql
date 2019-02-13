USE ticketing_db;

DROP TABLE IF EXISTS `t_form`;
CREATE TABLE `t_form` (
    `form_id` VARCHAR(32) NOT NULL COMMENT 'unique id of the form - will be a auto generated 32 character string',
    `record_id` VARCHAR(32) NOT NULL COMMENT 'id of the record which relates to this form',
    `label` VARCHAR(100) NOT NULL COMMENT 'label of the form - will be used to identify the form in humen language',
    `json` JSON NULL COMMENT 'json configuration string for the form, information like fields and so on',
    PRIMARY KEY (`form_id`))
ENGINE = MyISAM DEFAULT CHARSET=UTF8MB4;

INSERT INTO `t_form` (`form_id`,`record_id`,`label`,`json`) VALUES ('mock_form','mock_record','Mock Formular','{}');

DROP TABLE IF EXISTS `t_form_field`;
CREATE TABLE `t_form_field` (
    `field_id` VARCHAR(32) NOT NULL COMMENT 'unique id of the form field - will be a auto generated 32 character string',
    `form_id` VARCHAR(32) NOT NULL COMMENT 'id of the form this field is related to',
    `order` TINYINT(3) NOT NULL COMMENT 'sort order of the field',
    `name` VARCHAR(100) NOT NULL COMMENT 'the name of the field',
    `type` VARCHAR(100) NOT NULL COMMENT 'the type of the field',
    `label` VARCHAR(100) NOT NULL COMMENT 'the name of the field - will be used for translation',
    `json` JSON NULL COMMENT 'json configuration string for the field',
    PRIMARY KEY (`field_id`, `form_id`))
ENGINE = MyISAM DEFAULT CHARSET=UTF8MB4;

INSERT INTO `t_form_field` VALUES ('mock_form_field_1','mock_form',1,'gender','rt','§§GENDER','{}');
INSERT INTO `t_form_field` VALUES ('mock_form_field_2','mock_form',2,'first_name','text','§§FIRSTNAME','{}');
INSERT INTO `t_form_field` VALUES ('mock_form_field_3','mock_form',3,'last_name','text','§§LASTNAME','{}');
INSERT INTO `t_form_field` VALUES ('mock_form_field_4','mock_form',4,'address','text','§§ADDRESS','{}');
