USE ticketing_db;

DROP VIEW IF EXISTS `viewLang`;
CREATE
VIEW `viewLang` AS
    SELECT 
        `feLangCode`.`LangCode` AS `LangCode`,
        `feCountry`.`CountryDE` AS `de`,
        `feCountry`.`CountryEN` AS `en`
    FROM
        (`feLangCode`
        JOIN `feCountry` ON ((`feLangCode`.`LangCode` = `feCountry`.`CountryLangCode`)));
