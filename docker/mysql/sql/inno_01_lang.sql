USE ticketing_db;

DROP TABLE IF EXISTS `feLang`;
CREATE TABLE `feLang` (
    `LangCode` VARCHAR(5) NOT NULL COMMENT 'unique available language code https://en.wikipedia.org/wiki/Language_localisation',
    `LangSortOrder` TINYINT(3) UNSIGNED, 
    PRIMARY KEY (`LangCode`))
ENGINE=InnoDB DEFAULT CHARSET=UTF8MB4;

INSERT INTO `feLang`  VALUES ('de'),('de-at'),('de-de'),('de-ch'),('en'),('en-gb'),('en-us');
