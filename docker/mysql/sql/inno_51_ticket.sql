USE ticketing_db;

DROP TABLE IF EXISTS `innoTicketPreprint`;
DROP TABLE IF EXISTS `innoTicket`;

CREATE TABLE `innoTicket` (
  `TicketID`                                     varchar(32) NOT NULL COMMENT 'unique id of the ticket',
  `TicketEventID`                                varchar(32) NULL COMMENT 'unique id of the event that ticket belongs to',

  `TicketOnline`                                 tinyint(1) NULL COMMENT 'is this ticket from outside world/homepage reachable (online)? if set to 0 can be used for innoSpecialOffer',
  `TicketOnlineAmount`                           tinyint(1) NULL COMMENT 'maximum number (amount) of tickets for online orders',

  `TicketSortOrder`                              tinyint(2) UNSIGNED NOT NULL DEFAULT 0 COMMENT 'sort order for the ticket',

  `TicketName`                                   varchar(100) NULL COMMENT 'name',
  `TicketLable`                                  varchar(100) NULL COMMENT 'label, translation token starting with §§ (eg §§STUDENT)',

  `TicketType`                                   enum('ticket','special') NOT NULL DEFAULT 'ticket' COMMENT 'type of ticket ticket=>normal ticket | special=>special ticket (upselling) like Tortengarantie',
  `TicketScanType`                               enum('single','multi','inout','test') NOT NULL DEFAULT 'single' COMMENT '',

  `TicketContingent`                             int(6) NULL COMMENT 'how many tickets of this type are available (preprinted are included => will be a special function)',

  `TicketGrossPrice`                             decimal(8,2) UNSIGNED NOT NULL DEFAULT 0.00 COMMENT 'regular price gross => brutto',
  `TicketTaxPercent`                             decimal(5,2) UNSIGNED NOT NULL DEFAULT 0.00 COMMENT 'tax in percent',

  FOREIGN KEY Ticket_EventID (`TicketEventID`)   REFERENCES innoEvent(`EventID`),
  UNIQUE KEY Ticket_EventID_SortOrder (`TicketEventID`, `TicketSortOrder`),
  PRIMARY KEY (`TicketID`)
) ENGINE=InnoDB DEFAULT CHARSET=UTF8MB4;

CREATE TABLE `innoTicketPreprint` (

  `TicketPreprintScanCode`                                        varchar(15) NOT NULL COMMENT 'unique scancode for preprint ticket => 7 chars event prefix, EAN (1 digit fix 0 => 0 is reserved for preprint tickets, 6 digits number, 1 check digit)',
  `TicketPreprintTicketID`                                        varchar(32) NOT NULL COMMENT 'unique id of the ticket MUST BE TYPE ticket NOT special!',
  `TicketPreprintEventID`                                         varchar(32) NULL COMMENT 'unique id of the event that ticket belongs to',
  `TicketPreprintRedeemedDateTimeUTC`                             datetime NULL COMMENT 'Date and Time when this ticket was redemmed (eingelöst :))',

  FOREIGN KEY TicketPreprint_TicketID (`TicketPreprintTicketID`)  REFERENCES innoTicket(`TicketID`),
  FOREIGN KEY TicketPreprint_EventID (`TicketPreprintEventID`)    REFERENCES innoEvent(`EventID`),
  PRIMARY KEY (`TicketPreprintScanCode`)
) ENGINE=InnoDB DEFAULT CHARSET=UTF8MB4;
