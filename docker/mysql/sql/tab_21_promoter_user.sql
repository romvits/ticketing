USE ticketing_db;

DROP TABLE IF EXISTS `tabPromoterUser`;
CREATE TABLE `tabPromoterUser` (
  `PromoterID` varchar(32) NOT NULL COMMENT 'unique id of the promoter',
  `UserID` varchar(32) NOT NULL COMMENT 'unique id of the user',
  PRIMARY KEY (`PromoterID`,`UserID`)
) ENGINE=MyISAM DEFAULT CHARSET=UTF8MB4;
