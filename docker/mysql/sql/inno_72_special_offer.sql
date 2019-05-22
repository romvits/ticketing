USE ticketing_db;

SET FOREIGN_KEY_CHECKS = 0;

DROP TABLE IF EXISTS `innoSpecialOfferDetail`;
DROP TABLE IF EXISTS `innoSpecialOfferUser`;
DROP TABLE IF EXISTS `innoSpecialOffer`;

CREATE TABLE `innoSpecialOffer` (

  `SpecialOfferID`                                   varchar(32) NOT NULL COMMENT 'unique id of the SpecialOffer',
  `SpecialOfferBy`                                   enum('event','user') NOT NULL DEFAULT 'event' COMMENT '3 szenarios available => set to "event" each user can get this special offer | if SpecialOfferCode is not NULL the user will be ask for this code OR if this set to "user" each user gets a unique code to redeem a special offer ONE TIME',
  `SpecialOfferCode`                                 varchar(10) NOT NULL COMMENT 'random 10 character string',
  `SpecialOfferEventID`                              varchar(32) NOT NULL COMMENT 'id of the event that SpecialOffer belongs to',
  `SpecialOfferStartDateTimeUTC`                     datetime NOT NULL COMMENT 'SpecialOffer date time start',
  `SpecialOfferEndDateTimeUTC`                       datetime NOT NULL COMMENT 'SpecialOffer date time end',
  `SpecialOfferFromUserID`                           varchar(32) NOT NULL COMMENT 'unique id of the user the SpecialOffer was created',  
  `SpecialOfferComment`                              longtext NULL COMMENT 'comment for this SpecialOffer',

  FOREIGN KEY SpecialOffer_EventID (`SpecialOfferEventID`)               REFERENCES innoEvent(`EventID`),
  FOREIGN KEY SpecialOffer_FromUserID (`SpecialOfferFromUserID`)         REFERENCES innoUser(`UserID`),
  PRIMARY KEY (`SpecialOfferID`)  
) ENGINE=InnoDB DEFAULT CHARSET=UTF8MB4;


CREATE TABLE `innoSpecialOfferDetail` (

  `SpecialOfferDetailSpecialOfferID`        varchar(32) NOT NULL COMMENT 'unique id of the SpecialOffer that SpecialOffer detail belongs to',
  `SpecialOfferDetailType`                  enum('ticket','seat') NOT NULL COMMENT 'type of SpecialOffer detail => ti=entry ticket | se=seat at location | sp=special = >upselling like Tortengarantie | handlingfee | shippingcost',
  `SpecialOfferDetailTypeID`                varchar(32) NOT NULL COMMENT 'id of the record from table => ticket (ti) | seat (se) | special (sp) | handlingfee | shippingcost',
  `SpecialOfferDetailEventID`               varchar(32) NOT NULL COMMENT 'id of the event that SpecialOffer detail belongs to',
  `SpecialOfferDetailGrossDiscount`         decimal(8,2) NOT NULL DEFAULT 0.00 COMMENT 'amount gross discount => brutto discount gross',

  FOREIGN KEY SpecialOfferDetail_EventID (`SpecialOfferDetailEventID`) REFERENCES innoEvnt(`EventID`),
  FOREIGN KEY SpecialOfferDetail_SpecialOfferID (`SpecialOfferDetailSpecialOfferID`) REFERENCES innoSpecialOffer(`SpecialOfferID`)
) ENGINE=InnoDB DEFAULT CHARSET=UTF8MB4;

CREATE TABLE `innoSpecialOfferUser` (

  `SpecialOfferUserCode`                  varchar(10) NOT NULL COMMENT 'random 10 character string',
  `SpecialOfferUserSpecialOfferID`        varchar(32) NOT NULL COMMENT 'unique id of the SpecialOffer that SpecialOfferUser belongs to',
  `SpecialOfferUserUserID`                varchar(32) NOT NULL COMMENT 'unique id of the User that SpecialOfferUser belongs to',
  `SpecialOfferUserEventID`               varchar(32) NOT NULL COMMENT 'id of the event that SpecialOffer user belongs to',
  `SpecialOfferUserRedeemedDateTimeUTC`   datetime NULL COMMENT 'Date and Time when this special offer was redemmed (eingelöst :))',

  FOREIGN KEY SpecialOfferUser_SpecialOfferID (`SpecialOfferUserSpecialOfferID`) REFERENCES innoSpecialOffer(`SpecialOfferID`),
  FOREIGN KEY SpecialOfferUser_UserID         (`SpecialOfferUserUserID`)         REFERENCES innoUser(`UserID`),
  FOREIGN KEY SpecialOfferUser_EventID        (`SpecialOfferUserEventID`)        REFERENCES innoEvent(`EventID`),
  PRIMARY KEY (`SpecialOfferUserCode`)  
) ENGINE=InnoDB DEFAULT CHARSET=UTF8MB4;


SET FOREIGN_KEY_CHECKS = 1;
