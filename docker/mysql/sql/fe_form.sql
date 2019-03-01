USE ticketing_db;

DROP TABLE IF EXISTS `feForm`;
CREATE TABLE `feForm` (
    `FormID` VARCHAR(32) NOT NULL COMMENT 'unique id of the form - will be a auto generated 32 character string',
    `RecordID` VARCHAR(32) NOT NULL COMMENT 'id of the record which relates to this form',
    `FormName` VARCHAR(100) NOT NULL COMMENT 'name of the form - will be used to identify the form in humen language',
    `FromJSON` JSON NULL COMMENT 'json configuration string for the form, information like fields and so on',
    PRIMARY KEY (`FormID`))
ENGINE = MyISAM DEFAULT CHARSET=UTF8MB4;

INSERT INTO `feForm` (`FormID`,`RecordID`,`FormName`,`FromJSON`) VALUES ('mock_form','mock_record','Mock Formular','{}');

DROP TABLE IF EXISTS `feFormField`;
CREATE TABLE `feFormField` (
    `FormFieldID` VARCHAR(32) NOT NULL COMMENT 'unique id of the form field - will be a auto generated 32 character string',
    `FormFieldFormID` VARCHAR(32) NOT NULL COMMENT 'id of the form this field is related to',
    `FormFieldOrder` TINYINT(3) NOT NULL COMMENT 'sort order of the field',
    `FormFieldName` VARCHAR(100) NOT NULL COMMENT 'name of the form field - will be used to identify the form field in humen language',
    `FormFieldType` VARCHAR(100) NOT NULL COMMENT 'the type of the field',
    `FormFieldLabel` VARCHAR(100) NOT NULL COMMENT 'the name of the field - will be used for translation',
    `FormFieldJSON` JSON NULL COMMENT 'json configuration string for the field',
    PRIMARY KEY (`FormFieldID`, `FormFieldFormID`))
ENGINE = MyISAM DEFAULT CHARSET=UTF8MB4;

INSERT INTO `feFormField` VALUES ('mock_form_field_1','mock_form',1,'gender','rt','§§GENDER','{}'),('mock_form_field_2','mock_form',2,'first_name','text','§§FIRSTNAME','{}'),('mock_form_field_3','mock_form',3,'last_name','text','§§LASTNAME','{}'), ('mock_form_field_4','mock_form',4,'address','text','§§ADDRESS','{}');


