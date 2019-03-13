USE ticketing_db;

DROP VIEW IF EXISTS `viewUserOrderList`;       
CREATE 
VIEW `viewUserOrderList` AS 
	SELECT innoUser.*,UserOrderCount,UserOrderFromCount,UserCreditFromCount,UserOrderOpenCount FROM innoUser
 
    LEFT JOIN (
    	SELECT OrderFromUserID, COUNT(OrderID) AS UserOrderFromCount
    	FROM innoOrder WHERE OrderFrom = 'intern'
    	GROUP BY OrderFromUserID
    ) UserOrderFromCount ON UserOrderFromCount.OrderFromUserID = innoUser.UserID
 
    LEFT JOIN (
    	SELECT OrderFromUserID, COUNT(OrderID) AS UserCreditFromCount
    	FROM innoOrder WHERE OrderType = 'credit'
    	GROUP BY OrderFromUserID
    ) UserCreditFromCount ON UserCreditFromCount.OrderFromUserID = innoUser.UserID
    
    LEFT JOIN (
    	SELECT OrderUserID, COUNT(OrderID) AS UserOrderCount
    	FROM innoOrder
    	GROUP BY OrderUserID
    ) UserOrderCount ON UserOrderCount.OrderUserID = innoUser.UserID

    LEFT JOIN (
    	SELECT OrderFromUserID, COUNT(OrderID) AS UserOrderOpenCount
    	FROM innoOrder WHERE OrderState = 'open'
    	GROUP BY OrderFromUserID
    ) UserOrderOpenCount ON UserOrderOpenCount.OrderFromUserID = innoUser.UserID
