USE ticketing_db;

SET FOREIGN_KEY_CHECKS = 0;

drop table IF EXISTS `innoUser`;
create TABLE `innoUser` (
  `UserID`                  varchar(32) NOT NULL COMMENT 'unique id of the user',
  `UserType`                enum('admin','promoter') DEFAULT NULL COMMENT 'null = standard user, admin = Administrator',
  `UserEmail`               varchar(250) NOT NULL COMMENT 'unique email for the user',
  `UserLangCode`            varchar(5) NOT NULL DEFAULT 'de-at' COMMENT 'default languge for this user',

  `UserCompany`             varchar(100) NULL COMMENT 'company',
  `UserCompanyUID`          varchar(100) NULL COMMENT 'company UID',

  `UserGender`              enum('m','f','c') NULL COMMENT 'gender m=male | f=female',
  `UserTitle`               varchar(20) NULL COMMENT 'academical title',
  `UserFirstname`           varchar(50) NULL COMMENT 'first name',
  `UserLastname`            varchar(50) NULL COMMENT 'last name',

  `UserStreet`              varchar(120) NULL COMMENT 'street',
  `UserCity`                varchar(100) NULL COMMENT 'city',
  `UserZIP`                 varchar(20) NULL COMMENT 'zip',
  `UserCountryCountryISO2`  varchar(2) NULL COMMENT 'country',

  `UserPassword` varchar(128) NULL,
  `UserPasswordSalt` varchar(128) NULL,
--  FOREIGN KEY COUNTRYISO2 (`UserCountryCountryISO2`) REFERENCES feCountry(`CountryISO2`),
  UNIQUE KEY `EMAIL_UNIQUE` (`UserEmail`),
  PRIMARY KEY (`UserID`)
) ENGINE=InnoDB DEFAULT CHARSET=UTF8MB4;

SET FOREIGN_KEY_CHECKS = 1;

SET @uuid = REPLACE((select UUID()), '-', '');

insert into `innoUser` (`UserID`, `UserType`, `UserEmail`, `UserLangCode`, `UserFirstname`, `UserLastname`, `UserPassword`, `UserPasswordSalt`) VALUES (@uuid, 'admin', 'admin@admin.tld', 'de-at', 'Admin', 'Admin', 'd0c6f7e3103f037ed50d3f4635de64ee6e890cd9a7e9a23993de20b716ff6e22a4e9fad925ec5cbc1395a09dcec56ecf80ec53395e2d9e306bcab00ee4e810f7',
'xcVHkOeKHiJN9Hvr5HiSmufLdDHMyhk6ODYzV7DSwujH6tniGjl7qGQ7OQ0Vdb0lLSUnzkRcjmgsP9ZevoHNmMp3WcQwqaob3fVfX6zD5GufrFc0hdXGpQ1NNug5I0vs');
