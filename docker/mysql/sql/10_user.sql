USE ticketing_db;

CREATE TABLE `t_user` (
  `syscode` varchar(32) NOT NULL,
  `email` varchar(150) NOT NULL,
  `password` varchar(256) NOT NULL,
  `password_salt` varchar(32) NOT NULL,
  `nickname` varchar(30) NULL,
  `firstname` varchar(100) NULL,
  `lastname` varchar(100) NULL,
  PRIMARY KEY (`syscode`),
  UNIQUE KEY `nickname_UNIQUE` (`nickname`),
  UNIQUE KEY `email_UNIQUE` (`email`)
) ENGINE=MyISAM DEFAULT CHARSET=UTF8MB4;

INSERT INTO `t_user` (syscode, email, nickname, password, password_salt) VALUES ('admin', 'admin@admin.tld', 'admin', 'admin', 'admin');