USE ticketing_db;

DROP TABLE IF EXISTS `innoTicket`;
CREATE TABLE `innoTicket` (
  `TicketID`                    varchar(32) NOT NULL COMMENT 'unique id of the ticket',
  `TicketEventID`               varchar(32) NULL COMMENT 'unique id of the event that ticket belongs to',
  `TicketName`                  varchar(100) NULL COMMENT 'name',

  `TicketType`                  enum('ticket','special') NOT NULL DEFAULT 'ticket' COMMENT 'type of ticket ticket=>normal ticket | special=>special ticket (upselling) like Tortengarantie',
  `TicketScanType`              enum('single','multi','inout','test') NOT NULL DEFAULT 'single' COMMENT '',
  
  `TicketQuota`                 int(6) NULL COMMENT 'how many tickets of this type are available',
  `TicketQuotaPreprint`         int(6) NULL COMMENT 'how many tickets of this type are preprinted',

  `TicketGrossPrice`            decimal(8,2) UNSIGNED NOT NULL DEFAULT 0.00 COMMENT 'price gross => brutto subtract amount discount gross',
  `TicketTaxPercent`            decimal(5,2) UNSIGNED NOT NULL DEFAULT 0.00 COMMENT 'tax in percent',
  
  FOREIGN KEY Ticket_EventID (`TicketEventID`) REFERENCES innoEvent(`EventID`),
  PRIMARY KEY (`TicketID`)
) ENGINE=InnoDB DEFAULT CHARSET=UTF8MB4;
