USE ticketing_db;

DROP TABLE IF EXISTS `t_mock_data`;
CREATE TABLE `t_mock_data` (
	`mock_id` VARCHAR(32) NOT NULL COMMENT 'unique id of the record - will be a auto generated 32 character string',
	`first_name` VARCHAR(50),
	`last_name` VARCHAR(50),
	`email` VARCHAR(50),
	`gender` VARCHAR(50),
	`ip_address` VARCHAR(20),
	`avatar` VARCHAR(250),
	`latitude` DECIMAL(10,8),
	`longitude`  DECIMAL(11,8),
	`country` VARCHAR(50),
	`city` VARCHAR(50),
	`zip` VARCHAR(50),
	`address` VARCHAR(50),
	`phone` VARCHAR(50),
	PRIMARY KEY (`mock_id`)
) ENGINE=MyISAM DEFAULT CHARSET=UTF8MB4;

