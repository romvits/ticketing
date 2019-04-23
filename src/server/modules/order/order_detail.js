import Module from './../module';
import _ from 'lodash';

/**
 * floor module
 */
class OrderDetail extends Module {

	/**
	 * constructor for order detail
	 * @param clientConnID {String} 32 character string of connection ID
	 * @param ConnUserID {String} 32 character string of user ID
	 */
	constructor(ClientConnID) {
		super(ClientConnID);
		this.pk = 'OrderDetailID';
		this.table = 'innoOrderDetail';
		this.view = 'viewOrderDetail';
		this.fields = {
			'OrderDetailScanCode': {'type': 'string', 'length': 15, 'empty': false}, // varchar(15) NOT NULL COMMENT 'unique scancode of the order detail => 7 chars event prefix, EAN (1 digit rand, 6 digits number, 1 check digit)',
			'OrderDetailScanType': {'type': 'enum', 'empty': false}, // enum('single','multi','inout','test') NOT NULL DEFAULT 'single' COMMENT '',
			'OrderDetailOrderID': {'type': 'string', 'length': 32, 'empty': false}, // varchar(32) NOT NULL COMMENT 'unique id of the order that order detail belongs to',
			'OrderDetailType': {'type': 'enum', 'empty': false}, // enum('ticket','seat','special','shippingcost','handlingfee') NOT NULL COMMENT 'type of order detail => ti=entry ticket | se=seat at location | sp=special = >upselling like Tortengarantie | sc=shipping cost | hf=handling fee',
			'OrderDetailTypeID': {'type': 'string', 'length': 32, 'empty': false}, // varchar(32) NULL COMMENT 'id of the record from table => ticket (ti) | seat (se) | special (sp) | extra (sc and hf)',
			'OrderDetailState': {'type': 'enum', 'empty': false}, // enum('sold','canceled') NOT NULL COMMENT 'state of order detail => so=sold | ca=canceled',
			'OrderDetailEANRand': {'type': 'integer', 'length': 1, 'empty': false}, // tinyint(1) ZEROFILL NOT NULL DEFAULT 0 COMMENT 'EAN8 code first digit random',
			'OrderDetailNumber': {'type': 'integer', 'length': 6, 'empty': false}, // int(6) ZEROFILL NOT NULL DEFAULT 0 COMMENT 'ean 6 digits => continuous numerating depanding on event prefix',
			'OrderDetailEANCheckDigit': {'type': 'integer', 'length': 1, 'empty': false}, // tinyint(1) ZEROFILL NOT NULL DEFAULT 0 COMMENT 'check digit for the EAN8 code',
			'OrderDetailText': {'type': 'string', 'length': 150, 'empty': false}, // varchar(150) NULL COMMENT 'text of the line in the bill',
			'OrderDetailGrossRegular': {'type': 'decimal', 'length': '6,2', 'empty': false}, // decimal(8,2) NOT NULL DEFAULT 0.00 COMMENT 'regular gross => brutto regular price',
			'OrderDetailGrossDiscount': {'type': 'decimal', 'length': '6,2', 'empty': false}, // decimal(8,2) NOT NULL DEFAULT 0.00 COMMENT 'amount gross discount => brutto discount gross',
			'OrderDetailGrossPrice': {'type': 'decimal', 'length': '6,2', 'empty': false}, // decimal(8,2) NOT NULL DEFAULT 0.00 COMMENT 'price gross => brutto subtract amount discount gross',
			'OrderDetailTaxPercent': {'type': 'decimal', 'length': '3,2', 'empty': false} // decimal(5,2) NOT NULL DEFAULT 0.00 COMMENT 'tax in percent',
		}
	}
}

module.exports = OrderDetail;
