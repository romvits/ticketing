import Module from './../module';
import _ from 'lodash';

/**
 * floor module
 */
class Seat extends Module {

	/**
	 * constructor for seat
	 * @param ConnID {String} 32 character string of connection ID
	 * @param ConnUserID {String} 32 character string of user ID
	 */
	constructor(ConnID = null, ConnUserID = null) {
		super(ConnID, ConnUserID);
		this.pk = 'SeatID';
		this.table = 'innoSeat';
		this.view = 'viewSeat';
		this.fields = {}
	}

}

module.exports = Seat;
