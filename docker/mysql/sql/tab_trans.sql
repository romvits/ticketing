USE ticketing_db;

DROP TABLE IF EXISTS `tabTrans`;
CREATE TABLE `tabTrans` (
  `TransToken` varchar(32) NOT NULL COMMENT 'token of the translation',
  `TransLang` varchar(2) NOT NULL COMMENT 'lang code of the translation',
  `TransTransChapterID` varchar(32) NULL COMMENT 'name',
  `TransValue` longtext COMMENT '',
  PRIMARY KEY (`TransToken`,`TransLang`)
) ENGINE=MyISAM DEFAULT CHARSET=UTF8MB4;
