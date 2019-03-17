USE ticketing_db;

DROP VIEW IF EXISTS `viewScan`;
CREATE
VIEW `viewScan` AS 
SELECT innoScan.ScanCode, innoScan.ScanState, innoScan.ScanDateTimeUTC, innoEvent.EventName, innoOrder.OrderUserAddress1, innoOrder.OrderUserAddress2, innoOrder.OrderUserAddress3, innoOrder.OrderUserAddress4, innoOrder.OrderUserAddress5, innoOrder.OrderUserAddress6 FROM innoScan
inner join innoEvent on innoEvent.EventID = innoScan.ScanEventID
inner join innoOrderDetail on innoOrderDetail.OrderDetailScanCode = innoScan.ScanCode
inner join innoOrder on innoOrderDetail.OrderDetailOrderID = innoOrder.OrderID
