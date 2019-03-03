USE ticketing_db;

DROP TABLE IF EXISTS `feTrans`;
CREATE TABLE `feTrans` (
  `TransToken` varchar(32) NOT NULL COMMENT 'token of the translation',
  `TransLangCode` varchar(5) NOT NULL COMMENT 'lang code of the translation',
  `TransTransGroupID` varchar(32) NULL COMMENT 'name',
  `TransValue` longtext COMMENT '',
  PRIMARY KEY (`TransToken`,`TransLangCode`),
  KEY `group` (`TransLangCode`,`TransTransGroupID`)
) ENGINE=MyISAM DEFAULT CHARSET=UTF8MB4;

INSERT INTO feTrans (TransToken, TransLangCode, TransTransGroupID, TransValue) VALUES ('§§USERSLIST','de','user','Benutzerliste');
INSERT INTO feTrans (TransToken, TransLangCode, TransTransGroupID, TransValue) VALUES ('§§MOCKDATALIST','de','mock_data','Mock Data List');

INSERT INTO feTrans (TransToken, TransLangCode, TransTransGroupID, TransValue) VALUES ('§§GENDER','de',null,'Geschlect');
INSERT INTO feTrans (TransToken, TransLangCode, TransTransGroupID, TransValue) VALUES ('§§LASTNAME','de',null,'Vorname');
INSERT INTO feTrans (TransToken, TransLangCode, TransTransGroupID, TransValue) VALUES ('§§FIRSTNAME','de',null,'Nachname');
INSERT INTO feTrans (TransToken, TransLangCode, TransTransGroupID, TransValue) VALUES ('§§EMAIL','de',null,'eMail-Adresse');
INSERT INTO feTrans (TransToken, TransLangCode, TransTransGroupID, TransValue) VALUES ('§§USER_ID','de',null,'User ID');
INSERT INTO feTrans (TransToken, TransLangCode, TransTransGroupID, TransValue) VALUES ('§§PHONE','de',null,'Telefon');


INSERT INTO feTrans (TransToken, TransLangCode, TransTransGroupID, TransValue) VALUES ('§§USERSLIST','en','user','List of users');
INSERT INTO feTrans (TransToken, TransLangCode, TransTransGroupID, TransValue) VALUES ('§§MOCKDATALIST','en','mock_data','Moch Daten Liste');

INSERT INTO feTrans (TransToken, TransLangCode, TransTransGroupID, TransValue) VALUES ('§§GENDER','en',null,'Gender');
INSERT INTO feTrans (TransToken, TransLangCode, TransTransGroupID, TransValue) VALUES ('§§LASTNAME','en',null,'First name');
INSERT INTO feTrans (TransToken, TransLangCode, TransTransGroupID, TransValue) VALUES ('§§FIRSTNAME','en',null,'Last name');
INSERT INTO feTrans (TransToken, TransLangCode, TransTransGroupID, TransValue) VALUES ('§§EMAIL','en',null,'eMail-Address');
INSERT INTO feTrans (TransToken, TransLangCode, TransTransGroupID, TransValue) VALUES ('§§USER_ID','en',null,'User ID');
INSERT INTO feTrans (TransToken, TransLangCode, TransTransGroupID, TransValue) VALUES ('§§PHONE','en',null,'Phone');
