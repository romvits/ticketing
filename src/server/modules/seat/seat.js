import Module from './../module';
import _ from 'lodash';

/**
 * floor module
 */
class Seat extends Module {

	/**
	 * constructor for seat
	 * @param clientConnID {String} 32 character string of connection ID
	 * @param ConnUserID {String} 32 character string of user ID
	 */
	constructor(ClientConnID) {
		super(ClientConnID);
		this.pk = 'SeatID';
		this.table = 'innoSeat';
		this.view = 'viewSeat';
		this.fields = {}
	}

}

module.exports = Seat;
