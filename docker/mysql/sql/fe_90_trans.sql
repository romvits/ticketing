USE ticketing_db;

SET FOREIGN_KEY_CHECKS = 0;

DROP TABLE IF EXISTS `feTransGroup`;
CREATE TABLE `feTransGroup` (
  `TransGroupID` 				VARCHAR(32) NOT NULL COMMENT 'unique group id of the translation group',
  `TransGroupName` 				VARCHAR(100) NULL COMMENT 'name',

  PRIMARY KEY (`TransGroupID`)
) ENGINE=InnoDB DEFAULT CHARSET=UTF8MB4;

INSERT INTO feTransGroup (TransGroupID, TransGroupName) VALUES 
('user', 'User Translations'),
('mock_data', 'List Headers'),
('mock_demo', 'Form Labels');

DROP TABLE IF EXISTS `feTrans`;
CREATE TABLE `feTrans` (
  `TransID` 					VARCHAR(32) NULL COMMENT 'id of parent item (eg event buttons, texts and so on)',
  `TransToken` 					VARCHAR(32) NOT NULL COMMENT 'token of the translation',
  `TransLangCode` 				VARCHAR(5) NOT NULL COMMENT 'lang code of the translation',
  `TransTransGroupID` 			VARCHAR(32) NULL COMMENT 'id of trans group',
  `TransValue` 					LONGTEXT COMMENT '',
  
  FOREIGN KEY TransTransGroupID_TransGroupID (`TransTransGroupID`)   	REFERENCES feTransGroup(`TransGroupID`),
  KEY `group` (`TransLangCode`,`TransTransGroupID`),
  PRIMARY KEY (`TransID`,`TransToken`,`TransLangCode`)
) ENGINE=InnoDB DEFAULT CHARSET=UTF8MB4;

SET FOREIGN_KEY_CHECKS = 1;

INSERT INTO feTrans (TransToken, TransLangCode, TransTransGroupID, TransValue) VALUES 

('§§LIST_USER','de','user','Benutzerliste'),
('§§LIST_MOCKDATA','de','mock_data','Mock Data List'),

('§§USER_GENDER','de',null,'Geschlect'),
('§§USER_LASTNAME','de',null,'Nachname'),
('§§USER_FIRSTNAME','de',null,'Vorname'),
('§§USER_EMAIL','de',null,'eMail-Adresse'),
('§§USER_ID','de',null,'User ID'),
('§§USER_PHONE','de',null,'Telefon'),
('§§USER_TYPE','de',null,'Art'),
('§§USER_COMPANY','de',null,'Firma'),
('§§USER_ORDER_COUNT','de',null,'Extern Best.'),
('§§USER_ORDER_FROM_COUNT','de',null,'Intern Best.'),
('§§USER_CREDIT_FROM_COUNT','de',null,'Intern Guts.'),

('§§LIST_USER','en','user','List of users'),
('§§LIST_MOCKDATA','en','mock_data','Moch Daten Liste'),

('§§USER_GENDER','en',null,'Gender'),
('§§USER_LASTNAME','en',null,'Last name'),
('§§USER_FIRSTNAME','en',null,'First name'),
('§§USER_EMAIL','en',null,'eMail-Address'),
('§§USER_ID','en',null,'User ID'),
('§§USER_PHONE','en',null,'Phone'),
('§§USER_TYPE','en',null,'Type'),
('§§USER_COMPANY','en',null,'Company'),
('§§USER_ORDER_COUNT','en',null,'Extern Orders'),
('§§USER_ORDER_FROM_COUNT','en',null,'Intern Orders'),
('§§USER_CREDIT_FROM_COUNT','en',null,'Intern Credits');


