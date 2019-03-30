USE ticketing_db;

DROP TABLE IF EXISTS `feLang`;
CREATE TABLE `feLang` (
    `LangCode` VARCHAR(5) NOT NULL COMMENT 'unique available language code https://en.wikipedia.org/wiki/Language_localisation',
    `LangSortOrder` TINYINT(3) UNSIGNED, 
    PRIMARY KEY (`LangCode`))
ENGINE=InnoDB DEFAULT CHARSET=UTF8MB4;

INSERT INTO `feLang`  VALUES ('de', 1),('de-at', 4),('de-de', 3),('de-ch', 5),('en', 2),('en-gb', 6),('en-us', 7);
