import Module from './../module';
import _ from 'lodash';

/**
 * floor module
 */
class Room extends Module {

	/**
	 * constructor for floor
	 * @param clientConnID {String} 32 character string of connection ID
	 * @param ConnUserID {String} 32 character string of user ID
	 */
	constructor(ClientConnID) {
		super(ClientConnID);
		this.pk = 'RoomID';
		this.table = 'innoRoom';
		this.view = 'viewRoom';
		this.fields = {
			RoomName: {type: 'string', length: 100, empty: false}, 		// varchar(100) NULL COMMENT 'name',
			RoomLabel: {type: 'token', empty: true}, 	// varchar(100) NULL COMMENT 'label can be tokenized (eg §§FIRSTROOM)',
			RoomSVGShape: {type: 'longtext', length: 500, empty: false} 	// varchar(500) NULL COMMENT 'Shape coordinates for this room. this belongs/references to the FloorSVG from datbase table floor',
		}
	}

}

module.exports = Room;
