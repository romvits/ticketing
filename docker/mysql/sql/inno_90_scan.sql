USE ticketing_db;

DROP TABLE IF EXISTS `innoScan`;
CREATE TABLE `innoScan` (
  `ScanID`                    int(10) UNSIGNED AUTO_INCREMENT COMMENT 'id of the scan',
  `ScanCode`                  varchar(15) NOT NULL COMMENT '',
  `ScanState`                 enum('ok','multi','in','out','double','invalid') NOT NULL DEFAULT 'ok' COMMENT '',
  `ScanEventID`               varchar(32) NULL COMMENT '',
  `ScanDateTimeUTC`           datetime NULL COMMENT '',

  PRIMARY KEY (`ScanID`)
) ENGINE=InnoDB DEFAULT CHARSET=UTF8MB4;
