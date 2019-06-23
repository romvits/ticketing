USE ticketing_db;

SET FOREIGN_KEY_CHECKS = 0;

DELETE FROM innoUser WHERE UserID = '00';
DELETE FROM innoUser WHERE UserID = '01';
DELETE FROM innoUser WHERE UserID = '02';

DELETE FROM innoLocation WHERE LocationID = '00';
DELETE FROM innoPromoter WHERE PromoterID = '00';
DELETE FROM innoEvent WHERE EventID = '00';

DELETE FROM innoTicket WHERE TicketEventID = '00';
DELETE FROM innoFloor WHERE FloorEventID = '00';
DELETE FROM innoRoom WHERE RoomEventID = '00';
DELETE FROM innoTable WHERE TableEventID = '00';
DELETE FROM innoSeat WHERE SeatEventID = '00' OR SeatReservationID = '00';

DELETE FROM innoOrder WHERE OrderEventID = '00';
DELETE FROM innoOrderDetail WHERE OrderDetailEventID = '00';

DELETE FROM innoQRCodeSetting WHERE QRCodeSettingID != '000';


REPLACE INTO innoUser (`UserID`, `UserType`, `UserEmail`, `UserLangCode`, `UserFirstname`, `UserLastname`, `UserPassword`, `UserPasswordSalt`) VALUES 
('00', 'admin', 'admin@admin.tld', 'de-at', 'Admin', 'Admin', 'd0c6f7e3103f037ed50d3f4635de64ee6e890cd9a7e9a23993de20b716ff6e22a4e9fad925ec5cbc1395a09dcec56ecf80ec53395e2d9e306bcab00ee4e810f7','xcVHkOeKHiJN9Hvr5HiSmufLdDHMyhk6ODYzV7DSwujH6tniGjl7qGQ7OQ0Vdb0lLSUnzkRcjmgsP9ZevoHNmMp3WcQwqaob3fVfX6zD5GufrFc0hdXGpQ1NNug5I0vs');

REPLACE INTO innoUser (`UserID`, `UserType`,`UserEmail`,`UserLangCode`,`UserCompany`,`UserCompanyUID`,`UserGender`,`UserTitle`,`UserFirstname`,`UserLastname`,`UserStreet`,`UserCity`,`UserZIP`,`UserCountryCountryISO2`,`UserPhone1`, `UserPassword`, `UserPasswordSalt`) VALUES 
('01', 'admin','roman.marlovits@gmail.com','de',null,null,'m',null,'Roman','Marlovits','DEMO User Street','Wien','1180','AT','+436648349919', 'd0c6f7e3103f037ed50d3f4635de64ee6e890cd9a7e9a23993de20b716ff6e22a4e9fad925ec5cbc1395a09dcec56ecf80ec53395e2d9e306bcab00ee4e810f7','xcVHkOeKHiJN9Hvr5HiSmufLdDHMyhk6ODYzV7DSwujH6tniGjl7qGQ7OQ0Vdb0lLSUnzkRcjmgsP9ZevoHNmMp3WcQwqaob3fVfX6zD5GufrFc0hdXGpQ1NNug5I0vs');

REPLACE INTO innoUser (`UserID`, `UserEmail`,`UserLangCode`,`UserCompany`,`UserCompanyUID`,`UserGender`,`UserTitle`,`UserFirstname`,`UserLastname`,`UserStreet`,`UserCity`,`UserZIP`,`UserCountryCountryISO2`,`UserPhone1`, `UserPassword`, `UserPasswordSalt`) VALUES 
('02', 'customer@domain.tld','de',null,null,'m',null,'Customer','Demonstration','DEMO User Street','DEMO City','1234','AT','+430123456789', 'd0c6f7e3103f037ed50d3f4635de64ee6e890cd9a7e9a23993de20b716ff6e22a4e9fad925ec5cbc1395a09dcec56ecf80ec53395e2d9e306bcab00ee4e810f7','xcVHkOeKHiJN9Hvr5HiSmufLdDHMyhk6ODYzV7DSwujH6tniGjl7qGQ7OQ0Vdb0lLSUnzkRcjmgsP9ZevoHNmMp3WcQwqaob3fVfX6zD5GufrFc0hdXGpQ1NNug5I0vs');

REPLACE INTO innoLocation (`LocationID`,`LocationName`,`LocationStreet`,`LocationCity`,`LocationZIP`,`LocationCountryCountryISO2`,`LocationEmail`,`LocationHomepage`,`LocationPhone1`) VALUES 
('00','DEMO Location','DEMO Location Street','Wien','1180','AT','roman.marlovits@gmail.com','https://www.webcomplete.at','+436648349919');

REPLACE INTO innoPromoter (`PromoterID`,`PromoterName`,`PromoterStreet`,`PromoterCity`,`PromoterZIP`,`PromoterCountryCountryISO2`,`PromoterEmail`,`PromoterHomepage`) VALUES 
('00','DEMO Promoter','DEMO Promoter Street','Wien','1180','AT','roman.marlovits@gmail.com','https://www.webcomplete.at');

REPLACE INTO innoEvent (
	`EventID`,
	`EventPromoterID`,
	`EventLocationID`,
	`EventName`,
	`EventPrefix`,
	`EventPhone1`,
	`EventEmail`,
	`EventHomepage`,
	`EventSubdomain`,
	`EventStartBillNumber`,
	`EventMaximumSeats`,
	`EventStepSeats`,
    `EventLangCodeDefault`,
	`EventDefaultTaxTicketPercent`,
	`EventDefaultTaxSeatPercent`,
	`EventStartDateTimeUTC`,
	`EventEndDateTimeUTC`,
	`EventSaleStartDateTimeUTC`,
	`EventSaleEndDateTimeUTC`,
	`EventScanStartDateTimeUTC`,
	`EventScanEndDateTimeUTC`,
	`EventHandlingFeeName`,
	`EventHandlingFeeGrossInternal`,
	`EventHandlingFeeGrossExternal`,
	`EventHandlingFeeTaxPercent`,
	`EventShippingCostName`,
	`EventShippingCostGrossInternal`,
	`EventShippingCostGrossExternal`,
	`EventShippingCostTaxPercent`,
	`EventSendMailAddress`
) VALUES (
	'00',							-- EventID
	'00',							-- EventPromoterID
	'00',							-- EventLocationID
	'DEMO EVENT',					-- EventName
	'DEMO1',						-- EventPrefix
	'+436648349919',				-- EventPhone1
	'roman.marlovits@gmail.com',	-- EventEmail
	'https://www.webcomplete.at',	-- EventHomepage
	'demo01',						-- EventSubdomain
	100,							-- EventStartBillNumber
	20,								-- EventMaximumSeats
	2,								-- EventStepSeats
	'en-us',						-- EventLangCodeDefault
	20,								-- EventDefaultTaxTicketPercent
	20,								-- EventDefaultTaxSeatPercent
	'2019-04-20 00:00:00',			-- EventStartDateTimeUTC
	'2050-04-20 00:00:00',			-- EventEndDateTimeUTC
	'2019-04-20 00:00:00',			-- EventSaleStartDateTimeUTC
	'2050-04-20 00:00:00',			-- EventSaleEndDateTimeUTC
	'2019-04-20 00:00:00',			-- EventScanStartDateTimeUTC
	'2050-04-20 00:00:00',			-- EventScanEndDateTimeUTC
	'Bearbeitungsgebühr',			-- EventHandlingFeeName
	10,								-- EventHandlingFeeGrossInternal
	5,								-- EventHandlingFeeGrossExternal
	20,								-- EventHandlingFeeTaxPercent
	'Versandkosten',				-- EventShippingCostName
	15,								-- EventShippingCostGrossInternal
	0,								-- EventShippingCostGrossExternal
	20,								-- EventShippingCostTaxPercent
	'"Roman Marlovits" <roman.marlovits@gmail.at>'
);

REPLACE INTO innoTicket (`TicketID`,`TicketEventID`,`TicketName`,`TicketType`,`TicketOnline`,`TicketMaximumOnline`,`TicketContingent`,`TicketSortOrder`,`TicketGrossPrice`,`TicketTaxPercent`,`TicketScanType`) VALUES
('01','00','DEMO Eintrittskarte',     'ticket', 1,10,500,1,12.02,20,'single'),
('02','00','DEMO Austrittskarte :)',  'ticket', 1,10,500,2,12.34,19,'inout'),
('03','00','DEMO Mastercard :)',      'ticket', 0,10,500,3,12.34,19,'multi'),
('04','00','DEMO Upselling Schaas ;)','special',1,2 ,500,4,15.51,19,'test');

REPLACE INTO innoFloor (`FloorID`,`FloorEventID`,`FloorName`,`FloorSVG`) VALUES 
('00','00','1. Stock','<svg width="4888" height="3242" xmlns="http://www.w3.org/2000/svg" xmlns:svg="http://www.w3.org/2000/svg" clip-rule="evenodd"></svg>');

REPLACE INTO innoRoom (`RoomID`,`RoomEventID`,`RoomFloorID`,`RoomName`,`RoomSVGShape`) VALUES 
('00','00','00','Wohnzimmer','186,185,383,162,384,261,186,262');

REPLACE INTO innoTable (`TableID`,`TableEventID`,`TableFloorID`,`TableRoomID`,`TableNumber`,`TableName`) VALUES 
('00','00','00','00',25,'Couchtisch');

REPLACE INTO innoSeat (`SeatID`,`SeatEventID`,`SeatFloorID`,`SeatRoomID`,`SeatTableID`,`SeatNumber`,`SeatName`,`SeatGrossPrice`,`SeatTaxPercent`) VALUES 
('101','00','00','00','00',1,'Sofa Platz 1',77.77,19),
('102','00','00','00','00',2,'Sofa Platz 2',77.77,19),
('103','00','00','00','00',3,'Sessel 3',77.77,19),
('104','00','00','00','00',4,'Hocker 4',77.77,19);

REPLACE INTO innoQRCodeSetting (`QRCodeSettingID`,`QRCodeSettingTypeID`,`QRCodeSettingWidth`,`QRCodeSettingLeft`,`QRCodeSettingTop`) VALUES
('001','00',100,150,200),
('002','00',100,200,150),
('003','01',100,100,100),
('004','02',100,150,200),
('005','03',100,150,200),
('006','04',100,150,200),
('007','04',100,200,150);

DELETE FROM `feTrans` WHERE `TransID` = '00';
REPLACE INTO `feTrans` (`TransID`,`TransLangCode`,`TransToken`,`TransValue`) VALUES
('00','de-at','§§EVENT_HANDLINGFEE','Bearbeitungsgebühr'),
('00','de-at','§§EVENT_SHIPPINGCOST','Versandgebühr'),
('00','de-at','§§BILL_ORDER_NUMBER','Rechnung-Nr.:'),
('00','de-at','§§BILL_SUBJECT','Ihre Rechnung für die DEMO-Veranstaltung!'),
('00','de-at','§§BILL_PAY_CASH','Sie haben bar bezahlt.'),
('00','de-at','§§BILL_PAY_TRANSFER','Bitte überweisen Sie den Betrag auf unser Konto<br />.'),
('00','de-at','§§BILL_PAY_CREDITCARD','Sie haben mit Kreditkarte bezahlt.'),
('00','de-at','§§BILL_PAY_PAYPAL','Sie haben mit PayPal bezahlt.'),
('00','de-at','§§BILL_PAY_EPS','Sie haben per online Überweisung bezahlt.'),
('00','de-at','§§MAIL_ORDER_SUBJECT','Ihre Rechnung und Eintritts- und Sitzplatzkarten'),
('00','en-us','§§MAIL_ORDER_CONTENT','<html>TEMPLATE the english one</html>'),
('00','de-at','§§SALE_BEFORE_START','<p>Der Verkauf startet am 01.01.1970 um 12:30 Uhr</p>'),
('00','de-at','§§EVENT_OFFLINE','<p>Zur Zeit können für dieses Event keine Karten gekauft werden.</p>'),
('00','de-at','§§SALE_AFTER_END','<p>Der online Verkauf für dieses Event wurde beendet, bitte wenden Sie sich an das Veranstaltungsbüro!</p>');

-- REPLACE INTO innoOrder (`OrderID`,`OrderNumber`,`OrderNumberText`,`OrderLocationID`,`OrderPromoterID`,`OrderEventID`,`OrderType`,`OrderPayment`,`OrderState`,`OrderDateTimeUTC`,`OrderPayedDateTimeUTC`,`OrderFromUserID`,`OrderUserID`,`OrderUserCompany`,`OrderUserCompanyUID`,`OrderUserGender`,`OrderUserTitle`,`OrderUserFirstname`,`OrderUserLastname`,`OrderUserStreet`,`OrderUserCity`,`OrderUserZIP`,`OrderUserCountryCountryISO2`,`OrderComment`,`OrderUserEmail`,`OrderGrossPrice`,`OrderNetPrice`) VALUES ('00','00001','DEMO1-000001','00','00','00','order','mpay','payed','2015-10-27 08:09:38','2015-10-27 07:09:05',null,'01','Demo',null,'m',null,'Demo','Demo','Demo','Wien','1080','AT',null,'stefan@ticketselect.at',27,27);
-- REPLACE INTO innoOrderDetail (`OrderDetailScanCode`,`OrderDetailScanNumber`,`OrderDetailEventID`,`OrderDetailOrderID`,`OrderDetailTypeID`,`OrderDetailType`,`OrderDetailState`,`OrderDetailText`,`OrderDetailGrossRegular`,`OrderDetailGrossDiscount`,`OrderDetailGrossPrice`,`OrderDetailTaxPercent`) VALUES ('DEMO000001',1,'00','00','01','ticket','sold','Eintrittskarte Vollpreis',11,0,11,0),('DEMO000002',2,'00','00','01','ticket','sold','Eintrittskarte Vollpreis',11,0,11,0),('DEMO000003',3,'00','00','01','ticket','canceled','Eintrittskarte Vollpreis',11,0,11,0),('DEMO000004',4,'00','00','04','special','sold','Special Ticket',5,0,5,0);

-- REPLACE INTO innoReservation (`ReservationID`,`ReservationCode`,`ReservationEventID`,`ReservationDateTimeUTC`,`ReservationFromUserID`,`ReservationUserID`,`ReservationComment`) VALUES ('00','00001','00','2019-04-20 00:00:00', '01', '02', 'test reservation');

SET FOREIGN_KEY_CHECKS = 1;

