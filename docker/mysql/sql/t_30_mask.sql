USE ticketing_db;

DROP TABLE IF EXISTS `t_mask`;
CREATE TABLE `t_mask` (
  `mask_id` VARCHAR(32) NOT NULL COMMENT 'unique id of the mask - will be a auto generated 32 character string',
  `json` JSON NULL COMMENT 'json configuration string for the mask, information like chapters and so on',
  PRIMARY KEY (`mask_id`))
ENGINE = MyISAM DEFAULT CHARSET=UTF8MB4;

INSERT INTO `t_mask` (`mask_id`,`json`) VALUES ('mock_mask','{}');

DROP TABLE IF EXISTS `t_mask_chapter`;
CREATE TABLE `t_mask_chapter` (
  `chapter_id` VARCHAR(32) NOT NULL COMMENT 'unique id of the mask_chpater - will be a auto generated 32 character string',
  `mask_id` VARCHAR(32) NOT NULL COMMENT 'relation id of the mask_chapter to mask - must be one of mask_id',
  `order` INT(3) NOT NULL COMMENT 'sort order of the mask_chapter in mask',
  `json` JSON NULL COMMENT 'json configuration string for the mask_chpater, information like type of chapter, id of reference form, list, pane and so on',
  PRIMARY KEY (`chapter_id`))
ENGINE = MyISAM DEFAULT CHARSET=UTF8MB4;
