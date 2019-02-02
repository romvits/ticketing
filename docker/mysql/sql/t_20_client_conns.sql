USE ticketing_db;

CREATE TABLE `ticketing_db`.`t_client_conns` (
  `client_id` VARCHAR(20) NOT NULL,
  `user_id` VARCHAR(32) NULL,
  `logout_token` VARCHAR(128) NULL,
  `type` ENUM('page', 'admin', 'scanner', 'api-tests') NOT NULL DEFAULT 'page',
  `user-agent` VARCHAR(250) NOT NULL,
  `address` VARCHAR(40) NOT NULL,
  PRIMARY KEY (`client_id`),
  UNIQUE INDEX `client_id_UNIQUE` (`client_id` ASC) VISIBLE)
ENGINE = MEMORY;