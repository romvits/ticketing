USE ticketing_db;

DROP TABLE IF EXISTS `t_module`;
CREATE TABLE `t_module` (
    `modul_id` VARCHAR(32) NOT NULL COMMENT 'unique id of the module - eg form, list, pane, pivot, chart, ...',
    `label` VARCHAR(100) NOT NULL COMMENT 'human languge readable',
    `json` JSON NULL COMMENT 'json configuration string for the modul, basic configuration options',
    PRIMARY KEY (`modul_id`))
ENGINE = MyISAM DEFAULT CHARSET=UTF8MB4;

INSERT INTO `t_module` VALUES ('form','§§FORM','{}');
INSERT INTO `t_module` VALUES ('list','§§LIST','{}');
INSERT INTO `t_module` VALUES ('pivot','§§PIVOT','{}');
INSERT INTO `t_module` VALUES ('chart','§§CHART','{}');
