USE ticketing_db;

CREATE TABLE `t_user` (
  `syscode` varchar(32) NOT NULL,
  `email` varchar(150) NOT NULL,
  `password` varchar(256) NOT NULL,
  `nickname` varchar(30) NULL,
  `firstname` varchar(100) NULL,
  `lastname` varchar(100) NULL,
  PRIMARY KEY (`syscode`),
  UNIQUE KEY `nickname_UNIQUE` (`nickname`),
  UNIQUE KEY `email_UNIQUE` (`email`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

INSERT INTO `t_user` (syscode, email, nickname, password) VALUES ('admin', 'admin@admin.tld', 'admin', 'admin');