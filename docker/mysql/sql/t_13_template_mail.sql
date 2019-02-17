USE ticketing_db;

DROP TABLE IF EXISTS `t_template_mail`;
CREATE TABLE `t_template_mail` (
    `tamplate_mail_id` VARCHAR(32) NOT NULL COMMENT 'unique id of the mail template',
    `label` VARCHAR(100) NOT NULL COMMENT 'human languge readable',
    `json` JSON NULL COMMENT 'json configuration string for the template, basic configuration options',
    PRIMARY KEY (`tamplate_mail_id`))
ENGINE = MyISAM DEFAULT CHARSET=UTF8MB4;
