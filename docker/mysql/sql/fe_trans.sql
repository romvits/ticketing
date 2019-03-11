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

INSERT INTO feTrans (TransToken, TransLangCode, TransTransGroupID, TransValue) VALUES ('§§LIST_USER','de','user','Benutzerliste');
INSERT INTO feTrans (TransToken, TransLangCode, TransTransGroupID, TransValue) VALUES ('§§LIST_MOCKDATA','de','mock_data','Mock Data List');

INSERT INTO feTrans (TransToken, TransLangCode, TransTransGroupID, TransValue) VALUES ('§§USER_GENDER','de',null,'Geschlect');
INSERT INTO feTrans (TransToken, TransLangCode, TransTransGroupID, TransValue) VALUES ('§§USER_LASTNAME','de',null,'Nachname');
INSERT INTO feTrans (TransToken, TransLangCode, TransTransGroupID, TransValue) VALUES ('§§USER_FIRSTNAME','de',null,'Vorname');
INSERT INTO feTrans (TransToken, TransLangCode, TransTransGroupID, TransValue) VALUES ('§§USER_EMAIL','de',null,'eMail-Adresse');
INSERT INTO feTrans (TransToken, TransLangCode, TransTransGroupID, TransValue) VALUES ('§§USER_ID','de',null,'User ID');
INSERT INTO feTrans (TransToken, TransLangCode, TransTransGroupID, TransValue) VALUES ('§§USER_PHONE','de',null,'Telefon');
INSERT INTO feTrans (TransToken, TransLangCode, TransTransGroupID, TransValue) VALUES ('§§USER_TYPE','de',null,'Art');
INSERT INTO feTrans (TransToken, TransLangCode, TransTransGroupID, TransValue) VALUES ('§§USER_COMPANY','de',null,'Firma');
INSERT INTO feTrans (TransToken, TransLangCode, TransTransGroupID, TransValue) VALUES ('§§USER_ORDER_COUNT','de',null,'Extern Best.');
INSERT INTO feTrans (TransToken, TransLangCode, TransTransGroupID, TransValue) VALUES ('§§USER_ORDER_FROM_COUNT','de',null,'Intern Best.');
INSERT INTO feTrans (TransToken, TransLangCode, TransTransGroupID, TransValue) VALUES ('§§USER_CREDIT_FROM_COUNT','de',null,'Intern Guts.');


INSERT INTO feTrans (TransToken, TransLangCode, TransTransGroupID, TransValue) VALUES ('§§LIST_USER','en','user','List of users');
INSERT INTO feTrans (TransToken, TransLangCode, TransTransGroupID, TransValue) VALUES ('§§LIST_MOCKDATA','en','mock_data','Moch Daten Liste');

INSERT INTO feTrans (TransToken, TransLangCode, TransTransGroupID, TransValue) VALUES ('§§USER_GENDER','en',null,'Gender');
INSERT INTO feTrans (TransToken, TransLangCode, TransTransGroupID, TransValue) VALUES ('§§USER_LASTNAME','en',null,'Last name');
INSERT INTO feTrans (TransToken, TransLangCode, TransTransGroupID, TransValue) VALUES ('§§USER_FIRSTNAME','en',null,'First name');
INSERT INTO feTrans (TransToken, TransLangCode, TransTransGroupID, TransValue) VALUES ('§§USER_EMAIL','en',null,'eMail-Address');
INSERT INTO feTrans (TransToken, TransLangCode, TransTransGroupID, TransValue) VALUES ('§§USER_ID','en',null,'User ID');
INSERT INTO feTrans (TransToken, TransLangCode, TransTransGroupID, TransValue) VALUES ('§§USER_PHONE','en',null,'Phone');
INSERT INTO feTrans (TransToken, TransLangCode, TransTransGroupID, TransValue) VALUES ('§§USER_TYPE','en',null,'Type');
INSERT INTO feTrans (TransToken, TransLangCode, TransTransGroupID, TransValue) VALUES ('§§USER_COMPANY','en',null,'Company');
INSERT INTO feTrans (TransToken, TransLangCode, TransTransGroupID, TransValue) VALUES ('§§USER_ORDER_COUNT','en',null,'Extern Orders');
INSERT INTO feTrans (TransToken, TransLangCode, TransTransGroupID, TransValue) VALUES ('§§USER_ORDER_FROM_COUNT','en',null,'Intern Orders');
INSERT INTO feTrans (TransToken, TransLangCode, TransTransGroupID, TransValue) VALUES ('§§USER_CREDIT_FROM_COUNT','en',null,'Intern Credits');


