USE ticketing_db;

DROP TABLE IF EXISTS `t_user`;
CREATE TABLE `t_user` (
  `user_id` varchar(32) NOT NULL COMMENT 'unique id of the user',
  `type` enum('admin','promoter') DEFAULT NULL COMMENT 'null = visitor, admin = Administrator, promoter = Promoter',
  `email` varchar(150) NOT NULL COMMENT 'unique email for the user',
  `firstname` varchar(100) NULL COMMENT 'first name',
  `lastname` varchar(100) NULL COMMENT 'last name',
  `locations` int(3) NULL COMMENT 'null = no, 0 = all => how many locations are allowed for this user',
  `events` int(3) NULL COMMENT 'null = no, 0 = all => how many events are allowed for this user',
  `events_active` int(3) NULL COMMENT 'null = no, 0 = all => how many active events are allowed for this user',
  `password` varchar(128) NOT NULL,
  `password_salt` varchar(128) NOT NULL,
  PRIMARY KEY (`user_id`),
  UNIQUE KEY `email_UNIQUE` (`email`)
) ENGINE=MyISAM DEFAULT CHARSET=UTF8MB4;

SET @uuid = REPLACE((SELECT UUID()), '-', '');

INSERT INTO `t_user` (`user_id`, `type`, `email`, `firstname`, `lastname`, `locations`, `events`, `events_active`, `password`, `password_salt`) VALUES (@uuid, 'admin', 'admin@admin.tld', 'Admin', 'Admin', 0, 0, 0,
'd0c6f7e3103f037ed50d3f4635de64ee6e890cd9a7e9a23993de20b716ff6e22a4e9fad925ec5cbc1395a09dcec56ecf80ec53395e2d9e306bcab00ee4e810f7', 'xcVHkOeKHiJN9Hvr5HiSmufLdDHMyhk6ODYzV7DSwujH6tniGjl7qGQ7OQ0Vdb0lLSUnzkRcjmgsP9ZevoHNmMp3WcQwqaob3fVfX6zD5GufrFc0hdXGpQ1NNug5I0vs');

