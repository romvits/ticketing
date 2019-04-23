import Module from './../module';
import _ from 'lodash';

/**
 * floor module
 */
class Table extends Module {

	/**
	 * constructor for floor
	 * @param clientConnID {String} 32 character string of connection ID
	 * @param ConnUserID {String} 32 character string of user ID
	 */
	constructor(ClientConnID) {
		super(ClientConnID);
		this.pk = 'TableID';
		this.table = 'innoTable';
		this.view = 'viewTable';
		this.fields = {}
	}

}

module.exports = Table;
