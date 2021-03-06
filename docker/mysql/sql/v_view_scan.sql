USE ticketing_db;

DROP VIEW IF EXISTS `viewScan`;
CREATE
VIEW `viewScan` AS 
SELECT innoScan.ScanCode, innoScan.ScanState, innoScan.ScanDateTimeUTC, innoEvent.EventName, innoOrder.OrderUserID, innoOrder.OrderUserFirstname, innoOrder.OrderUserLastname, innoOrder.OrderUserStreet, innoOrder.OrderUserZIP, innoOrder.OrderUserCity FROM innoScan
inner join innoEvent on innoEvent.EventID = innoScan.ScanEventID
inner join innoOrderDetail on innoOrderDetail.OrderDetailScanCode = innoScan.ScanCode
inner join innoOrder on innoOrderDetail.OrderDetailOrderID = innoOrder.OrderID
