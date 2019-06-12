USE ticketing_db;

DROP TABLE IF EXISTS `innoQRCodeSettings`;

CREATE TABLE `innoQRCodeSettings` (
  `QRCodeSettingTypeID`                          varchar(32) NOT NULL COMMENT '',
  `QRCodeSettingWidth`                           int(3) NOT NULL DEFAULT 92 COMMENT '',
  `QRCodeSettingLeft`                            int(4) UNSIGNED NULL COMMENT '',
  `QRCodeSettingTop`                             int(4) UNSIGNED NULL COMMENT ''
) ENGINE=InnoDB DEFAULT CHARSET=UTF8MB4;
