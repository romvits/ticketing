import Module from './../module';
import _ from 'lodash';

/**
 * event module
 */
class Event extends Module {

	/**
	 * constructor
	 * @param connID {String} 32 character string of connection ID from database table ``
	 */
	constructor(ConnID = null, ConnUserID = null) {
		super(ConnID, ConnUserID);
		this.pk = 'EventID';
		this.table = 'innoEvent';
		this.view = 'viewEvent';
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

module.exports = Event;


