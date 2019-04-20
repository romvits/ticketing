USE ticketing_db;

DROP TABLE IF EXISTS `innoScan`;
CREATE TABLE `innoScan` (
  `ScanID`                    int(10) UNSIGNED AUTO_INCREMENT COMMENT 'id of the scan',
  `ScanCode`                  varchar(15) NOT NULL COMMENT '',
  `ScanEventID`               varchar(32) NULL COMMENT '',
  `ScanType`                  enum('ticket','seat','special') NULL COMMENT 'type of order detail => ti=entry ticket | se=seat at location | sp=special = >upselling like Tortengarantie',
  `ScanTypeID`                varchar(32) NULL COMMENT 'ID of the scanned ticket, specail or seat',
  `ScanState`                 enum('ok','multi','in','out','double','invalid') NOT NULL DEFAULT 'ok' COMMENT '',
  `ScanDateTimeUTC`           datetime NULL COMMENT '',

  PRIMARY KEY (`ScanID`)
) ENGINE=InnoDB DEFAULT CHARSET=UTF8MB4;
