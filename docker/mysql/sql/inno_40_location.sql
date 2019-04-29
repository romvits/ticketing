USE ticketing_db;

SET FOREIGN_KEY_CHECKS = 0;

DROP TABLE IF EXISTS `innoLocation`;
CREATE TABLE `innoLocation` (
  `LocationID`                             varchar(32) NOT NULL COMMENT 'unique id of the location', 
  `LocationName`                           varchar(150) NOT NULL COMMENT 'name',
  `LocationStreet`                         varchar(150) NULL COMMENT 'street',
  `LocationCity`                           varchar(100) NULL COMMENT 'city',
  `LocationZIP`                            varchar(15) NULL COMMENT 'zip',
  `LocationCountryCountryISO2`             varchar(2) NULL COMMENT 'country',
  `LocationTimezone`                       varchar(50) NULL COMMENT 'timezone of the location for UTC time calculation',
  `LocationPhone1`                         varchar(30) NULL COMMENT 'phone number 1 of the location',
  `LocationPhone2`                         varchar(30) NULL COMMENT 'phone number 2 of the location',
  `LocationFax`                            varchar(30) NULL COMMENT 'fax number of the location',
  `LocationEmail`                          varchar(250) NULL COMMENT 'email for the location (office address)',
  `LocationHomepage`                       varchar(250) NULL COMMENT 'homepage for the location (office address)',
  PRIMARY KEY (`LocationID`)
) ENGINE=InnoDB DEFAULT CHARSET=UTF8MB4;

SET FOREIGN_KEY_CHECKS = 1;
