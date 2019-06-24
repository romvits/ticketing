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
			SeatNumber: {type: 'integer', length: 6, empty: false},				// int(6) UNSIGNED NULL COMMENT 'number',
			SeatRow: {type: 'integer', length: 6, empty: false},				// int(6) UNSIGNED NULL COMMENT 'eg cinema',
			SeatName: {type: 'string', length: 100, empty: false},				// varchar(100) NULL COMMENT 'name internal description',
			SeatLabel: {type: 'token', empty: false},							// varchar(100) NULL COMMENT 'label can be tokenized (eg §§SEAT, §§AREAONE or §§SECTORTWO)',
			SeatSettings: {type: 'json', empty: true},							// json NULL COMMENT 'settings for this seat (could be a canvas or svg object)',
			SeatGrossPrice: {type: 'decimal', length: '6,2', empty: false},		// decimal(8,2) UNSIGNED NOT NULL DEFAULT 0.00 COMMENT 'price gross => brutto',
			SeatTaxPercent: {type: 'decimal', length: '3,2', empty: false}		// decimal(5,2) UNSIGNED NOT NULL DEFAULT 0.00 COMMENT 'tax in percent',
		}
	}

}

module.exports = Seat;
