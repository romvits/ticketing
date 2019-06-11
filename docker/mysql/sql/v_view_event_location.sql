USE ticketing_db;

DROP VIEW IF EXISTS `viewEventLocation`;
CREATE
VIEW `viewEventLocation` AS 
SELECT
    `innoEvent`.`*`,
    `innoLocation`.`*`
FROM (`innoEvent`
	LEFT JOIN `innoLocation` ON `innoEvent`.`EventLocationID` = `innoLocation`.`LocationID`)