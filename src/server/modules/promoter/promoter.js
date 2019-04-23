import Module from './../module';
import _ from 'lodash';

/**
 * event module
 */
class Promoter extends Module {

	/**
	 * constructor
	 * @param connID {String} 32 character string of connection ID from database table ''
	 */
	constructor(ClientConnID) {
		super(ClientConnID);
		this.pk = 'PromoterID';
		this.table = 'innoPromoter';
		this.view = 'viewPromoter';
		this.fields = {
			'PromoterName': {'type': 'string', 'length': 100, 'empty': false}, // varchar(150) NOT NULL COMMENT 'name',
			'PromoterStreet': {'type': 'string', 'length': 100, 'empty': false}, // varchar(150) NULL COMMENT 'street',
			'PromoterCity': {'type': 'string', 'length': 100, 'empty': false}, // varchar(100) NULL COMMENT 'city',
			'PromoterZIP': {'type': 'string', 'length': 100, 'empty': false}, // varchar(10) NULL COMMENT 'zip',
			'PromoterCountryCountryISO2': {'type': 'string', 'length': 100, 'empty': false}, // varchar(2) NULL COMMENT 'country',
			'PromoterPhone1': {'type': 'string', 'length': 100, 'empty': false}, // varchar(30) NULL COMMENT 'phone number 1 of the promoter',
			'PromoterPhone2': {'type': 'string', 'length': 100, 'empty': false}, // varchar(30) NULL COMMENT 'phone number 2 of the promoter',
			'PromoterFax': {'type': 'string', 'length': 100, 'empty': false}, // varchar(30) NULL COMMENT 'fax number of the promoter',
			'PromoterEmail': {'type': 'string', 'length': 100, 'empty': false}, // varchar(250) NULL COMMENT 'email for the promoter (office address)',
			'PromoterHomepage': {'type': 'string', 'length': 100, 'empty': false}, // varchar(250) NULL COMMENT 'homepage for the promoter (office address)',
			'PromoterLocations': {'type': 'string', 'length': 100, 'empty': false}, //  int(6) NULL COMMENT 'null = no, 0 = no limit => how many locations are allowed for this promoter',
			'PromoterEvents': {'type': 'string', 'length': 100, 'empty': false}, //  int(6) NULL COMMENT 'null = no, 0 = no limit => how many events are allowed for this promoter',
			'PromoterEventsActive': {'type': 'string', 'length': 100, 'empty': false}, //  int(6) NULL COMMENT 'null = no, 0 = no limit => how many active events are allowed for this promoter',
		}
	}
}

module.exports = Promoter;
