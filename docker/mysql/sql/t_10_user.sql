USE ticketing_db;

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

INSERT INTO `t_user` (user_id, email, password, password_salt, firstname, lastname) VALUES ('sz7yA3Nyzq1ACMqYh3Z3DKXn8U6wR92B', 'admin@admin.tld', '1edbb8d64fc56e9b5e6a63b6da63651103f964d00445d534dd57c2ac9f18061bda4f10c31d07c5126076bace2abb5501fb8676bd57a07aa99af24023f98efa30', 'QtyNiA5x6EYpAPmT09R0gAUwXNdBfyv5dOJVS6MEDQcV9d9tATPkAqKxhaPpYVKl', 'Admin', 'Admin');