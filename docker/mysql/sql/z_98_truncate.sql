use ticketing_db;

SET FOREIGN_KEY_CHECKS = 0;
TRUNCATE TABLE innoOrderDetail;
TRUNCATE TABLE innoOrderTax;
TRUNCATE TABLE innoOrder;
TRUNCATE TABLE innoLocation;
TRUNCATE TABLE innoPromoterUser;
TRUNCATE TABLE innoPromoter;
TRUNCATE TABLE innoSeat;
TRUNCATE TABLE innoTable;
TRUNCATE TABLE innoRoom;
TRUNCATE TABLE innoFloor;
TRUNCATE TABLE innoTicket;
TRUNCATE TABLE innoEvent;
TRUNCATE TABLE innoUser;
SET FOREIGN_KEY_CHECKS = 1;
