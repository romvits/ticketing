USE ticketing_db;

SET FOREIGN_KEY_CHECKS = 0;

DROP TABLE IF EXISTS `innoEventTrans`;
CREATE TABLE `innoEventTrans` (
  `EventTransEventID`		VARCHAR(32) NOT NULL COMMENT 'id of event',
  `EventTransParentID` 		VARCHAR(32) NOT NULL DEFAULT '' COMMENT 'id of parent item (empty string for event translation values like email subject or event html parts for hompeage ... OR RoomID, FloorID, TicketID, SeatID for translations of event items like room, floor, ticket or seat text translations)',
  `EventTransLangCode`		VARCHAR(5) NOT NULL COMMENT 'lang code of the translation',
  `EventTransToken` 		VARCHAR(100) NOT NULL COMMENT 'token of the translation',
  `EventTransValue` 		LONGTEXT COMMENT 'value for this translation',
  FOREIGN KEY EventTransLangCode_feLangCodeLangCode (`EventTransLangCode`)		REFERENCES feLangCode(`LangCode`),
  PRIMARY KEY (`EventTransEventID`,`EventTransParentID`,`EventTransLangCode`,`EventTransToken`)
) ENGINE=InnoDB DEFAULT CHARSET=UTF8MB4;

SET FOREIGN_KEY_CHECKS = 1;
