import Module from './../module';
import _ from 'lodash';

/**
 * floor module
 */
class Ticket extends Module {

	/**
	 * constructor for ticket
	 * @param clientConnID {String} 32 character string of connection ID
	 * @param ConnUserID {String} 32 character string of user ID
	 */
	constructor(ClientConnID) {
		super(ClientConnID);
		this.pk = 'TicketID';
		this.table = 'innoTicket';
		this.view = 'viewTicket';
		this.fields = {
			TicketID: {type: 'string', length: 32, empty: false},				// varchar(32) NOT NULL COMMENT 'unique id of the ticket',
			TicketEventID: {type: 'string', length: 32, empty: false},			// varchar(32) NULL COMMENT 'unique id of the event that ticket belongs to',
			TicketOnline: {},															// tinyint(1) UNSIGNED NULL COMMENT 'is this ticket from outside world/homepage reachable (online)? if set to 0 can be used for innoSpecialOffer',
			TicketMaximumOnline: {},													// tinyint(2) UNSIGNED NULL COMMENT 'maximum number (amount) of tickets for online orders',
			TicketSortOrder: {},														// tinyint(2) UNSIGNED NOT NULL DEFAULT 0 COMMENT 'sort order for the ticket',
			TicketName: {type: 'string', length: 100, empty: false},			// varchar(100) NULL COMMENT 'name',
			TicketLable: {type: 'string', length: 100, empty: false},			// varchar(100) NULL COMMENT 'label, translation token starting with §§ (eg §§STUDENT)',
			TicketType: {type: 'enum', length: 100, empty: false},				// enum('ticket','special') NOT NULL DEFAULT 'ticket' COMMENT 'type of ticket ticket=>normal ticket | special=>special ticket (upselling) like Tortengarantie',
			TicketScanType: {type: 'enum', length: 100, empty: false},			// enum('single','multi','inout','test') NOT NULL DEFAULT 'single' COMMENT '',
			TicketContingent: {type: 'string', length: 100, empty: false},		// int(6) NULL COMMENT 'how many tickets of this type are available (preprinted are included => will be a special function)',
			TicketGrossPrice: {type: 'decimal', length: '6,2', empty: false},		// decimal(8,2) UNSIGNED NOT NULL DEFAULT 0.00 COMMENT 'regular price gross => brutto',
			TicketTaxPercent: {type: 'decimal', length: '3,2', empty: false}		// decimal(5,2) UNSIGNED NOT NULL DEFAULT 0.00 COMMENT 'tax in percent',
		}
	}
}

module.exports = Ticket;
