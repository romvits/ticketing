USE ticketing_db;

DROP TABLE IF EXISTS `t_user`;
CREATE TABLE `t_user` (
  `user_id` varchar(32) NOT NULL,
  `email` varchar(150) NOT NULL,
  `password` varchar(128) NOT NULL,
  `password_salt` varchar(128) NOT NULL,
  `firstname` varchar(100) NULL,
  `lastname` varchar(100) NULL,
  PRIMARY KEY (`user_id`),
  UNIQUE KEY `email_UNIQUE` (`email`)
) ENGINE=MyISAM DEFAULT CHARSET=UTF8MB4;

INSERT INTO `t_user` (user_id, email, password, password_salt, firstname, lastname) VALUES ('sz7yA3Nyzq1ACMqYh3Z3DKXn8U6wR92B', 'admin@admin.tld', 'd0c6f7e3103f037ed50d3f4635de64ee6e890cd9a7e9a23993de20b716ff6e22a4e9fad925ec5cbc1395a09dcec56ecf80ec53395e2d9e306bcab00ee4e810f7', 'xcVHkOeKHiJN9Hvr5HiSmufLdDHMyhk6ODYzV7DSwujH6tniGjl7qGQ7OQ0Vdb0lLSUnzkRcjmgsP9ZevoHNmMp3WcQwqaob3fVfX6zD5GufrFc0hdXGpQ1NNug5I0vs', 'Admin', 'Admin');
