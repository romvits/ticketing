USE ticketing_db;

DROP VIEW IF EXISTS `viewLang`;
CREATE
    ALGORITHM = UNDEFINED 
    DEFINER = `root`@`localhost` 
    SQL SECURITY DEFINER
VIEW `viewLang` AS
    SELECT 
        `Lang`.`LangCode` AS `LangCode`,
        `Country`.`CountryDE` AS `de`,
        `Country`.`CountryEN` AS `en`
    FROM
        (`feLang` `Lang`
        JOIN `feCountry` `Country` ON ((`Lang`.`LangCode` = `Country`.`CountryLangCode`)));
