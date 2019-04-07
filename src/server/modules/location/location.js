import Module from './../module';
import _ from 'lodash';

const fields = {
	'LocationName': {'type': 'string', 'length': 200, 'empty': false},
	'LocationStreet': {'type': 'string', 'length': 200, 'empty': false},
	'plz': {'type': 'string', 'length': 10, 'empty': false},
	'ort': {'type': 'string', 'length': 200, 'empty': false},
	'land': {'type': 'string', 'length': 200, 'empty': false},
	'telefon': {'type': 'phone', 'length': 20, 'empty': false}
};

class Location extends Module {

	/**
	 * constructor
	 * @param connID {String} 32 character string of connection ID from database table ``
	 */
	constructor(ConnID = null, ConnUserID = null) {
		super(ConnID, ConnUserID);
		this.pk = 'LocationID';
		this.table = 'innoLocation';
		this.view = 'viewLocation';
		this.fields = {}
	}

		/**
	 * fetch all items by uuid related to database eventView (this._view)
	 * @param id {String} uuid 32 character string
	 */
	fetchAllByEvent(id) {

	}

	/**
	 * fetch all items by uuid related to database eventView (this._view)
	 * @param id {String} uuid 32 character string
	 */
	fetchAllByLocation(id) {

	}
}