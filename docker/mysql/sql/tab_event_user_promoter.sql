USE ticketing_db;

DROP TABLE IF EXISTS `tabEventUserPromoter`;
CREATE TABLE `tabEventUserPromoter` (
  `EventID` varchar(32) NOT NULL COMMENT 'unique id of the event',
  `UserID` varchar(32) NOT NULL COMMENT 'unique id of the user',
  PRIMARY KEY (`EventID`,`UserID`)
) ENGINE=MyISAM DEFAULT CHARSET=UTF8MB4;
