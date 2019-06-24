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
  `TransID` 					VARCHAR(32) NOT NULL DEFAULT '' COMMENT 'id of parent item (eg EventID, TicketID, SeatID)',
  `TransToken` 					VARCHAR(100) NOT NULL COMMENT 'token of the translation',
  `TransLangCode` 				VARCHAR(5) NOT NULL COMMENT 'lang code of the translation',
  `TransTransGroupID` 			VARCHAR(32) NULL COMMENT 'id of trans group',
  `TransValue` 					LONGTEXT COMMENT '',
  FOREIGN KEY TransTransGroupID_TransGroupID (`TransTransGroupID`)		REFERENCES feTransGroup(`TransGroupID`),
  FOREIGN KEY TransTransLangCode_LangCodeLangCode (`TransLangCode`)		REFERENCES feLangCode(`LangCode`),
  KEY `group` (`TransLangCode`,`TransTransGroupID`),  
  PRIMARY KEY (`TransID`,`TransToken`,`TransLangCode`)
) ENGINE=InnoDB DEFAULT CHARSET=UTF8MB4;

SET FOREIGN_KEY_CHECKS = 1;

INSERT INTO feTrans (TransID, TransToken, TransLangCode, TransTransGroupID, TransValue) VALUES 

('','§§LIST_USER','de-at','user','Benutzerliste'),
('','§§LIST_MOCKDATA','de-at','mock_data','Mock Data List'),

('','§§USER_GENDER','de-at',null,'Geschlecht'),
('','§§USER_LASTNAME','de-at',null,'Nachname'),
('','§§USER_FIRSTNAME','de-at',null,'Vorname'),
('','§§USER_EMAIL','de-at',null,'eMail-Adresse'),
('','§§USER_ID','de-at',null,'User ID'),
('','§§USER_PHONE','de-at',null,'Telefon'),
('','§§USER_TYPE','de-at',null,'Art'),
('','§§USER_COMPANY','de-at',null,'Firma'),
('','§§USER_ORDER_COUNT','de-at',null,'Extern Best.'),
('','§§USER_ORDER_FROM_COUNT','de-at',null,'Intern Best.'),
('','§§USER_CREDIT_FROM_COUNT','de-at',null,'Intern Guts.'),

('','§§LIST_USER','en-us','user','List of users'),
('','§§LIST_MOCKDATA','en-us','mock_data','Moch Daten Liste'),

('','§§USER_GENDER','en-us',null,'Gender'),
('','§§USER_LASTNAME','en-us',null,'Last name'),
('','§§USER_FIRSTNAME','en-us',null,'First name'),
('','§§USER_EMAIL','en-us',null,'eMail-Address'),
('','§§USER_ID','en-us',null,'User ID'),
('','§§USER_PHONE','en-us',null,'Phone'),
('','§§USER_TYPE','en-us',null,'Type'),
('','§§USER_COMPANY','en-us',null,'Company'),
('','§§USER_ORDER_COUNT','en-us',null,'Extern Orders'),
('','§§USER_ORDER_FROM_COUNT','en-us',null,'Intern Orders'),
('','§§USER_CREDIT_FROM_COUNT','en-us',null,'Intern Credits');


