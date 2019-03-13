USE ticketing_db;

DROP TABLE IF EXISTS `innoEvent`;
CREATE TABLE `innoEvent` (
  `EventID`                             varchar(32) NOT NULL COMMENT 'unique id of the event',

  `EventPromoterID`                     varchar(32) NULL COMMENT 'unique id of the Event that event belongs to',
  `EventLocationID`                     varchar(32) NULL COMMENT 'unique id of the location that event belongs to',

  `EventName`                           varchar(100) NULL COMMENT 'name',
  `EventPrefix`                         varchar(7) NULL COMMENT 'prefix of the event eg ZBB2020 IMPORTANT: can not be changed after event is created',
  
  `EventPhone1`                         varchar(30) NULL COMMENT 'phone number 1 for the Event',
  `EventPhone2`                         varchar(30) NULL COMMENT 'phone number 2 for the Event',
  `EventFax`                            varchar(30) NULL COMMENT 'fax number for the Event',

  `EventEmail`                          varchar(250) NULL COMMENT 'email for the Event',
  `EventHomepage`                       varchar(250) NULL COMMENT 'homepage for the Event',

  `EventSubdomain`                      varchar(50) NULL COMMENT 'subdomain for the Event eg zuckerbaecker-ball-2020 (.ballcomplete.at will be automatical extended => comes from file .config.yaml)',

  `EventStartBillNumber`                int(3) NOT NULL DEFAULT 100 COMMENT 'the first bill number for the first order',

  `EventMaximumSeats`                   tinyint(2) UNSIGNED NOT NULL DEFAULT 20 COMMENT 'maximum seats per order',
  `EventStepSeats`                      tinyint(1) UNSIGNED NOT NULL DEFAULT 1 COMMENT 'in which steps is it allowed to order seats => value of 2 means a customer can order 2,4,6,... seats',

  `EventDefaultTaxTicketPercent`        decimal(5,2) NOT NULL DEFAULT 0.00 COMMENT 'default tax value for tickets',
  `EventDefaultTaxSeatPercent`          decimal(5,2) NOT NULL DEFAULT 0.00 COMMENT 'default tax value for seats',

  `EventStartDateTimeUTC`               datetime NULL COMMENT '',
  `EventEndDateTimeUTC`                 datetime NULL COMMENT '',

  `EventSaleStartDateTimeUTC`           datetime NULL COMMENT '',
  `EventSaleEndDateTimeUTC`             datetime NULL COMMENT '',
  
  `EventScanStartDateTimeUTC`           datetime NULL COMMENT '',
  `EventScanEndDateTimeUTC`             datetime NULL COMMENT '',

  `EventInternalHandlingFeeGross`       decimal(8,2) UNSIGNED NOT NULL DEFAULT 0.00 COMMENT '',
  `EventInternalHandlingFeeTaxPercent`  decimal(5,2) UNSIGNED NOT NULL DEFAULT 0.00 COMMENT '',
  
  `EventInternalShippingCostGross`      decimal(8,2) UNSIGNED NOT NULL DEFAULT 0.00 COMMENT '',
  `EventInternalShippingCostTaxPercent` decimal(5,2) UNSIGNED NOT NULL DEFAULT 0.00 COMMENT '',

  `EventExternalShippingCostGross`      decimal(8,2) UNSIGNED NOT NULL DEFAULT 0.00 COMMENT '',
  `EventExternalShippingCostTaxPercent` decimal(5,2) UNSIGNED NOT NULL DEFAULT 0.00 COMMENT '',

  `EventExternalHandlingFeeGross`       decimal(8,2) UNSIGNED NOT NULL DEFAULT 0.00 COMMENT '',
  `EventExternalHandlingFeeTaxPercent`  decimal(5,2) UNSIGNED NOT NULL DEFAULT 0.00 COMMENT '',  

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

  FOREIGN KEY LOCATIONID (`EventLocationID`) REFERENCES innoLocation(`LocationID`),
  UNIQUE INDEX `UNIQUE_ID` (`EventID`,`EventPromoterID`,`EventLocationID`) VISIBLE,
  UNIQUE INDEX `UNIQUE_SUBDOMAIN` (`EventSubdomain`) VISIBLE,
  PRIMARY KEY (`EventID`)
) ENGINE=InnoDB DEFAULT CHARSET=UTF8MB4;
