USE ticketing_db;

SET FOREIGN_KEY_CHECKS = 0;

DROP TABLE IF EXISTS `innoReservationDetail`;
DROP TABLE IF EXISTS `innoReservation`;

CREATE TABLE `innoReservation` (
  `ReservationID`                                   varchar(32) NOT NULL COMMENT 'unique id of the Reservation',
  `ReservationCode`                                 varchar(10) NOT NULL COMMENT 'random 10 character string',
  `ReservationEventID`                              varchar(32) NOT NULL COMMENT 'id of the event that Reservation belongs to',
  `ReservationDateTimeUTC`                          datetime NOT NULL COMMENT 'Reservation date time',
  `ReservationFromUserID`                           varchar(32) NOT NULL COMMENT 'unique id of the user the Reservation was created',
  `ReservationUserID`                               varchar(32) NOT NULL COMMENT 'unique id of the user that Reservation belongs to => if null a new user will be created',
  `ReservationEmail`                                varchar(250) NULL COMMENT 'contact email address for this reservation',
  `ReservationPhone`                                varchar(30) NULL COMMENT 'contact phone number for this reservation',
  `ReservationComment`                              longtext NULL COMMENT 'comment for this reservation',
  FOREIGN KEY Reservation_EventID (`ReservationEventID`)               REFERENCES innoEvent(`EventID`),
  FOREIGN KEY Reservation_FromUserID (`ReservationFromUserID`)         REFERENCES innoUser(`UserID`),
  FOREIGN KEY Reservation_UserID (`ReservationUserID`)                 REFERENCES innoUser(`UserID`),
  PRIMARY KEY (`ReservationID`)  
) ENGINE=InnoDB DEFAULT CHARSET=UTF8MB4;


CREATE TABLE `innoReservationDetail` (
  `ReservationDetailReservationID`         varchar(32) NOT NULL COMMENT 'unique id of the Reservation that Reservation detail belongs to',
  `ReservationDetailType`                  enum('ticket','seat','special') NOT NULL COMMENT 'type of Reservation detail => ti=entry ticket | se=seat at location | sp=special = >upselling like Tortengarantie',
  `ReservationDetailTypeID`                varchar(32) NOT NULL COMMENT 'id of the record from table => ticket (ti) | seat (se) | special (sp) | handlingfee and shippingcost are ignored here ONLY if it will come to order this will stored in innoOrderDetail table',
  FOREIGN KEY ReservationDetail_ReservationID (`ReservationDetailReservationID`) 	REFERENCES innoReservation(`ReservationID`)
) ENGINE=InnoDB DEFAULT CHARSET=UTF8MB4;

SET FOREIGN_KEY_CHECKS = 1;
