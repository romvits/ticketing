import Module from './../module';
import _ from 'lodash';

class Location extends Module {

	/**
	 * constructor
	 * @param connID {String} 32 character string of connection ID from database table ``
	 */
	constructor(ClientConnID) {
		super(ClientConnID);
		this.pk = 'LocationID';
		this.table = 'innoLocation';
		this.view = 'viewLocation';
		this.fields = {
			LocationName: {type: 'string', length: 100, empty: false}, // varchar(150) NOT NULL COMMENT 'name',
			LocationStreet: {type: 'string', length: 100, empty: false}, // varchar(150) NULL COMMENT 'street',
			LocationCity: {type: 'string', length: 100, empty: false}, // varchar(100) NULL COMMENT 'city',
			LocationZIP: {type: 'string', length: 100, empty: false}, // varchar(10) NULL COMMENT 'zip',
			LocationCountryCountryISO2: {type: 'string', length: 100, empty: false}, // varchar(2) NULL COMMENT 'country',
			LocationPhone1: {type: 'string', length: 100, empty: false}, // varchar(30) NULL COMMENT 'phone number 1 of the location',
			LocationPhone2: {type: 'string', length: 100, empty: false}, // varchar(30) NULL COMMENT 'phone number 2 of the location',
			LocationFax: {type: 'string', length: 100, empty: false}, // varchar(30) NULL COMMENT 'fax number of the location',
			LocationEmail: {type: 'string', length: 100, empty: false}, // varchar(250) NULL COMMENT 'email for the location (office address)',
			LocationHomepage: {type: 'string', length: 100, empty: false}, // varchar(250) NULL COMMENT 'homepage for the location (office address)',
		}
	}
}

module.exports = Location;
