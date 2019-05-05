USE ticketing_db;

SET FOREIGN_KEY_CHECKS = 0;

DROP TABLE IF EXISTS `memClientConn`;
CREATE TABLE `memClientConn` (
  `ClientConnID` 									VARCHAR(20) NOT NULL,
  `ClientConnToken` 								VARCHAR(32) NULL,
  `ClientConnUserID`	 							VARCHAR(32) NULL,
  `ClientConnLangCode`								VARCHAR(5) DEFAULT 'en',
  `ClientConnLogoutToken`							VARCHAR(128) NULL,
  `ClientConnType` 									ENUM('page', 'admin', 'promoter', 'scanner', 'api') NOT NULL DEFAULT 'page',
  `ClientConnSubdomain` 							VARCHAR(50) NOT NULL,
  `ClientConnUserAgent` 							VARCHAR(250) NOT NULL,
  `ClientConnAddress` 								VARCHAR(40) NOT NULL,
  `ClientConnDateTime` 								TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  UNIQUE KEY (`ClientConnUserID`),
  FOREIGN KEY ClientConn_LangID (`ClientConnLangCode`)    REFERENCES feLang(`LangCode`),  
  PRIMARY KEY (`ClientConnID`)
) ENGINE = InnoDB;

SET FOREIGN_KEY_CHECKS = 1;
