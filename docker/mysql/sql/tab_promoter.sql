USE ticketing_db;

drop table IF EXISTS `tabPromoter`;
create TABLE `tabPromoter` (
  `PromoterID` varchar(32) NOT NULL COMMENT 'unique id of the promoter',

  `PromoterName` varchar(150) NOT NULL COMMENT 'name',
  `PromoterStreet` varchar(150) NULL COMMENT 'street',
  `PromoterCity` varchar(100) NULL COMMENT 'city',
  `PromoterZIP` varchar(10) NULL COMMENT 'zip',
  `PromoterCountryCountryISO2` varchar(2) NULL COMMENT 'country',

  `PromoterPhone1` varchar(30) NULL COMMENT 'phone number 1 of the promoter',
  `PromoterPhone2` varchar(30) NULL COMMENT 'phone number 2 of the promoter',
  `PromoterFax` varchar(30) NULL COMMENT 'fax number of the promoter',

  `PromoterEmail` varchar(250) NULL COMMENT 'email for the promoter (office address)',
  `PromoterHomepage` varchar(250) NULL COMMENT 'homepage for the promoter (office address)',

  `PromoterLocations` int(6) NULL COMMENT 'null = no, 0 = no limit => how many locations are allowed for this promoter',
  `PromoterEvents` int(6) NULL COMMENT 'null = no, 0 = no limit => how many events are allowed for this promoter',
  `PromoterEventsActive` int(6) NULL COMMENT 'null = no, 0 = no limit => how many active events are allowed for this promoter',
  
  PRIMARY KEY (`PromoterID`)
) ENGINE=MyISAM DEFAULT CHARSET=UTF8MB4;
