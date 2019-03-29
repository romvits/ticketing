USE ticketing_db;

DROP TABLE IF EXISTS `feListGroup`;
CREATE TABLE `feListGroup` (
  `ListGroupID` VARCHAR(32) NOT NULL COMMENT 'unique id of the list group - will be a auto generated 32 character string',
  `ListGroupName` VARCHAR(100) NOT NULL COMMENT 'name of the list group - will be used to identify the list group in humen language',
  PRIMARY KEY (`ListGroupID`))
ENGINE = InnoDB DEFAULT CHARSET=UTF8MB4;

DROP TABLE IF EXISTS `feListGroupList`;
CREATE TABLE `feListGroupList` (
  `ListGroupListID` VARCHAR(32) NOT NULL COMMENT 'id of the list group',
  `ListID` VARCHAR(32) NOT NULL COMMENT 'id of the list which extends the list group',
  PRIMARY KEY (`ListGroupListID`,`ListID`))
ENGINE = InnoDB DEFAULT CHARSET=UTF8MB4;
