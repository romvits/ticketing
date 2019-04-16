USE ticketing_db;

DROP TABLE IF EXISTS `innoEvent`;
CREATE TABLE `innoEvent` (
  `EventID`                             varchar(32) NOT NULL COMMENT 'unique id of the event',

  `EventPromoterID`                     varchar(32) NULL COMMENT 'unique id of the Event that event belongs to',
  `EventLocationID`                     varchar(32) NULL COMMENT 'unique id of the location that event belongs to',

  `EventOnline`                         tinyint(1) NULL COMMENT 'is this event from outside world/homepage reachable (online)? has only effect if actual date is between EventSaleStartDateTimeUTC and EventSaleEndDateTimeUTC',
  `EventTestMode`                       tinyint(1) NULL COMMENT 'is this event in Test Mode?',

  `EventOrderNumberBy`                  enum('promoter','event') NOT NULL DEFAULT 'event' COMMENT 'generate order number by promoter or event? event = own number circle for this event prefix | promoter = prefix is used but number is consecutive to the EventPromoterID (after first order this can not be changed!)',
  `EventOrderNumberResetDateTimeUTC`    datetime NULL COMMENT 'if EventOrderNumberBy = promoter this is the date when all events for this promoter are reset to 0 first order after this day gets order number 000001 (EventStartBillNumber is ignored!) ALL active events/orders for this promoter are getting a consecutive number',

  `EventName`                           varchar(100) NOT NULL COMMENT 'name',
  `EventPrefix`                         varchar(7) NOT NULL COMMENT 'prefix of the event eg ZBB2020 IMPORTANT: after first order this can not be changed!',
  
  `EventPhone1`                         varchar(30) NULL COMMENT 'phone number 1 for the Event',
  `EventPhone2`                         varchar(30) NULL COMMENT 'phone number 2 for the Event',
  `EventFax`                            varchar(30) NULL COMMENT 'fax number for the Event',

  `EventEmail`                          varchar(250) NULL COMMENT 'email for the Event',
  `EventHomepage`                       varchar(250) NULL COMMENT 'homepage for the Event',

  `EventSubdomain`                      varchar(50) NULL COMMENT 'subdomain for the Event eg zuckerbaecker-ball-2020 (.ballcomplete.at will be automatical extended => tld comes from file .config.yaml)',

  `EventStartBillNumber`                int(6) NOT NULL DEFAULT 100 COMMENT 'the first bill number for the first order',

  `EventMaximumSeats`                   tinyint(2) UNSIGNED NOT NULL DEFAULT 20 COMMENT 'maximum seats per order',
  `EventStepSeats`                      tinyint(1) UNSIGNED NOT NULL DEFAULT 1 COMMENT 'in which steps is it allowed to order seats => value of 2 means a customer can order 2,4,6,... seats',

  `EventDefaultTaxTicketPercent`        decimal(5,2) NOT NULL DEFAULT 0.00 COMMENT 'default tax value for tickets',
  `EventDefaultTaxSeatPercent`          decimal(5,2) NOT NULL DEFAULT 0.00 COMMENT 'default tax value for seats',

  `EventSaleStartDateTimeUTC`           datetime NULL COMMENT '',
  `EventSaleEndDateTimeUTC`             datetime NULL COMMENT '',
  
  `EventStartDateTimeUTC`               datetime NULL COMMENT '',
  `EventEndDateTimeUTC`                 datetime NULL COMMENT '',

  `EventScanStartDateTimeUTC`           datetime NULL COMMENT '',
  `EventScanEndDateTimeUTC`             datetime NULL COMMENT '',

  `EventInternalHandlingFeeGross`       decimal(8,2) UNSIGNED NOT NULL DEFAULT 0.00 COMMENT 'internal handling fee gross',
  `EventInternalHandlingFeeTaxPercent`  decimal(5,2) UNSIGNED NOT NULL DEFAULT 0.00 COMMENT 'internal handling fee tax percent',
  
  `EventInternalShippingCostGross`      decimal(8,2) UNSIGNED NOT NULL DEFAULT 0.00 COMMENT 'internal shipping cost fee gross',
  `EventInternalShippingCostTaxPercent` decimal(5,2) UNSIGNED NOT NULL DEFAULT 0.00 COMMENT 'internal shipping cost fee tax percent',

  `EventExternalHandlingFeeGross`       decimal(8,2) UNSIGNED NOT NULL DEFAULT 0.00 COMMENT 'external handling fee gross',
  `EventExternalHandlingFeeTaxPercent`  decimal(5,2) UNSIGNED NOT NULL DEFAULT 0.00 COMMENT 'external handling fee tax percent',  

  `EventExternalShippingCostGross`      decimal(8,2) UNSIGNED NOT NULL DEFAULT 0.00 COMMENT 'external shipping cost fee gross',
  `EventExternalShippingCostTaxPercent` decimal(5,2) UNSIGNED NOT NULL DEFAULT 0.00 COMMENT 'external shipping cost fee tax percent',

  `EventSendMailAddress`                varchar(250) NULL COMMENT '',
  `EventSendMailServer`                 varchar(250) NULL COMMENT '',
  `EventSendMailServerPort`             smallint(5) UNSIGNED NULL COMMENT '',
  `EventSendMailUsername`               varchar(250) NULL COMMENT '',
  `EventSendMailPassword`               varchar(100) NULL COMMENT '',
  `EventSendMailSettingsJSON`           json NULL COMMENT 'special settings for send mail',
  
  `EventMpayTestFlag`                   tinyint(1) unsigned NOT NULL DEFAULT 1 COMMENT 'is mpay in test mode',
  `EventMpayMerchantID`                 varchar(10) NULL COMMENT 'mPAY MerchantID',
  `EventMpaySoapPassword`               varchar(10) NULL COMMENT 'mPAY Soap Password',
  `EventMpayTestMerchantID`             varchar(10) NULL DEFAULT '91442' COMMENT 'mPAY Test MerchantID',
  `EventMpayTestSoapPassword`           varchar(10) NULL DEFAULT 'RkYvWLAH?b' COMMENT 'mPAY Test Soap Password',

  FOREIGN KEY Event_LocationID (`EventLocationID`) REFERENCES innoLocation(`LocationID`),
  UNIQUE INDEX `UNIQUE_PREFIX` (`EventPrefix`) VISIBLE,
  UNIQUE INDEX `UNIQUE_ID` (`EventID`,`EventPromoterID`,`EventLocationID`) VISIBLE,
  UNIQUE INDEX `UNIQUE_SUBDOMAIN` (`EventSubdomain`) VISIBLE,
  PRIMARY KEY (`EventID`)
) ENGINE=InnoDB DEFAULT CHARSET=UTF8MB4;
