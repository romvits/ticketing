USE ticketing_db;

DROP TABLE IF EXISTS `tabLocation`;
CREATE TABLE `tabLocation` (
  `LocationID` varchar(32) NOT NULL COMMENT 'unique id of the location',
  `LocationName` varchar(100) NULL COMMENT 'name',
  `LocationStreet` varchar(100) NULL COMMENT 'street',
  `LocationCity` varchar(100) NULL COMMENT 'city',
  `LocationZIP` varchar(100) NULL COMMENT 'zip',
  `LocationCountry_id` varchar(32) NULL COMMENT 'country',
  `LocationTelefone` varchar(100) NULL COMMENT 'telefone',
  `LocationEmail` varchar(150) NOT NULL COMMENT 'email',
  PRIMARY KEY (`LocationID`)
) ENGINE=MyISAM DEFAULT CHARSET=UTF8MB4;
