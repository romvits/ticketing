USE ticketing_db;

-- combination of multiple froms and one record (eg. chapters with other types like lists and so on)
DROP TABLE IF EXISTS `feMask`;
CREATE TABLE `feMask` (
  `MaskID` VARCHAR(32) NOT NULL COMMENT 'unique id of the mask - will be a auto generated 32 character string',
  `MaskJSON` JSON NULL COMMENT 'json configuration string for the mask, information like chapters and so on',
  PRIMARY KEY (`MaskID`))
ENGINE = MyISAM DEFAULT CHARSET=UTF8MB4;

DROP TABLE IF EXISTS `feMaskChapter`;
CREATE TABLE `feMaskChapter` (
  `MaskChapterID` VARCHAR(32) NOT NULL COMMENT 'unique id of the mask_chpater - will be a auto generated 32 character string',
  `MaskChapterMaskID` VARCHAR(32) NOT NULL COMMENT 'relation id of the mask_chapter to mask - must be one of mask_id',
  `MaskChpaterOrder` INT(3) NOT NULL COMMENT 'sort order of the mask_chapter in mask',
  `MaskChpaterJSON` JSON NULL COMMENT 'json configuration string for the mask_chpater, information like type of chapter, id of reference form, list, pane and so on',
  PRIMARY KEY (`MaskChapterID`))
ENGINE = MyISAM DEFAULT CHARSET=UTF8MB4;

--
INSERT INTO `feMask` (`MaskID`,`MaskJSON`) VALUES ('mock_mask','{}');
INSERT INTO `feMaskChapter` VALUES ('mock_mask_chpater_1','mock_mask',1,'{}');
INSERT INTO `feMaskChapter` VALUES ('mock_mask_chpater_2','mock_mask',2,'{}');

