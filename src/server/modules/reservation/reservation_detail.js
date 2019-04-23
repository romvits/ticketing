import Module from './../module';
import _ from 'lodash';

/**
 * floor module
 */
class ReservationDetail extends Module {

	/**
	 * constructor for reservation detail
	 * @param clientConnID {String} 32 character string of connection ID
	 * @param ConnUserID {String} 32 character string of user ID
	 */
	constructor(ClientConnID) {
		super(ClientConnID);
		this.pk = 'ReservationDetailID';
		this.table = 'innoReservationDetail';
		this.view = 'viewReservationDetail';
		this.fields = {
			'ReservationDetailReservationID': {'type': 'string', 'length': 32, 'empty': false}, // varchar(32) NOT NULL COMMENT 'unique id of the reservation that reservation detail belongs to',
			'ReservationDetailType': {'type': 'enum', 'empty': false}, // enum('ticket','seat','special') NOT NULL COMMENT 'type of reservation detail => ti=entry ticket | se=seat at location | sp=special = >upselling like Tortengarantie | sc=shipping cost | hf=handling fee',
			'ReservationDetailTypeID': {'type': 'string', 'length': 32, 'empty': true} // varchar(32) NULL COMMENT 'id of the record from table => ticket (ti) | seat (se) | special (sp)',
		}
	}
}

module.exports = ReservationDetail;
