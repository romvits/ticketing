USE ticketing_db;

DROP TABLE IF EXISTS `feTransGroup`;
CREATE TABLE `feTransGroup` (
  `TransGroupID` varchar(32) NOT NULL COMMENT 'unique group id of the translation group',
  `TransGroupName` varchar(100) NULL COMMENT 'name',
  PRIMARY KEY (`TransGroupID`)
) ENGINE=MyISAM DEFAULT CHARSET=UTF8MB4;

INSERT INTO feTransGroup (TransGroupID, TransGroupName) VALUES ('mock_data', 'List Headers');
INSERT INTO feTransGroup (TransGroupID, TransGroupName) VALUES ('mock_demo', 'Form Labels');
