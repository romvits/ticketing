import Module from './../module';
import _ from 'lodash';

/**
 * floor module
 */
class OrderTax extends Module {

	/**
	 * constructor for order detail
	 * @param clientConnID {String} 32 character string of connection ID
	 * @param ConnUserID {String} 32 character string of user ID
	 */
	constructor(ClientConnID) {
		super(ClientConnID);
		this.pk = 'OrderTaxOrderID,OrderTaxPercent';
		this.table = 'innoOrderTax';
		this.view = 'viewOrderTax';
		this.fields = {
			'OrderTaxOrderID': {'type': 'string', 'length': 32, 'empty': false}, // varchar(32) NOT NULL COMMENT 'unique id of the order that order tax belongs to',
			'OrderTaxPercent': {'type': 'decimal', 'length': '3,2', 'empty': false}, // decimal(5,2) NOT NULL DEFAULT 0.00 COMMENT 'tax in percent',
			'OrderTaxAmount': {'type': 'decimal', 'length': '6,2', 'empty': false} // decimal(8,2) NOT NULL DEFAULT 0.00 COMMENT 'tax amount',
		}
	}
}

module.exports = OrderTax;
