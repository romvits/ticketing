USE ticketing_db;

DROP VIEW IF EXISTS `viewLang`;
CREATE
VIEW `viewLang` AS
    SELECT 
        `Lang`.`LangCode` AS `LangCode`,
        `Country`.`CountryDE` AS `de`,
        `Country`.`CountryEN` AS `en`
    FROM
        (`feLang` `Lang`
        JOIN `feCountry` `Country` ON ((`Lang`.`LangCode` = `Country`.`CountryLangCode`)));
