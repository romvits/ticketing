USE ticketing_db;

DROP TABLE IF EXISTS `tabMockData`;
CREATE TABLE `tabMockData` (
	`MockDataID` VARCHAR(32) NOT NULL COMMENT 'unique id of the record - will be a auto generated 32 character string',
	`MockDataFirstname` VARCHAR(50),
	`MockDataLastname` VARCHAR(50),
	`MockDataEmail` VARCHAR(50),
	`MockDataGender` VARCHAR(50),
	`MockDataIP` VARCHAR(20),
	`MockDataAvatar` VARCHAR(250),
	`MockDataLatitude` DECIMAL(10,8),
	`MockDataLongitude`  DECIMAL(11,8),
	`MockDataCountry` VARCHAR(50),
	`MockDataCity` VARCHAR(50),
	`MockDataZIP` VARCHAR(50),
	`MockDataAddress` VARCHAR(50),
	`MockDataPhone` VARCHAR(50),
	PRIMARY KEY (`MockDataID`)
) ENGINE=InnoDB DEFAULT CHARSET=UTF8MB4;

