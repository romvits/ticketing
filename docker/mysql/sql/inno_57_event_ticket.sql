USE ticketing_db;

DROP TABLE IF EXISTS `innoEventTicket`;
CREATE TABLE `innoEventTicket` (
  `EventTicketID` varchar(32) NOT NULL COMMENT 'unique id of the ticket',
  `EventTicketEventID` varchar(32) NULL COMMENT 'unique id of the event that ticket belongs to',
  `EventTicketName` varchar(100) NULL COMMENT 'name',
  
  FOREIGN KEY EventTicket_EventID (`EventTicketEventID`) REFERENCES innoEvent(`EventID`),
  PRIMARY KEY (`EventTicketID`)
) ENGINE=InnoDB DEFAULT CHARSET=UTF8MB4;
