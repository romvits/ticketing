USE ticketing_db;

DROP TABLE IF EXISTS `tabTicket`;
CREATE TABLE `tabTicket` (
  `TicketID` varchar(32) NOT NULL COMMENT 'unique id of the ticket',
  `TicketEventID` varchar(32) NULL COMMENT 'unique id of the event that ticket belongs to',
  `TicketName` varchar(100) NULL COMMENT 'name',
  PRIMARY KEY (`TicketID`),
  UNIQUE INDEX `UNIQUEID` (`TicketID`,`TicketEventID`) VISIBLE
) ENGINE=MyISAM DEFAULT CHARSET=UTF8MB4;
