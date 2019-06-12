USE ticketing_db;

DROP TABLE IF EXISTS `innoQRCodeSetting`;

CREATE TABLE `innoQRCodeSetting` (
  `QRCodeSettingID`               varchar(32) NOT NULL COMMENT '',
  `QRCodeSettingTypeID`           varchar(32) NOT NULL COMMENT '',
  `QRCodeSettingWidth`            int(3) NOT NULL DEFAULT 92 COMMENT '',
  `QRCodeSettingLeft`             int(4) UNSIGNED NULL COMMENT '',
  `QRCodeSettingTop`              int(4) UNSIGNED NULL COMMENT '',
  PRIMARY KEY (`QRCodeSettingID`)  
) ENGINE=InnoDB DEFAULT CHARSET=UTF8MB4;
