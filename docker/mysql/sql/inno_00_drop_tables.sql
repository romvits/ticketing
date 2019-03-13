use ticketing_db;

SET FOREIGN_KEY_CHECKS = 0;

DROP VIEW IF EXISTS `viewOrderDetail`;
DROP VIEW IF EXISTS `viewUserOrderList`;
DROP VIEW IF EXISTS `viewLang`;

DROP TABLE IF EXISTS `innoOrderDetail`;
DROP TABLE IF EXISTS `innoOrderTax`;
DROP TABLE IF EXISTS `innoOrder`;

DROP TABLE IF EXISTS `innoPromoterUser`;
DROP TABLE IF EXISTS `innoPromoter`;

DROP TABLE IF EXISTS `innoLocationFloor`;
DROP TABLE IF EXISTS `innoLocationRoom`;
DROP TABLE IF EXISTS `innoLocationTable`;
DROP TABLE IF EXISTS `innoLocationSeat`;
DROP TABLE IF EXISTS `innoLocation`;

DROP TABLE IF EXISTS `innoEvent`;
DROP TABLE IF EXISTS `innoEventFloor`;
DROP TABLE IF EXISTS `innoEventTicket`;

DROP TABLE IF EXISTS `innoUser`;

DROP TABLE IF EXISTS `innoTemplateEmail`;

SET FOREIGN_KEY_CHECKS = 1;
