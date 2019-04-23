import Module from './../module';
import _ from 'lodash';

/**
 * floor module
 */
class Floor extends Module {

	/**
	 * constructor for floor
	 * @param connID {String} 32 character string of connection ID from database table ``
	 * @param ConnUserID {String} 32 character string of user ID
	 */
	constructor(ClientConnID) {
		super(ClientConnID);
		this.pk = 'FloorID';
		this.table = 'innoFloor';
		this.view = 'viewFloor';
		this.fields = {}
	}

}

module.exports = Floor;
