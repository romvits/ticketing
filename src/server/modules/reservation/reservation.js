import Module from './../module';
import _ from 'lodash';

/**
 * floor module
 */
class Reservation extends Module {

	/**
	 * constructor for reservation
	 * @param clientConnID {String} 32 character string of connection ID
	 * @param ConnUserID {String} 32 character string of user ID
	 */
	constructor(ClientConnID) {
		super(ClientConnID);
		this.pk = 'ReservationID';
		this.table = 'innoReservation';
		this.view = 'viewReservation';
		this.fields = {
			ReservationID: {type: 'string', length: 32, empty: false}, 				// varchar(32) NOT NULL COMMENT 'unique id of the reservation',
			ReservationCode: {type: 'string', length: 10, empty: false}, 			// int(6) UNSIGNED ZEROFILL NULL COMMENT 'consecutive number of the reservation (why 6 digits and not less => it could be a stadium with more than 100.000 visitors and reservations)',
			ReservationEventID: {type: 'string', length: 32, empty: false}, 		// varchar(32) NOT NULL COMMENT 'id of the event that reservation belongs to',
			ReservationFromUserID: {type: 'string', length: 32, empty: false}, 		// varchar(32) NULL COMMENT 'unique id of the user the reservation was created (only if ReservationFrom = in)',
			ReservationUserID: {type: 'string', length: 32, empty: false}, 			// varchar(32) NULL COMMENT 'unique id of the user that reservation belongs to',
			ReservationComment: {type: 'string', length: 500, empty: true}, 		// varchar(150) NULL COMMENT 'company',
			ReservationEmail: {type: 'string', length: 250, empty: false}, 			// varchar(250) NULL COMMENT 'actual email address of user => is used to send mail to customer',
			ReservationPhone: {type: 'string', length: 30, empty: false}, 			// varchar(30) NULL COMMENT 'actual phone number of user',
		}
	}
}

module.exports = Reservation;
