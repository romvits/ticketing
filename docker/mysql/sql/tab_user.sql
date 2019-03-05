USE ticketing_db;

drop table IF EXISTS `tabUser`;
create TABLE `tabUser` (
  `UserID` varchar(32) NOT NULL COMMENT 'unique id of the user',
  `UserType` enum('admin','promoter') DEFAULT NULL COMMENT 'null = visitor, admin = Administrator, promoter = Promoter',
  `UserEmail` varchar(254) NOT NULL COMMENT 'unique email for the user',
  `UserLangCode` varchar(5) NOT NULL DEFAULT 'de-at' COMMENT 'default languge for this user',
  `UserFirstname` varchar(100) NULL COMMENT 'first name',
  `UserLastname` varchar(100) NULL COMMENT 'last name',
  `UserLocations` int(3) NULL COMMENT 'null = no, 0 = all => how many locations are allowed for this user',
  `UserEvents` int(3) NULL COMMENT 'null = no, 0 = all => how many events are allowed for this user',
  `UserEventsActive` int(3) NULL COMMENT 'null = no, 0 = all => how many active events are allowed for this user',
  `UserPassword` varchar(128) NOT NULL,
  `UserPasswordSalt` varchar(128) NOT NULL,
  PRIMARY KEY (`UserID`),
  UNIQUE KEY `email_UNIQUE` (`UserEmail`)
) ENGINE=MyISAM DEFAULT CHARSET=UTF8MB4;

SET @uuid = REPLACE((select UUID()), '-', '');

insert into `tabUser` (`UserID`, `UserType`, `UserEmail`, `UserLangCode`, `UserFirstname`, `UserLastname`, `UserLocations`, `UserEvents`, `UserEventsActive`, `UserPassword`, `UserPasswordSalt`) VALUES (@uuid, 'admin', 'admin@admin.tld', 'de-at', 'Admin', 'Admin', 0, 0, 0,
'd0c6f7e3103f037ed50d3f4635de64ee6e890cd9a7e9a23993de20b716ff6e22a4e9fad925ec5cbc1395a09dcec56ecf80ec53395e2d9e306bcab00ee4e810f7', 'xcVHkOeKHiJN9Hvr5HiSmufLdDHMyhk6ODYzV7DSwujH6tniGjl7qGQ7OQ0Vdb0lLSUnzkRcjmgsP9ZevoHNmMp3WcQwqaob3fVfX6zD5GufrFc0hdXGpQ1NNug5I0vs');

