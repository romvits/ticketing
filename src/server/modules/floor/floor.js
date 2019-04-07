import Module from './../module';
import _ from 'lodash';

/**
 * floor module
 */
class Floor extends Module {

	/**
	 * constructor for floor
	 * @param connID {String} 32 character string of connection ID from database table ``
	 */
	constructor(ConnID = null, ConnUserID = null) {
		super(ConnID, ConnUserID);
		this.pk = 'FloorID';
		this.table = 'innoFloor';
		this.view = 'viewFloor';
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

module.exports = Floor;


