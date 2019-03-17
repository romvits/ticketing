USE ticketing_db;

DROP TABLE IF EXISTS `myisamTemplateEmail`;
CREATE TABLE `myisamTemplateEmail` (
  `TemplateEmailID` VARCHAR(32) NOT NULL COMMENT 'unique id of the mail template',
  `TemplateEmailName` VARCHAR(100) NOT NULL COMMENT 'human languge readable',
  `TemplateEmailJSON` JSON NULL COMMENT 'json configuration string for the template, basic configuration options',
  PRIMARY KEY (`TemplateEmailID`))
ENGINE=MyISAM DEFAULT CHARSET=UTF8MB4;
