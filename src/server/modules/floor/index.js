import Module from './../module';
import _ from 'lodash';

class Floor extends Module {

	constructor(connID = null) {
		super(connID);
		this.pk = 'FloorID';
		this.table = 'innoFloor';
		this.view = 'viewFloor';
		this.fields = {}
	}

}

module.exports = Floor;


