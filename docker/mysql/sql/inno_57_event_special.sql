USE ticketing_db;

DROP TABLE IF EXISTS `innoEventSpecial`;
CREATE TABLE `innoEventSpecial` (
  `EventSpecialID` varchar(32) NOT NULL COMMENT 'unique id of the special',
  `EventSpecialEventID` varchar(32) NULL COMMENT 'unique id of the event that special belongs to',
  `EventSpecialName` varchar(100) NULL COMMENT 'name',
  
  FOREIGN KEY EventSpecial_EventID (`EventSpecialEventID`) REFERENCES innoEvent(`EventID`),
  PRIMARY KEY (`EventSpecialID`)
) ENGINE=InnoDB DEFAULT CHARSET=UTF8MB4;
