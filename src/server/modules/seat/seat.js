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
		this.fields = {
			SeatID: {type: 'string', length: 32, empty: false},                // varchar(32) NOT NULL COMMENT 'unique id of the table',
			SeatLocationID: {type: 'string', length: 32, empty: false},       // varchar(32) NULL COMMENT 'unique id of the location that seat belongs to if NULL this seat belongs to a event',
			SeatEventID: {type: 'string', length: 32, empty: false},           // varchar(32) NULL COMMENT 'unique id of the event that seat belongs to',
			SeatFloorID: {type: 'string', length: 32, empty: false},          // varchar(32) NULL COMMENT 'unique id of the floor that seat belongs to (floor is perhaps not needed)',
			SeatRoomID: {type: 'string', length: 32, empty: false},          // varchar(32) NOT NULL COMMENT 'unique id of the room that seat belongs to',
			SeatTableID: {type: 'string', length: 32, empty: false},         // varchar(32) NULL COMMENT 'unique id of the table that seat belongs to if NULL this seat belongs to a floor (no table for this seat eg cinema, theater or stadium)',
			SeatOrderID: {type: 'string', length: 32, empty: false},        // varchar(32) NULL COMMENT 'id of the order that seat was assigned to',
			SeatReservationID: {type: 'string', length: 32, empty: false},   // varchar(32) NULL COMMENT 'id of the reservation that seat was assigned to',
			SeatNumber: {type: 'integer', length: 6, empty: false},          // int(6) UNSIGNED NULL COMMENT 'number',
			SeatRow: {type: 'integer', length: 6, empty: false},           // int(6) UNSIGNED NULL COMMENT 'eg cinema',
			SeatName: {type: 'string', length: 32, empty: false},          // varchar(100) NULL COMMENT 'name internal description',
			SeatLabel: {type: 'string', length: 32, empty: false},         // varchar(100) NULL COMMENT 'label can be tokenized (eg §§SEAT, §§AREAONE or §§SECTORTWO)',
			SeatSettings: {type: 'string', length: 32, empty: false},      // vjson NULL COMMENT 'settings for this seat (could be a canvas or svg object)',
			SeatGrossPrice: {type: 'decimal', length: '6,2', empty: false},      // decimal(8,2) UNSIGNED NOT NULL DEFAULT 0.00 COMMENT 'price gross => brutto',
			SeatTaxPercent: {type: 'decimal', length: '3,2', empty: false}       // decimal(5,2) UNSIGNED NOT NULL DEFAULT 0.00 COMMENT 'tax in percent',
		}
	}

}

module.exports = Seat;
