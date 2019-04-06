USE ticketing_db;

SET FOREIGN_KEY_CHECKS = 0;

drop table IF EXISTS `innoUser`;
create TABLE `innoUser` (
  `UserID`                  varchar(32) NOT NULL COMMENT 'unique id of the user',
  `UserType`                enum('admin','promoter') DEFAULT NULL COMMENT 'null = standard user, admin = Administrator (has access to everything), promoter = Promoter (can add events and locations has access to events which are related in table `innoPromoterUser`)',
  `UserEmail`               varchar(250) NOT NULL COMMENT 'unique email for the user',
  `UserLangCode`            varchar(5) NOT NULL DEFAULT 'de-at' COMMENT 'default languge for this user',

  `UserCompany`             varchar(150) NULL COMMENT 'company',
  `UserCompanyUID`          varchar(30) NULL COMMENT 'company UID',

  `UserGender`              enum('m','f') NOT NULL COMMENT 'gender m=male | f=female',
  `UserTitle`               varchar(50) NULL COMMENT 'academical title',
  `UserFirstname`           varchar(50) NOT NULL COMMENT 'first name',
  `UserLastname`            varchar(50) NOT NULL COMMENT 'last name',

  `UserStreet`              varchar(120) NULL COMMENT 'street',
  `UserCity`                varchar(100) NULL COMMENT 'city',
  `UserZIP`                 varchar(20) NULL COMMENT 'zip',
  `UserCountryCountryISO2`  varchar(2) NULL COMMENT 'country',

  `UserEmailConfirmed`      tinyint(1) NOT NULL DEFAULT 0 COMMENT 'email address confirmed',
  `UserNewsletter`          tinyint(1) NOT NULL DEFAULT 0 COMMENT 'newsletter',

  `UserPassword` varchar(128) NULL,
  `UserPasswordSalt` varchar(128) NULL,

  UNIQUE KEY `EMAIL_UNIQUE` (`UserEmail`),
  PRIMARY KEY (`UserID`)
) ENGINE=InnoDB DEFAULT CHARSET=UTF8MB4;

SET FOREIGN_KEY_CHECKS = 1;
