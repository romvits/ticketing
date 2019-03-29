USE ticketing_db;

DROP TABLE IF EXISTS `memClientConn`;
CREATE TABLE `memClientConn` (
  `ClientConnID` 									VARCHAR(20) NOT NULL,
  `ClientConnToken` 								VARCHAR(32) NULL,
  `ClientConnUserID`	 							VARCHAR(32) NULL,
  `ClientConnLangCode`								VARCHAR(5) DEFAULT 'en',
  `ClientConnLogoutToken`							VARCHAR(128) NULL,
  `ClientConnType` 									ENUM('page', 'admin', 'scanner', 'api-tests') NOT NULL DEFAULT 'page',
  `ClientConnUserAgent` 							VARCHAR(250) NOT NULL,
  `ClientConnAddress` 								VARCHAR(40) NOT NULL,
  
  FOREIGN KEY ClientConn_LangID (`ClientConnLangCode`)    REFERENCES feLang(`LangCode`),  
  PRIMARY KEY (`ClientConnID`)
) ENGINE = MEMORY;
