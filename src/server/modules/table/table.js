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
		this.fields = {
			TableNumber: {type: 'integer', length: 6, empty: false},	// int(6) NULL COMMENT 'number',
			TableName: {type: 'string', length: 100, empty: false},		// varchar(100) NULL COMMENT 'name internal description',
			TableLabel: {type: 'token', empty: true},					// varchar(100) NULL COMMENT 'label can be tokenized (eg §§TABLE or §§LOUGE)',
			TableSettings: {type: 'json', empty: true}					// json NULL COMMENT 'settings for this table (could be a canvas or svg object)',
		}
	}

}

module.exports = Table;
