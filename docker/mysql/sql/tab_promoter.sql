USE ticketing_db;

drop table IF EXISTS `tabPromoter`;
create TABLE `tabPromoter` (
  `PromoterID` varchar(32) NOT NULL COMMENT 'unique id of the promoter',
  `PromoterName` varchar(100) NOT NULL COMMENT 'name',
  `PromoterStreet` varchar(100) NULL COMMENT 'street',
  `PromoterCity` varchar(100) NULL COMMENT 'city',
  `PromoterZIP` int(4) NULL COMMENT 'zip',
  `PromoterCountryCountryISO2` int(3) NULL COMMENT 'country',
  `PromoterEmail` varchar(250) NOT NULL COMMENT 'email for the promoter (office address)',

  `PromoterLocations` int(3) NULL COMMENT 'null = no, 0 = all => how many locations are allowed for this promoter',
  `PromoterEvents` int(3) NULL COMMENT 'null = no, 0 = all => how many events are allowed for this promoter',
  `PromoterEventsActive` int(3) NULL COMMENT 'null = no, 0 = all => how many active events are allowed for this promoter',
  
  PRIMARY KEY (`PromoterID`)
) ENGINE=MyISAM DEFAULT CHARSET=UTF8MB4;
