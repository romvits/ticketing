USE ticketing_db;

DROP TABLE IF EXISTS `memClientConn`;
CREATE TABLE `memClientConn` (
  `ClientConnID` VARCHAR(20) NOT NULL,
  `ClientConnToken` VARCHAR(32) NULL,
  `ClientConnUserID` VARCHAR(32) NULL,
  `ClientConnLogoutToken` VARCHAR(128) NULL,
  `ClientConnType` ENUM('page', 'admin', 'scanner', 'api-tests') NOT NULL DEFAULT 'page',
  `ClientConnUserAgent` VARCHAR(250) NOT NULL,
  `ClientConnAddress` VARCHAR(40) NOT NULL,
  PRIMARY KEY (`ClientConnID`),
  UNIQUE INDEX `ClientConn_IDUNIQUE` (`ClientConnID`) VISIBLE,
  UNIQUE INDEX `ClientConn_TokenUNIQUE` (`ClientConnToken`) VISIBLE
) ENGINE = MEMORY;
