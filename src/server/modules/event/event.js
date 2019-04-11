import Module from './../module';
import _ from 'lodash';

/**
 * event module
 */
class Event extends Module {

	/**
	 * constructor
	 * @param connID {String} 32 character string of connection ID from database table ''
	 */
	constructor(ConnID = null, ConnUserID = null) {
		super(ConnID, ConnUserID);
		this.pk = 'EventID';
		this.table = 'innoEvent';
		this.view = 'viewEvent';
		this.fields = {
			'EventName': {'type': 'string', 'length': 100, 'empty': false}, // varchar(100) NOT NULL COMMENT 'name',
			'EventPrefix': {'type': 'string', 'length': 7, 'empty': false}, // varchar(7) NOT NULL COMMENT 'prefix of the event eg ZBB2020 IMPORTANT: can not be changed after first order',
			'EventPhone1': {'type': 'string', 'length': 30, 'empty': true}, // varchar(30) NULL COMMENT 'phone number 1 for the Event',
			'EventPhone2': {'type': 'string', 'length': 30, 'empty': true}, // varchar(30) NULL COMMENT 'phone number 2 for the Event',
			'EventFax': {'type': 'string', 'length': 30, 'empty': true}, // varchar(30) NULL COMMENT 'fax number for the Event',
			'EventEmail': {'type': 'email', 'length': 250, 'empty': true}, // varchar(250) NULL COMMENT 'email for the Event',
			'EventHomepage': {'type': 'string', 'length': 250, 'empty': true}, //  varchar(250) NULL COMMENT 'homepage for the Event',
			'EventSubdomain': {'type': 'string', 'length': 50, 'empty': true}, // varchar(50) NULL COMMENT 'subdomain for the Event eg zuckerbaecker-ball-2020 (.ballcomplete.at will be automatical extended => tld comes from file .config.yaml)',
			'EventStartBillNumber': {'type': 'integer', 'length': 6, 'empty': false}, // int(6) NOT NULL DEFAULT 100 COMMENT 'the first bill number for the first order',
			'EventMaximumSeats': {'type': 'integer', 'length': 2, 'empty': false}, // tinyint(2) UNSIGNED NOT NULL DEFAULT 20 COMMENT 'maximum seats per order',
			'EventStepSeats': {'type': 'integer', 'length': 1, 'empty': false}, // tinyint(1) UNSIGNED NOT NULL DEFAULT 1 COMMENT 'in which steps is it allowed to order seats => value of 2 means a customer can order 2,4,6,... seats',
			'EventDefaultTaxTicketPercent': {'type': 'decimal', 'length': 50, 'empty': false}, // decimal(5,2) NOT NULL DEFAULT 0.00 COMMENT 'default tax value for tickets',
			'EventDefaultTaxSeatPercent': {'type': 'decimal', 'length': 50, 'empty': false}, // decimal(5,2) NOT NULL DEFAULT 0.00 COMMENT 'default tax value for seats',
			'EventStartDateTimeUTC': {'type': 'datetime', 'length': 50, 'empty': false}, // datetime NULL COMMENT '',
			'EventEndDateTimeUTC': {'type': 'datetime', 'length': 50, 'empty': false}, // datetime NULL COMMENT '',
			'EventSaleStartDateTimeUTC': {'type': 'datetime', 'length': 50, 'empty': false}, // datetime NULL COMMENT '',
			'EventSaleEndDateTimeUTC': {'type': 'datetime', 'length': 50, 'empty': false}, // datetime NULL COMMENT '',
			'EventScanStartDateTimeUTC': {'type': 'datetime', 'length': 50, 'empty': false}, // datetime NULL COMMENT '',
			'EventScanEndDateTimeUTC': {'type': 'datetime', 'length': 50, 'empty': false}, // datetime NULL COMMENT '',
			'EventInternalHandlingFeeGross': {'type': 'decimal', 'length': 50, 'empty': false}, // decimal(8,2) UNSIGNED NOT NULL DEFAULT 0.00 COMMENT '',
			'EventInternalHandlingFeeTaxPercent': {'type': 'decimal', 'length': 50, 'empty': false}, // decimal(5,2) UNSIGNED NOT NULL DEFAULT 0.00 COMMENT '',
			'EventInternalShippingCostGross': {'type': 'decimal', 'length': 50, 'empty': false}, // decimal(8,2) UNSIGNED NOT NULL DEFAULT 0.00 COMMENT '',
			'EventInternalShippingCostTaxPercent': {'type': 'decimal', 'length': 50, 'empty': false}, // decimal(5,2) UNSIGNED NOT NULL DEFAULT 0.00 COMMENT '',
			'EventExternalShippingCostGross': {'type': 'decimal', 'length': 50, 'empty': false}, // decimal(8,2) UNSIGNED NOT NULL DEFAULT 0.00 COMMENT '',
			'EventExternalShippingCostTaxPercent': {'type': 'decimal', 'length': 50, 'empty': false}, // decimal(5,2) UNSIGNED NOT NULL DEFAULT 0.00 COMMENT '',
			'EventExternalHandlingFeeGross': {'type': 'decimal', 'length': 50, 'empty': false}, // decimal(8,2) UNSIGNED NOT NULL DEFAULT 0.00 COMMENT '',
			'EventExternalHandlingFeeTaxPercent': {'type': 'decimal', 'length': 50, 'empty': false}, // decimal(5,2) UNSIGNED NOT NULL DEFAULT 0.00 COMMENT '',
			'EventSendMailAddress': {'type': 'email', 'length': 50, 'empty': false}, // varchar(250) NULL COMMENT '',
			'EventSendMailServer': {'type': 'string', 'length': 50, 'empty': false}, // varchar(250) NULL COMMENT '',
			'EventSendMailServerPort': {'type': 'string', 'length': 50, 'empty': false}, // smallint(5) UNSIGNED NULL COMMENT '',
			'EventSendMailUsername': {'type': 'string', 'length': 50, 'empty': false}, // varchar(250) NULL COMMENT '',
			'EventSendMailPassword': {'type': 'string', 'length': 50, 'empty': false}, // varchar(100) NULL COMMENT '',
			'EventSendMailSettingsJSON': {'type': 'json', 'length': 50, 'empty': false}, // json NULL COMMENT 'special settings for send mail',
			'EventMpayTestFlag': {'type': 'boolean', 'length': 50, 'empty': false}, // tinyint(1) unsigned NOT NULL DEFAULT 1 COMMENT 'is mpay in test mode',
			'EventMpayMerchantID': {'type': 'string', 'length': 50, 'empty': false}, // varchar(10) NULL COMMENT 'mPAY MerchantID',
			'EventMpaySoapPassword': {'type': 'string', 'length': 50, 'empty': false}, // varchar(10) NULL COMMENT 'mPAY Soap Password',
			'EventMpayTestMerchantID': {'type': 'string', 'length': 50, 'empty': false}, // varchar(10) NULL DEFAULT '91442' COMMENT 'mPAY Test MerchantID',
			'EventMpayTestSoapPassword': {'type': 'string', 'length': 50, 'empty': false} // varchar(10) NULL DEFAULT 'RkYvWLAH?b' COMMENT 'mPAY Test Soap Password',
		}
	}

}

module.exports = Event;

