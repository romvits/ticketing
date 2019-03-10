USE ticketing_db;

DROP VIEW IF EXISTS `viewUserOrderList`;       
CREATE 
    ALGORITHM = UNDEFINED 
    DEFINER=`root`@`localhost` 
    SQL SECURITY DEFINER 
VIEW `viewUserOrderList` AS 
	SELECT innoUser.*,UserOrderCount,UserOrderFromCount FROM innoUser
    LEFT JOIN (
    	SELECT OrderFromUserID, COUNT(OrderID) AS UserOrderFromCount
    	FROM innoOrder
    	GROUP BY OrderFromUserID
    ) UserOrderFromCount ON UserOrderFromCount.OrderFromUserID = innoUser.UserID
    LEFT JOIN (
    	SELECT OrderUserID, COUNT(OrderID) AS UserOrderCount
    	FROM innoOrder
    	GROUP BY OrderUserID
    ) UserOrderCount ON UserOrderCount.OrderUserID = innoUser.UserID
