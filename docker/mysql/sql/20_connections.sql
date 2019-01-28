USE ticketing_db;

CREATE TABLE `ticketing_db`.`t_connections` (
  `token` VARCHAR(32) NOT NULL,
  `socket_id` VARCHAR(20) NOT NULL,
  `user_id` VARCHAR(32) NULL,
  `type` ENUM('page', 'admin', 'scanner', 'api-tests') NOT NULL DEFAULT 'page',
  `user-agent` VARCHAR(250) NOT NULL,
  `address` VARCHAR(40) NOT NULL,
  PRIMARY KEY (`token`),
  UNIQUE INDEX `socket_id_UNIQUE` (`socket_id` ASC) VISIBLE)
ENGINE = MEMORY;