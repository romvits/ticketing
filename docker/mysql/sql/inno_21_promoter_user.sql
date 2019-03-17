USE ticketing_db;

DROP TABLE IF EXISTS `innoPromoterUser`;
CREATE TABLE `innoPromoterUser` (
  `PromoterID` varchar(32) NOT NULL COMMENT 'unique id of the promoter',
  `UserID` varchar(32) NOT NULL COMMENT 'unique id of the user',

  FOREIGN KEY PromoterUser_PromoterID (`PromoterID`) REFERENCES innoPromoter(`PromoterID`),
  FOREIGN KEY PromoterUser_UserID (`UserID`) REFERENCES innoUser(`UserID`),
  
  PRIMARY KEY (`PromoterID`,`UserID`)
) ENGINE=InnoDB DEFAULT CHARSET=UTF8MB4;
