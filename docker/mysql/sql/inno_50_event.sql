USE ticketing_db;

SET FOREIGN_KEY_CHECKS = 0;

DROP TABLE IF EXISTS `innoEvent`;
DROP TABLE IF EXISTS `innoEventLang`;

CREATE TABLE `innoEvent` (
  `EventID`                             varchar(32) NOT NULL COMMENT 'unique id of the event',
  `EventPromoterID`                     varchar(32) NOT NULL COMMENT 'unique id of the Event that event belongs to',
  `EventLocationID`                     varchar(32) NOT NULL COMMENT 'unique id of the location that event belongs to',
  
  `EventOnline`                         tinyint(1) NULL COMMENT 'is this event from outside world/homepage reachable (online)? has only effect if actual date is between EventSaleStartDateTimeUTC and EventSaleEndDateTimeUTC',
  `EventTestMode`                       tinyint(1) NULL COMMENT 'is this event in Test Mode?',
  `EventOrderNumberBy`                  enum('promoter','event') NOT NULL DEFAULT 'event' COMMENT 'generate order number by promoter or event? event = own number circle for this event prefix | promoter = prefix is used but number is consecutive to the EventPromoterID (after first order this can not be changed!)',
  `EventOrderNumberResetDateTimeUTC`    datetime NULL COMMENT 'if EventOrderNumberBy = promoter this is the date when all events for this promoter are reset to 0 first order after this day gets order number 000001 (EventStartBillNumber is ignored!) ALL active events/orders for this promoter are getting a consecutive number',
  
  `EventName`                           varchar(100) NOT NULL COMMENT 'name',
  `EventPrefix`                         varchar(5) NOT NULL COMMENT 'prefix of the event eg ZBB20 IMPORTANT: after first order this can not be changed!',
  `EventPhone1`                         varchar(30) NULL COMMENT 'phone number 1 for the Event',
  `EventPhone2`                         varchar(30) NULL COMMENT 'phone number 2 for the Event',
  `EventFax`                            varchar(30) NULL COMMENT 'fax number for the Event',
  `EventEmail`                          varchar(250) NULL COMMENT 'email for the Event',
  `EventHomepage`                       varchar(250) NULL COMMENT 'homepage for the Event',
  `EventSubdomain`                      varchar(50) NULL COMMENT 'subdomain for the Event eg zuckerbaecker-ball-2020 (.ballcomplete.at will be automatical extended => tld comes from file .config.yaml) IMPORTANT: not allowed and reserved for internal usage is: www, scan, admin and EMPTY',
  
  `EventStartBillNumber`                int(6) NOT NULL DEFAULT 100 COMMENT 'the first bill number for the first order',
  `EventMaximumVisitors`                int(6) UNSIGNED NOT NULL DEFAULT 0 COMMENT 'maximum visitors for this event (count all tickets from type ticket all others are exluded)',
  `EventMaximumSeats`                   tinyint(2) UNSIGNED NOT NULL DEFAULT 20 COMMENT 'maximum seats per order',
  `EventStepSeats`                      tinyint(2) UNSIGNED NOT NULL DEFAULT 1 COMMENT 'in which steps is it allowed to order seats => value of 2 means a customer can order 2,4,6,... seats',
  `EventLangCodeDefault`                varchar(5) NOT NULL COMMENT 'default language for this event, must be one of `innoEventLang`.`EventLangLangCode`',
  
  `EventDefaultTaxTicketPercent`        decimal(5,2) NOT NULL DEFAULT 0.00 COMMENT 'default tax value for tickets',
  `EventDefaultTaxSeatPercent`          decimal(5,2) NOT NULL DEFAULT 0.00 COMMENT 'default tax value for seats',
  
  `EventTimezone`                       varchar(50) NULL COMMENT 'timezone of the event (is this needed? because the location has its own timezone field LocationTimezone)',
  `EventSaleStartDateTimeUTC`           datetime NULL COMMENT '',
  `EventSaleEndDateTimeUTC`             datetime NULL COMMENT '',
  `EventStartDateTimeUTC`               datetime NULL COMMENT '',
  `EventEndDateTimeUTC`                 datetime NULL COMMENT '',
  `EventScanStartDateTimeUTC`           datetime NULL COMMENT '',
  `EventScanEndDateTimeUTC`             datetime NULL COMMENT '',
  
  `EventHandlingFeeName`                varchar(100) NULL COMMENT 'handling fee name',
  `EventHandlingFeeLabel`               varchar(100) NULL COMMENT 'token for handling fee',  
  `EventHandlingFeeGrossInternal`       decimal(8,2) UNSIGNED NOT NULL DEFAULT 0.00 COMMENT 'handling fee gross internal',
  `EventHandlingFeeGrossExternal`       decimal(8,2) UNSIGNED NOT NULL DEFAULT 0.00 COMMENT 'handling fee gross external',
  `EventHandlingFeeTaxPercent`          decimal(5,2) UNSIGNED NOT NULL DEFAULT 0.00 COMMENT 'handling fee tax percent',  
  `EventShippingCostName`               varchar(100) NULL COMMENT 'shipping cost name',
  `EventShippingCostLabel`              varchar(100) NULL COMMENT 'token for shipping cost',
  `EventShippingCostGrossInternal`      decimal(8,2) UNSIGNED NOT NULL DEFAULT 0.00 COMMENT 'shipping cost gross',
  `EventShippingCostGrossExternal`      decimal(8,2) UNSIGNED NOT NULL DEFAULT 0.00 COMMENT 'shipping cost gross',
  `EventShippingCostTaxPercent`         decimal(5,2) UNSIGNED NOT NULL DEFAULT 0.00 COMMENT 'shipping cost tax percent',
  
  `EventBillOrderNumberLabel`           varchar(100) NULL DEFAULT '§§BILL_ORDER_NUMBER' COMMENT 'text bill number (eg Rechnung-Nr.:)',
  `EventBillSubjectLabel`               varchar(100) NULL DEFAULT '§§BILL_SUBJECT' COMMENT 'text subject (Ihre Rechnung für die Bestellung für das Event XY!)',
  `EventBillPayCashLabel`               varchar(100) NULL DEFAULT '§§BILL_PAY_CASH' COMMENT 'text pay cash (Sie haben bar bezahlt.)',
  `EventBillPayTransferLabel`           varchar(100) NULL DEFAULT '§§BILL_PAY_TRANSFER' COMMENT 'text pay cash (Bitte überweisen Sie den Betrag auf unser Konto<br />.)',
  `EventBillPayCreditcardLabel`         varchar(100) NULL DEFAULT '§§BILL_PAY_CREDITCARD' COMMENT 'text pay creditcard (Sie haben mit Kreditkarte bezahlt.)',
  `EventBillPayPayPalLabel`             varchar(100) NULL DEFAULT '§§BILL_PAY_PAYPAL' COMMENT 'text pay paypal (Sie haben mit PayPal bezahlt.)',
  `EventBillPayEPSLabel`                varchar(100) NULL DEFAULT '§§BILL_PAY_EPS' COMMENT 'text pay eps (Sie haben per online Überweisung bezahlt.)',

  `EventSendMailAddress`                varchar(250) NULL COMMENT '',
  `EventSendMailServer`                 varchar(250) NULL COMMENT '',
  `EventSendMailServerPort`             smallint(5) UNSIGNED NULL COMMENT '',
  `EventSendMailUsername`               varchar(250) NULL COMMENT '',
  `EventSendMailPassword`               varchar(100) NULL COMMENT '',
  `EventSendMailSettingsJSON`           json NULL COMMENT 'special settings for send mail',

  `EventSendMailOrderSubjectLabel`		varchar(100) NULL DEFAULT '§§MAIL_ORDER_SUBJECT' COMMENT 'token for order email template subject (Ihre Rechnung und Eintritts- und Sitzplatzkarten)',
  `EventSendMailOrderContentLabel`		varchar(100) NULL DEFAULT '§§MAIL_ORDER_CONTENT' COMMENT 'token for order email template content (<html>....</html>)',

  `EventSaleStartDateBeforeLabel`		varchar(100) NULL DEFAULT '§§SALE_BEFORE_START' COMMENT 'token for text before event sale start date is reached (<p>Der Verkauf startet am 01.01.1970 um 12:30 Uhr</p>)',
  `EventOfflineLabel`					varchar(100) NULL DEFAULT '§§EVENT_OFFLINE' COMMENT 'token for text if the event is offline (<p>Zur Zeit können für dieses Event keine Karten gekauft werden.</p>)',
  `EventSaleEndDateAfterLabel`			varchar(100) NULL DEFAULT '§§SALE_AFTER_END' COMMENT 'token for text after event sale end date is reached (<p>Der online Verkauf für dieses Event wurde beendet, bitte wenden Sie sich an das Veranstaltungsbüro!</p>)',

  `EventMpayTestFlag`                   tinyint(1) unsigned NOT NULL DEFAULT 1 COMMENT 'is mpay in test mode',
  `EventMpayMerchantID`                 varchar(10) NULL COMMENT 'mPAY MerchantID',
  `EventMpaySoapPassword`               varchar(10) NULL COMMENT 'mPAY Soap Password',
  `EventMpayTestMerchantID`             varchar(10) NULL DEFAULT '91442' COMMENT 'mPAY Test MerchantID',
  `EventMpayTestSoapPassword`           varchar(10) NULL DEFAULT 'RkYvWLAH?b' COMMENT 'mPAY Test Soap Password',
  
  FOREIGN KEY Event_PromoterID (`EventPromoterID`) REFERENCES innoPromoter(`PromoterID`),
  FOREIGN KEY Event_LocationID (`EventLocationID`) REFERENCES innoLocation(`LocationID`),
  UNIQUE INDEX `UNIQUE_PREFIX` (`EventPrefix`) VISIBLE,
  UNIQUE INDEX `UNIQUE_ID` (`EventID`,`EventPromoterID`,`EventLocationID`) VISIBLE,
  UNIQUE INDEX `UNIQUE_SUBDOMAIN` (`EventSubdomain`) VISIBLE,
  PRIMARY KEY (`EventID`)
) ENGINE=InnoDB DEFAULT CHARSET=UTF8MB4;

CREATE TABLE `innoEventLang` (
  `EventLangEventID` VARCHAR(32), 
  `EventLangLangCode` VARCHAR(5) NOT NULL COMMENT 'unique available language code https://www.metamodpro.com/browser-language-codes',
  FOREIGN KEY EventLang_EventID (`EventLangEventID`) REFERENCES innoEvent(`EventID`),
  FOREIGN KEY EventLang_LangCode (`EventLangLangCode`) REFERENCES feLangCode(`LangCode`),
  PRIMARY KEY (`EventLangEventID`,`EventLangLangCode`))
ENGINE=InnoDB DEFAULT CHARSET=UTF8MB4;


SET FOREIGN_KEY_CHECKS = 1;

