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
		this.fields = {
			FloorName: {type: 'string', length: 100, empty: false},		// varchar(100) NULL COMMENT 'name internal description',
			FloorLabel: {type: 'token', empty: true},		// varchar(100) NULL COMMENT 'label can be tokenized (eg §§FIRSTFLOOR)',
			FloorSVG: {type: 'longtext', empty: true}					// longtext NULL COMMENT 'SVG html string for this floor',
		}
	}
}

module.exports = Floor;
