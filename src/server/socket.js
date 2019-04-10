import Io from 'socket.io';
import Helpers from './helpers';
import numeral from 'numeral';
import _ from 'lodash';
import randtoken from 'rand-token';
import SmtpClient from './mail/smtp_client';

// modules
import Base from './modules/base/base'
import Translation from './modules/translation/translation'
import User from './modules/user/user'
import List from './modules/list/list'
import Form from './modules/form/form'
import Promoter from './modules/promoter/promoter'
import Location from './modules/location/location'
import Event from './modules/event/event'
import Ticket from './modules/ticket/ticket'
import Floor from './modules/floor/floor'
import Room from './modules/room/room'
import Table from './modules/table/table'
import Seat from './modules/seat/seat'
import Order from './modules/order/order'
import Scan from './modules/scan/scan'

const logPrefix = 'SOCKET  ';

/**
 * socket.io server connections<br>
 * <br>
 * IMPORTANT INFORMATION!<br>
 * the examples which are shown here are for client side communication whith this server NOT for development<br>
 *
 * @extends Helpers
 * @example
 * // use this code in your website
 * <html>
 *    <head>
 *        <script type="text/javascript" src="/socket.io/socket.io.js"></script>
 *        <script type="text/javascript">
 *          socket = io('localhost', {
 *              transports: ['websocket']
 *          });
 *        </script>
 *    </head>
 * </html>
 */
class Socket extends Helpers {

	/**
	 * basic class for socket server
	 * @param config {Object} configuration settings from ./../.config.yaml
	 */
	constructor(config) {
		super();

		if (config) {
			this._config = config;
		}

		this._clients = 0;

		// base, translation and account
		const base = new Base();
		base.init().then(() => {
			this.translation = new Translation();
			this.translation.init();
		}).then(() => {

			this._io = Io(this._config.http);
			this._io.on('connection', client => {

				// initialize a new client connection
				this.connect(client);

				// BASIC
				this.disconnect(client);
				this.setLangCode(client);

				// USER
				this.userCreate(client);
				this.userUpdate(client);
				this.userDelete(client);
				this.userLogin(client);
				this.userLogout(client);
				this.userLogoutByToken(client);

				// LIST
				this.listCreate(client);
				this.listUpdate(client);
				this.listDelete(client);
				this.listInit(client);
				this.listFetch(client);

				// FORM
				this.formInit(client);

				// PROMOTER
				this.promoterCreate(client);
				this.promoterUpdate(client);
				this.promoterDelete(client);
				this.promoterFetch(client);

				// LOCATION
				this.locationCreate(client);
				this.locationUpdate(client);
				this.locationDelete(client);
				this.locationFetch(client);

				// EVENT
				this.eventCreate(client);
				this.eventUpdate(client);
				this.eventDelete(client);
				this.eventFetch(client);

				// TICKET
				this.ticketCreate(client);
				this.ticketUpdate(client);
				this.ticketDelete(client);
				this.ticketFetch(client);

				// FLOOOR
				this.floorCreate(client);
				this.floorUpdate(client);
				this.floorDelete(client);
				this.floorFetch(client);

				// ROOM
				this.roomCreate(client);
				this.roomUpdate(client);
				this.roomDelete(client);
				this.roomFetch(client);

				// TABLE
				this.tableCreate(client);
				this.tableUpdate(client);
				this.tableDelete(client);
				this.tableFetch(client);

				// SEAT
				this.seatCreate(client);
				this.seatUpdate(client);
				this.seatDelete(client);
				this.seatFetch(client);

				// ORDER
				this.orderCreate(client);
				this.orderUpdate(client);
				this.orderDelete(client);
				this.orderFetch(client);

				// SCAN
				this.scanCreate(client);
			});
		}).catch((err) => {
			console.log(err);
		});

	}

	// BASE =================================================================================================
	/**
	 * connection<br>
	 * a new websocket client has connected to the server<br>
	 * update count and save connection data to database table `memClientConn`
	 * @param client {Object} socket.io connection object
	 */
	connect(client) {

		client.userdata = {
			UserID: null,
			ConnToken: randtoken.generate(32),
			LangCode: this._detectLang(client.handshake)
		}

		let values = {
			'ClientConnID': client.id,
			'ClientConnToken': client.userdata.ConnToken,
			'ClientConnLangCode': client.userdata.LangCode,
			'ClientConnAddress': (client.handshake && client.handshake.address) ? client.handshake.address : '',
			'ClientConnUserAgent': (client.handshake && client.handshake.headers && client.handshake.headers["user-agent"]) ? client.handshake.headers["user-agent"] : ''
		};

		const base = new Base(client.id, client.userdata.UserID);
		base.connection(values).then(() => {
			this._clients++;
			this._logMessage(client, 'client connected', client.handshake);
		}).catch((err) => {
			this._logError(client, 'connection', err);
		});
	}

	/**
	 * disconnect<br>
	 * client disconnected from server
	 * reduce number of connections and delete entry from database table `memClientConn`
	 * @param client {Object} socket.io connection object
	 */
	disconnect(client) {
		const evt = 'disconnect';
		client.on(evt, () => {
			const base = new Base(client.id, client.userdata.UserID);
			base.disconnect().then(() => {
				this._clients--;
				this._logMessage(client, evt);
			}).catch((err) => {
				this._logError(client, evt, err);
			});
		});
	}

	/**
	 * set language for connected client<br>
	 * available language are stored in database table `feLang`
	 * @example
	 * socket.on('set-language', (res)=>{console.log(res);}); // the language for this client was set
	 * socket.emit('set-language', langCode); // sets the actual language for this connected client
	 * @param client {Object} socket.io connection object
	 */
	setLangCode(client) {
		const evt = 'set-language';
		client.on(evt, (LangCode) => {
			const base = new Base(client.id, client.userdata.UserID);
			base.setConnectionLanguage(LangCode).then((res) => {
				client.emit(evt, true);
				this._logMessage(client, evt, LangCode);
			}).catch((err) => {
				console.log(err);
			});
		});
	}

	// USER =================================================================================================
	/**
	 * user create<br>
	 * create new user
	 * socket.on('user-create', (res)=>{console.log(res);}); // login success
	 * socket.on('user-create-err', (err)=>{console.log(err);}); // login error
	 * socket.emit('user-create', {
	 * 	'UserType': null,						// null = normal user (customer), 'admin' = administrator, 'promoter' = promoter
	 * 	'UserEmail': 'test1.test1@test1.at',
	 * 	'UserLangCode': 'de-at',
	 * 	'UserCompany': 'Test 1',
	 * 	'UserCompanyUID': 'AT Test 1',
	 * 	'UserGender': 'm',
	 * 	'UserTitle': 'Dr.',
	 * 	'UserFirstname': 'Test First Name 1',
	 * 	'UserLastname': 'Test Last Name 1',
	 * 	'UserStreet': 'Test Street 1',
	 * 	'UserCity': 'Test City 1',
	 * 	'UserZIP': '1234',
	 * 	'UserCountryCountryISO2': 'AT',
	 * 	'UserPassword': cryptPassword('abcdefg1'),
	 * 	'UserPasswordCheck': cryptPassword('abcdefg1')
	 * });
	 * @param client {Object} socket.io connection object
	 */
	userCreate(client) {
		const evt = 'user-create';
		client.on(evt, (req) => {
			const user = new User(client.id, client.userdata.UserID);
			user.create(req).then((res) => {
				client.emit(evt, res);
				this._logMessage(client, evt, res);
			}).catch((err) => {
				client.emit(evt + '-err', err);
				this._logError(client, evt, err);
			});
		});
	}

	/**
	 * user update<br>
	 * update existing user
	 * @example
	 * socket.on('user-create', (res)=>{console.log(res);}); // login success
	 * socket.on('user-create-err', (err)=>{console.log(err);}); // login error
	 * socket.emit('user-create', {
	 * 	'UserID': 'ID of existing user',
	 * 	'UserType': null,									// null = normal user (customer), 'admin' = administrator, 'promoter' = promoter
	 * 	'UserEmail': 'test1.test1@test1.at',
	 * 	'UserLangCode': 'de-at',
	 * 	'UserCompany': 'Company 1',
	 * 	'UserCompanyUID': 'AT Test 1',
	 * 	'UserGender': 'm',									// m = male, f = female
	 * 	'UserTitle': 'Dr.',
	 * 	'UserFirstname': 'First Name 1',
	 * 	'UserLastname': 'Last Name 1',
	 * 	'UserStreet': 'Street 1',
	 * 	'UserCity': 'City 1',
	 * 	'UserZIP': '1234',
	 * 	'UserCountryCountryISO2': 'AT',
	 * 	'UserPassword': cryptPassword('abcdefg1!'),			// (md5(sha256(UserPassword))) https://github.com/emn178/js-sha256 and https://github.com/blueimp/JavaScript-MD5/blob/master/js/md5.min.js
	 * 	'UserPasswordCheck': cryptPassword('abcdefg1!')
	 * });
	 * @param client {Object} socket.io connection object
	 */
	userUpdate(client) {
		const evt = 'user-update';
		client.on(evt, (req) => {
			const user = new User(client.id, client.userdata.UserID);
			user.update(req).then((res) => {
				client.emit(evt, res);
				this._logMessage(client, evt, res);
			}).catch((err) => {
				client.emit(evt + '-err', err);
				this._logError(client, evt, err);
			});
		});
	}

	/**
	 * user delete<br>
	 * delete existing user
	 * @example
	 * socket.on('user-delete', (res)=>{console.log(res);});
	 * socket.on('user-delete-err', (err)=>{console.log(err);});
	 * socket.emit('user-delete', 'ID of existing user');
	 * @param client {Object} socket.io connection object
	 */
	userDelete(client) {
		const evt = 'user-delete';
		client.on(evt, (id) => {
			const user = new User(client.id, client.userdata.UserID);
			user.delete(id).then((res) => {
				client.emit(evt, res);
				this._logMessage(client, evt, res);
			}).catch((err) => {
				client.emit(evt + '-err', err);
				this._logError(client, evt, err);
			});
		});
	}

	/**
	 * user login<br>
	 * updates database table `memClientConn`
	 * @example
	 * socket.on('user-login', (res)=>{console.log(res);}); // login success
	 * socket.on('user-login-err', (err)=>{console.log(err);}); // login error
	 * socket.on('user-login-token', (res)=>{console.log(res);}); // login success but already logged in on other device. use user-logout-token to logout from other device
	 * socket.emit('user-login', {'UserEmail':email,'UserPassword':md5(sha256(password))}); // send login request
	 * @param client {Object} socket.io connection object
	 */
	userLogin(client) {
		const evt = 'user-login';
		client.on(evt, (req) => {
			const user = new User(client.id, client.userdata.UserID);
			user.login(req).then((res) => {
				client.lang = res.UserLangCode;
				if (!res.LogoutToken) {
					client.userdata.UserID = res.UserID;
					client.userdata.LangCode = res.UserLangCode;
					client.emit(evt, res);
					this._logMessage(client, evt, req);
				} else {
					client.emit('user-login-token', res.LogoutToken);
					this._logMessage(client, 'user-logout-token', req);
				}
			}).catch((err) => {
				client.emit(evt + '-err', err);
				this._logError(client, evt + '-err', req);
			});
		});
	}

	/**
	 * user logout<br>
	 * updates database table `memClientConn`
	 * @example
	 * socket.on('user-logout', (res)=>{console.log(res);}); // logout success
	 * socket.emit('user-logout', null); // send logout request
	 * @param client {Object} socket.io connection object
	 */
	userLogout(client) {
		const evt = 'user-logout';
		client.on(evt, () => {
			const user = new User(client.id, client.userdata.UserID);
			user.logout().then((res) => {
				client.emit(evt, true);
				this._logMessage(client, evt);
			}).catch((err) => {
				client.emit(evt, err);
				this._logError(client, evt);
			});
		});
	}

	/**
	 * user logout by token<br>
	 * updates database table `memClientConn`
	 * @example
	 * socket.on('user-logout-token', (res)=>{console.log(res);}); // user was logged out by token (effects all connected devices which where logged in with that user data)
	 * socket.emit('user-logout-token', token); // send token logout request. the value 'token' 128 characters was send by server on login request when a user tried to log in but was logged in on other device (mobile phone, browser tab, ...)
	 * @param client {Object} socket.io connection object
	 */
	userLogoutByToken(client) {
		const evt = 'user-logout-token';
		client.on(evt, (LogoutToken) => {
			const user = new User(client.id, client.userdata.UserID);
			user.logoutToken(LogoutToken).then((res) => {
				_.each(res, (row) => {
					this._io.to(`${row.ClientConnID}`).emit('user-logout', false);
					this._io.to(`${row.ClientConnID}`).emit('user-logout', true);
				});
				client.emit('user-logout', false);
			}).catch((err) => {
				this._logError(client, evt, err);
			});
		});
	}

	// LIST =================================================================================================
	/**
	 * list create<br>
	 * create new list
	 * @example
	 * socket.on('list-create', (res)=>{console.log(res);});
	 * socket.on('list-create-err', (err)=>{console.log(err);});
	 * socket.emit('list-create', {
	 *	'ListName': 'Name',
	 *	'ListLabel': '§§LISTNAME',
	 *	'ListTable': 'database Table Name',
	 *	'ListPK': 'Name',
	 *	'ListMaskID': 'MaskID',
	 *	'ListLimit': 100,
	 *	'ListJSON': {"orderby": [{"FieldName1": ""}, {"FieldName2": "desc"}, {"FieldName3": ""}], "editable": 0},
	 *	'ListColumn': [{
	 *		'ListColumnOrder': 1,
	 *		'ListColumnName': 'Column_1',
	 *		'ListColumnType': 'text',
	 *		'ListColumnWidth': 150,
	 *		'ListColumnEditable': 0,
	 *		'ListColumnLabel': '§§Column1',
	 *		'ListColumnJSON': '{}'
	 *	}, {
	 *		'ListColumnOrder': 2,
	 *		'ListColumnName': 'Column_2',
	 *		'ListColumnType': 'text',
	 *		'ListColumnWidth': 150,
	 *		'ListColumnEditable': 0,
	 *		'ListColumnLabel': '§§Column2',
	 *		'ListColumnJSON': '{}'
	 *	}
	 * });
	 * @param client {Object} socket.io connection object
	 */
	listCreate(client) {
		const evt = 'list-create';
		client.on(evt, (req) => {
			const list = new List(client.id, client.userdata.UserID);
			list.create(req).then((res) => {
				client.emit(evt, res);
				this._logMessage(client, evt, res);
			}).catch((err) => {
				client.emit(evt + '-err', err);
				this._logError(client, evt, err);
			});
		});
	}

	/**
	 * list update<br>
	 * update existing list
	 * @example
	 * socket.on('list-update', (res)=>{console.log(res);});
	 * socket.on('list-update-err', (err)=>{console.log(err);});
	 * socket.emit('list-update', {
	 *	'ListID': 'ID of existing list',
	 *	'ListName': 'Name',
	 *	'ListTable': 'database Table Name',
	 *	'ListPK': 'Name',
	 *	'ListMaskID': 'MaskID',
	 *	'ListLimit': 100,
	 *	'ListJSON': {"orderby": [{"FieldName1": ""}, {"FieldName2": "desc"}, {"FieldName3": ""}], "editable": 0},
	 *	'ListColumn': [{
	 *		'ListColumnOrder': 1,
	 *		'ListColumnName': 'Column 1',
	 *		'ListColumnType': 'text',
	 *		'ListColumnWidth': 150,
	 *		'ListColumnEditable': 0,
	 *		'ListColumnLabel': '§§Column1',
	 *		'ListColumnJSON': '{}'
	 *	}, {
	 *		'ListColumnOrder': 2,
	 *		'ListColumnName': 'Column 2',
	 *		'ListColumnType': 'text',
	 *		'ListColumnWidth': 150,
	 *		'ListColumnEditable': 0,
	 *		'ListColumnLabel': '§§Column2',
	 *		'ListColumnJSON': '{}'
	 *	}
	 * });
	 * @param client {Object} socket.io connection object
	 */
	listUpdate(client) {
		const evt = 'list-update';
		client.on(evt, (req) => {
			const list = new List(client.id, client.userdata.UserID);
			list.update(req).then((res) => {
				client.emit(evt, res);
				this._logMessage(client, evt, res);
			}).catch((err) => {
				client.emit(evt + '-err', err);
				this._logError(client, evt, err);
			});
		});
	}

	/**
	 * list delete<br>
	 * delete existing list
	 * @example
	 * socket.on('list-delete', (res)=>{console.log(res);});
	 * socket.on('list-delete-err', (err)=>{console.log(err);});
	 * socket.emit('list-delete', 'ID of existing List');
	 * @param client {Object} socket.io connection object
	 */
	listDelete(client) {
		const evt = 'list-delete';
		client.on(evt, (id) => {
			const list = new List(client.id, client.userdata.UserID);
			list.delete(id).then((res) => {
				client.emit(evt, res);
				this._logMessage(client, evt, res);
			}).catch((err) => {
				client.emit(evt + '-err', err);
				this._logError(client, evt, err);
			});
		});
	}

	/**
	 * list init<br>
	 * request a list configuration<br>
	 * @example
	 * socket.on('list-init', (res)=>{console.log(res);}); // response (configuration of list and columns)
	 * socket.on('list-init-err', (err)=>{console.log(err);});
	 * socket.emit('list-init', ListID); // request a list configuration
	 * @param client {Object} socket.io connection object
	 */
	listInit(client) {
		const evt = 'list-init';
		client.on(evt, (ListID) => {
			const list = new List(client.id, client.userdata.UserID);
			list.init(ListID).then((res) => {
				client.emit(evt, res);
				this._logMessage(client, evt);
			}).catch((err) => {
				client.emit(evt + '-err', err);
				this._logError(client, evt, err);
			});
		});
	}

	/**
	 * list fetch<br>
	 * fetch list rows<br>
	 * @example
	 * socket.on('list-fetch', (res)=>{console.log(res);}); // response (configuration of list and columns)
	 * socket.on('list-fetch-err', (err)=>{console.log(err);});
	 * socket.emit('list-fetch', {"list-fetch", {"ListID":"feList","from":0,"orderby":null,"orderdesc":false,"filter":{}}}); // request list rows
	 * @param client {Object} socket.io connection object
	 */
	listFetch(client) {
		const evt = 'list-fetch';
		client.on(evt, (req) => {
			req = {
				ListID: req.ListID,
				From: req.from,
				OrderBy: req.orderby,
				OrderDesc: req.orderdesc
			}
			const list = new List(client.id, client.userdata.UserID);
			list.fetch(req).then((res) => {
				client.emit(evt, res);
				this._logMessage(client, evt);
			}).catch((err) => {
				client.emit(evt + '-err', err);
				this._logError(client, evt, err);
			});
		});
	}

	// FORM =================================================================================================
	/**
	 * form init<br>
	 * request a form configuration
	 * @example
	 * socket.on('form-init', (res)=>{console.log(res);}); // response (configuration of form and field)
	 * socket.on('form-init-err', (err)=>{console.log(err);});
	 * socket.emit('form-init', FormID); // request a form configuration
	 * @param client {Object} socket.io connection object
	 */
	formInit(client) {
		const evt = 'form-init';
		client.on(evt, (req) => {
			const form = new Form(client.id, client.userdata.UserID);
			form.init(req.form_id).then((res) => {
				client.emit(evt, res);
				this._logMessage(client, evt);
			}).catch((err) => {
				client.emit(evt + '-err', err);
				this._logError(client, evt, err);
			});
		});
	}

	// PROMOTER =============================================================================================
	/**
	 * promoter create<br>
	 * create new promoter
	 * @example
	 * socket.on('promoter-create', (res)=>{console.log(res);});
	 * socket.on('promoter-create-err', (err)=>{console.log(err);});
	 * socket.emit('promoter-create', {
	 *	'PromoterID': null,
	 *	'PromoterName': '',
	 *	'PromoterStreet': '',
	 *	'PromoterCity': '',
	 *	'PromoterZIP': '',
	 *	'PromoterCountryCountryISO2': '',
	 *	'PromoterPhone1': '',
	 *	'PromoterPhone2': '',
	 *	'PromoterFax': '',
	 *	'PromoterEmail': '',
	 *	'PromoterHomepage': '',
	 *	'PromoterLocations': '',
	 *	'PromoterPromoters': '',
	 *	'PromoterPromotersActive': ''
	 * });
	 * @param client {Object} socket.io connection object
	 */
	promoterCreate(client) {
		const evt = 'promoter-create';
		client.on(evt, (req) => {
			const promoter = new Promoter(client.id, client.userdata.UserID);
			promoter.create(req).then((res) => {
				client.emit(evt, res);
				this._logMessage(client, evt, res);
			}).catch((err) => {
				client.emit(evt + '-err', err);
				this._logError(client, evt, err);
			});
		});
	}

	/**
	 * promoter update<br>
	 * update existing promoter
	 * @example
	 * socket.on('promoter-update', (res)=>{console.log(res);});
	 * socket.on('promoter-update-err', (err)=>{console.log(err);});
	 * socket.emit('promoter-update', {
	 *	'PromoterID': 'ID of existing promoter',
	 *	'PromoterName': '',
	 *	'PromoterStreet': '',
	 *	'PromoterCity': '',
	 *	'PromoterZIP': '',
	 *	'PromoterCountryCountryISO2': '',
	 *	'PromoterPhone1': '',
	 *	'PromoterPhone2': '',
	 *	'PromoterFax': '',
	 *	'PromoterEmail': '',
	 *	'PromoterHomepage': '',
	 *	'PromoterLocations': '',
	 *	'PromoterPromoters': '',
	 *	'PromoterPromotersActive': ''
	 * });
	 * @param client {Object} socket.io connection object
	 */
	promoterUpdate(client) {
		const evt = 'promoter-update';
		client.on(evt, (req) => {
			const promoter = new Promoter(client.id, client.userdata.UserID);
			promoter.update(req).then((res) => {
				client.emit(evt, res);
				this._logMessage(client, evt, res);
			}).catch((err) => {
				client.emit(evt + '-err', err);
				this._logError(client, evt, err);
			});
		});
	}

	/**
	 * promoter delete<br>
	 * delete existing promoter
	 * @example
	 * socket.on('promoter-delete', (res)=>{console.log(res);});
	 * socket.on('promoter-delete-err', (err)=>{console.log(err);});
	 * socket.emit('promoter-delete', PromoterID);
	 * @param client {Object} socket.io connection object
	 */
	promoterDelete(client) {
		const evt = 'promoter-delete';
		client.on(evt, (id) => {
			const promoter = new Promoter(client.id, client.userdata.UserID);
			promoter.delete(id).then((res) => {
				client.emit(evt, id);
				this._logMessage(client, evt, res);
			}).catch((err) => {
				client.emit(evt + '-err', err);
				this._logError(client, evt, err);
			});
		});
	}

	/**
	 * promoter fetch<br>
	 * fetch promoter
	 * @example
	 * socket.on('promoter-fetch', (res)=>{console.log(res);});
	 * socket.on('promoter-fetch-err', (err)=>{console.log(err);});
	 * socket.emit('promoter-fetch', PromoterID);
	 * @param client {Object} socket.io connection object
	 */
	promoterFetch(client) {
		const evt = 'promoter-fetch';
		client.on(evt, (id) => {
			const promoter = new Promoter(client.id, client.userdata.UserID);
			promoter.fetch(id).then((res) => {
				client.emit(evt, res);
				this._logMessage(client, evt, res);
			}).catch((err) => {
				client.emit(evt + '-err', err);
				this._logError(client, evt, err);
			});
		});
	}

	// LOCATION =============================================================================================
	/**
	 * location create<br>
	 * create new location
	 * @example
	 * socket.on('location-create', (res)=>{console.log(res);});
	 * socket.on('location-create-err', (err)=>{console.log(err);});
	 * socket.emit('location-create', {
	 *	'LocationID': null,
	 *	'LocationName': '',
	 *	'LocationStreet': '',
	 *	'LocationCity': '',
	 *	'LocationZIP': '',
	 *	'LocationCountryCountryISO2': '',
	 *	'LocationPhone1': '',
	 *	'LocationPhone2': '',
	 *	'LocationFax': '',
	 *	'LocationEmail': '',
	 *	'LocationHomepage': ''
	 * });
	 * @param client {Object} socket.io connection object
	 */
	locationCreate(client) {
		const evt = 'location-create';
		client.on(evt, (req) => {
			const location = new Location(client.id, client.userdata.UserID);
			location.create(req).then((res) => {
				client.emit(evt, res);
				this._logMessage(client, evt, res);
			}).catch((err) => {
				client.emit(evt + '-err', err);
				this._logError(client, evt, err);
			});
		});
	}

	/**
	 * location update<br>
	 * update existing location
	 * @example
	 * socket.on('location-update', (res)=>{console.log(res);});
	 * socket.on('location-update-err', (err)=>{console.log(err);});
	 * socket.emit('location-update', {
	 *	'LocationID': 'ID of existing location',
	 *	'LocationName': '',
	 *	'LocationStreet': '',
	 *	'LocationCity': '',
	 *	'LocationZIP': '',
	 *	'LocationCountryCountryISO2': '',
	 *	'LocationPhone1': '',
	 *	'LocationPhone2': '',
	 *	'LocationFax': '',
	 *	'LocationEmail': '',
	 *	'LocationHomepage': ''
	 * });
	 * @param client {Object} socket.io connection object
	 */
	locationUpdate(client) {
		const evt = 'location-update';
		client.on(evt, (req) => {
			const location = new Location(client.id, client.userdata.UserID);
			location.update(req).then((res) => {
				client.emit(evt, res);
				this._logMessage(client, evt, res);
			}).catch((err) => {
				client.emit(evt + '-err', err);
				this._logError(client, evt, err);
			});
		});
	}

	/**
	 * location delete<br>
	 * delete existing location
	 * @example
	 * socket.on('location-delete', (res)=>{console.log(res);});
	 * socket.on('location-delete-err', (err)=>{console.log(err);});
	 * socket.emit('location-delete', LocationID);
	 * @param client {Object} socket.io connection object
	 */
	locationDelete(client) {
		const evt = 'location-delete';
		client.on(evt, (id) => {
			const location = new Location(client.id, client.userdata.UserID);
			location.delete(id).then((res) => {
				client.emit(evt, id);
				this._logMessage(client, evt, res);
			}).catch((err) => {
				client.emit(evt + '-err', err);
				this._logError(client, evt, err);
			});
		});
	}

	/**
	 * location fetch<br>
	 * fetch location
	 * @example
	 * socket.on('location-fetch', (res)=>{console.log(res);});
	 * socket.on('location-fetch-err', (err)=>{console.log(err);});
	 * socket.emit('location-fetch', LocationID);
	 * @param client {Object} socket.io connection object
	 */
	locationFetch(client) {
		const evt = 'location-fetch';
		client.on(evt, (id) => {
			const location = new Location(client.id, client.userdata.UserID);
			location.fetch(id).then((res) => {
				client.emit(evt, res);
				this._logMessage(client, evt, res);
			}).catch((err) => {
				client.emit(evt + '-err', err);
				this._logError(client, evt, err);
			});
		});
	}

	// EVENT ================================================================================================
	/**
	 * event create<br>
	 * create new event
	 * @example
	 * socket.on('event-create', (res)=>{console.log(res);});
	 * socket.on('event-create-err', (err)=>{console.log(err);});
	 * socket.emit('event-create', {
	 *	'EventID': null,
	 *	'EventPromoterID': 'PromoterID | null',
	 *	'EventLocationID': 'LocationID | null',
	 *	'EventName': 'Event Name',
	 *	'EventPrefix': 'EPRE',
	 *	'EventPhone1': '+43123',
	 *	'EventPhone2': '+43456',
	 *	'EventFax': '+43789',
	 *	'EventEmail': 'event.email@test.tld',
	 *	'EventHomepage': 'http://eventhomepage.tld',
	 *	'EventSubdomain': 'epre-event-2019',
	 *	'EventStartBillNumber': 1234,
	 *	'EventMaximumSeats': 20,
	 *	'EventStepSeats': 2,
	 *	'EventDefaultTaxTicketPercent': 1.11,
	 *	'EventDefaultTaxSeatPercent': 1.22,
	 *	'EventStartDateTimeUTC': '2019-04-07 08:11:00',
	 *	'EventEndDateTimeUTC': '2019-04-07 08:12:00',
	 *	'EventSaleStartDateTimeUTC': '2019-04-07 08:13:00',
	 *	'EventSaleEndDateTimeUTC': '2019-04-07 08:14:00',
	 *	'EventScanStartDateTimeUTC': '2019-04-07 08:15:00',
	 *	'EventScanEndDateTimeUTC': '2019-04-07 08:16:00',
	 *	'EventInternalHandlingFeeGross': 2.11,
	 *	'EventInternalHandlingFeeTaxPercent': 2.22,
	 *	'EventInternalShippingCostGross': 2.33,
	 *	'EventInternalShippingCostTaxPercent': 2.44,
	 *	'EventExternalShippingCostGross': 2.55,
	 *	'EventExternalShippingCostTaxPercent': 2.66,
	 *	'EventExternalHandlingFeeGross': 2.77,
	 *	'EventExternalHandlingFeeTaxPercent': 2.88,
	 *	'EventSendMailAddress': 'event.email@test.tld',
	 *	'EventSendMailServer': 'smtp.test.tld',
	 *	'EventSendMailServerPort': 25,
	 *	'EventSendMailUsername': 'username',
	 *	'EventSendMailPassword': 'password',
	 *	'EventSendMailSettingsJSON': '{"test":"value"}',
	 *	'EventMpayTestFlag': 1,
	 *	'EventMpayMerchantID': '1234567890',
	 *	'EventMpaySoapPassword': 'passWD',
	 *	'EventMpayTestMerchantID': '0987654321',
	 *	'EventMpayTestSoapPassword': 'PASSwd'
	 * });
	 * @param client {Object} socket.io connection object
	 */
	eventCreate(client) {
		const evt = 'event-create';
		client.on(evt, (req) => {
			const event = new Event(client.id, client.userdata.UserID);
			event.create(req).then((res) => {
				client.emit(evt, res);
				this._logMessage(client, evt, res);
			}).catch((err) => {
				client.emit(evt + '-err', err);
				this._logError(client, evt, err);
			});
		});
	}

	/**
	 * event update<br>
	 * update existing event
	 * @example
	 * socket.on('event-update', (res)=>{console.log(res);});
	 * socket.on('event-update-err', (err)=>{console.log(err);});
	 * socket.emit('event-update', {
	 *	'EventID': 'ID of existing event',
	 *	'EventPromoterID': 'PromoterID | null',
	 *	'EventLocationID': 'LocationID | null',
	 *	'EventName': 'Event Name',
	 *	'EventPrefix': 'EPRE',
	 *	'EventPhone1': '+43123',
	 *	'EventPhone2': '+43456',
	 *	'EventFax': '+43789',
	 *	'EventEmail': 'event.email@test.tld',
	 *	'EventHomepage': 'http://eventhomepage.tld',
	 *	'EventSubdomain': 'epre-event-2019',
	 *	'EventStartBillNumber': 1234,
	 *	'EventMaximumSeats': 20,
	 *	'EventStepSeats': 2,
	 *	'EventDefaultTaxTicketPercent': 1.11,
	 *	'EventDefaultTaxSeatPercent': 1.22,
	 *	'EventStartDateTimeUTC': '2019-04-07 08:11:00',
	 *	'EventEndDateTimeUTC': '2019-04-07 08:12:00',
	 *	'EventSaleStartDateTimeUTC': '2019-04-07 08:13:00',
	 *	'EventSaleEndDateTimeUTC': '2019-04-07 08:14:00',
	 *	'EventScanStartDateTimeUTC': '2019-04-07 08:15:00',
	 *	'EventScanEndDateTimeUTC': '2019-04-07 08:16:00',
	 *	'EventInternalHandlingFeeGross': 2.11,
	 *	'EventInternalHandlingFeeTaxPercent': 2.22,
	 *	'EventInternalShippingCostGross': 2.33,
	 *	'EventInternalShippingCostTaxPercent': 2.44,
	 *	'EventExternalShippingCostGross': 2.55,
	 *	'EventExternalShippingCostTaxPercent': 2.66,
	 *	'EventExternalHandlingFeeGross': 2.77,
	 *	'EventExternalHandlingFeeTaxPercent': 2.88,
	 *	'EventSendMailAddress': 'event.email@test.tld',
	 *	'EventSendMailServer': 'smtp.test.tld',
	 *	'EventSendMailServerPort': 25,
	 *	'EventSendMailUsername': 'username',
	 *	'EventSendMailPassword': 'password',
	 *	'EventSendMailSettingsJSON': '{"test":"value"}',
	 *	'EventMpayTestFlag': 1,
	 *	'EventMpayMerchantID': '1234567890',
	 *	'EventMpaySoapPassword': 'passWD',
	 *	'EventMpayTestMerchantID': '0987654321',
	 *	'EventMpayTestSoapPassword': 'PASSwd'
	 * });
	 * @param client {Object} socket.io connection object
	 */
	eventUpdate(client) {
		const evt = 'event-update';
		client.on(evt, (req) => {
			const event = new Event(client.id, client.userdata.UserID);
			event.update(req).then((res) => {
				client.emit(evt, res);
				this._logMessage(client, evt, res);
			}).catch((err) => {
				client.emit(evt + '-err', err);
				this._logError(client, evt, err);
			});
		});
	}

	/**
	 * event delete<br>
	 * delete existing event
	 * @example
	 * socket.on('event-delete', (res)=>{console.log(res);});
	 * socket.on('event-delete-err', (err)=>{console.log(err);});
	 * socket.emit('event-delete', EventID);
	 * @param client {Object} socket.io connection object
	 */
	eventDelete(client) {
		const evt = 'event-delete';
		client.on(evt, (id) => {
			const event = new Event(client.id, client.userdata.UserID);
			event.delete(id).then((res) => {
				client.emit(evt, id);
				this._logMessage(client, evt, res);
			}).catch((err) => {
				client.emit(evt + '-err', err);
				this._logError(client, evt, err);
			});
		});
	}

	/**
	 * event fetch<br>
	 * fetch event
	 * @example
	 * socket.on('event-fetch', (res)=>{console.log(res);});
	 * socket.on('event-fetch-err', (err)=>{console.log(err);});
	 * socket.emit('event-fetch', EventID);
	 * @param client {Object} socket.io connection object
	 */
	eventFetch(client) {
		const evt = 'event-fetch';
		client.on(evt, (id) => {
			const event = new Event(client.id, client.userdata.UserID);
			event.fetch(id).then((res) => {
				client.emit(evt, res);
				this._logMessage(client, evt, res);
			}).catch((err) => {
				client.emit(evt + '-err', err);
				this._logError(client, evt, err);
			});
		});
	}

	// TICKET ===============================================================================================
	/**
	 * ticket create<br>
	 * create a new ticket
	 * @example
	 * socket.on('ticket-create', (res)=>{console.log(res);});
	 * socket.on('ticket-create-err', (err)=>{console.log(err);});
	 * socket.emit('ticket-create', {
	 *	'TicketID': null,
	 *	'TicketEventID': null,
	 *	'TicketName': 'Ticket Name',
	 *	'TicketLable': '§§TICKETLABEL',
	 *	'TicketType': 'ticket',
	 *	'TicketScanType': 'single',
	 *	'TicketQuota': 100,
	 *	'TicketQuotaPreprint': 20,
	 *	'TicketGrossPrice': 11.22,
	 *	'TicketTaxPercent': 12.34
	 * });
	 * @param client {Object} socket.io connection object
	 */
	ticketCreate(client) {
		const evt = 'ticket-create';
		client.on(evt, (req) => {
			const ticket = new Ticket(client.id, client.userdata.UserID);
			ticket.create(req).then((res) => {
				client.emit(evt, res);
				this._logMessage(client, evt, res);
			}).catch((err) => {
				client.emit(evt + '-err', err);
				this._logError(client, evt, err);
			});
		});
	}

	/**
	 * ticket update<br>
	 * update existing ticket
	 * @example
	 * socket.on('ticket-update', (res)=>{console.log(res);});
	 * socket.on('ticket-update-err', (err)=>{console.log(err);});
	 * socket.emit('ticket-update', {
	 *	'TicketID': null,
	 *	'TicketEventID': null,
	 *	'TicketName': 'Ticket Name',
	 *	'TicketLable': '§§TICKETLABEL',
	 *	'TicketType': 'ticket',
	 *	'TicketScanType': 'single',
	 *	'TicketQuota': 100,
	 *	'TicketQuotaPreprint': 20,
	 *	'TicketGrossPrice': 11.22,
	 *	'TicketTaxPercent': 12.34
	 * });
	 * @param client {Object} socket.io connection object
	 */
	ticketUpdate(client) {
		const evt = 'ticket-update';
		client.on(evt, (req) => {
			const ticket = new Ticket(client.id, client.userdata.UserID);
			ticket.update(req).then((res) => {
				client.emit(evt, res);
				this._logMessage(client, evt, res);
			}).catch((err) => {
				client.emit(evt + '-err', err);
				this._logError(client, evt, err);
			});
		});
	}

	/**
	 * ticket delete<br>
	 * delete existing ticket
	 * @example
	 * socket.on('ticket-delete', (res)=>{console.log(res);});
	 * socket.on('ticket-delete-err', (err)=>{console.log(err);});
	 * socket.emit('ticket-delete', TicketID);
	 * @param client {Object} socket.io connection object
	 */
	ticketDelete(client) {
		const evt = 'ticket-delete';
		client.on(evt, (id) => {
			const ticket = new Ticket(client.id, client.userdata.UserID);
			ticket.delete(id).then((res) => {
				client.emit(evt, id);
				this._logMessage(client, evt, res);
			}).catch((err) => {
				client.emit(evt + '-err', err);
				this._logError(client, evt, err);
			});
		});
	}

	/**
	 * ticket fetch<br>
	 * fetch ticket
	 * @example
	 * socket.on('ticket-fetch', (res)=>{console.log(res);});
	 * socket.on('ticket-fetch-err', (err)=>{console.log(err);});
	 * socket.emit('ticket-fetch', TicketID);
	 * @param client {Object} socket.io connection object
	 */
	ticketFetch(client) {
		const evt = 'ticket-fetch';
		client.on(evt, (id) => {
			const ticket = new Ticket(client.id, client.userdata.UserID);
			ticket.fetch(id).then((res) => {
				client.emit(evt, res);
				this._logMessage(client, evt, res);
			}).catch((err) => {
				client.emit(evt + '-err', err);
				this._logError(client, evt, err);
			});
		});
	}

	// FLOOR ================================================================================================
	/**
	 * floor create<br>
	 * create a new floor
	 * @example
	 * socket.on('floor-create', (res)=>{console.log(res);});
	 * socket.on('floor-create-err', (err)=>{console.log(err);});
	 * socket.emit('floor-create', {
	 *	'FloorID': null,
	 *	'FloorEventID': 'EventID | null',
	 *	'FloorLocationID': 'LocationID | null',
	 *	'FloorName': 'Name',
	 *	'FloorLabel': '§§TOKEN',
	 *	'FloorSVG': 'SVG String | null'
	 * });
	 * @param client {Object} socket.io connection object
	 */
	floorCreate(client) {
		const evt = 'floor-create';
		client.on(evt, (req) => {
			const floor = new Floor(client.id, client.userdata.UserID);
			floor.create(req).then((res) => {
				client.emit(evt, res);
				this._logMessage(client, evt, res);
			}).catch((err) => {
				client.emit(evt + '-err', err);
				this._logError(client, evt, err);
			});
		});
	}

	/**
	 * floor update<br>
	 * update existing floor
	 * @example
	 * socket.on('floor-update', (res)=>{console.log(res);});
	 * socket.on('floor-update-err', (err)=>{console.log(err);});
	 * socket.emit('floor-update', {
	 *	'FloorID': 'ID of existing floor',
	 *	'FloorEventID': 'EventID | null',
	 *	'FloorLocationID': 'LocationID | null',
	 *	'FloorName': 'Name',
	 *	'FloorLabel': '§§TOKEN',
	 *	'FloorSVG': 'SVG String | null'
	 * });
	 * @param client {Object} socket.io connection object
	 */
	floorUpdate(client) {
		const evt = 'floor-update';
		client.on(evt, (req) => {
			const floor = new Floor(client.id, client.userdata.UserID);
			floor.update(req).then((res) => {
				client.emit(evt, res);
				this._logMessage(client, evt, res);
			}).catch((err) => {
				client.emit(evt + '-err', err);
				this._logError(client, evt, err);
			});
		});
	}

	/**
	 * floor delete<br>
	 * delete existing floor
	 * @example
	 * socket.on('floor-delete', (res)=>{console.log(res);});
	 * socket.on('floor-delete-err', (err)=>{console.log(err);});
	 * socket.emit('floor-delete', FloorID);
	 * @param client {Object} socket.io connection object
	 */
	floorDelete(client) {
		const evt = 'floor-delete';
		client.on(evt, (id) => {
			const floor = new Floor(client.id, client.userdata.UserID);
			floor.delete(id).then((res) => {
				client.emit(evt, id);
				this._logMessage(client, evt, res);
			}).catch((err) => {
				client.emit(evt + '-err', err);
				this._logError(client, evt, err);
			});
		});
	}

	/**
	 * floor fetch<br>
	 * fetch floor
	 * @example
	 * socket.on('floor-fetch', (res)=>{console.log(res);});
	 * socket.on('floor-fetch-err', (err)=>{console.log(err);});
	 * socket.emit('floor-fetch', FloorID);
	 * @param client {Object} socket.io connection object
	 */
	floorFetch(client) {
		const evt = 'floor-fetch';
		client.on(evt, (id) => {
			const floor = new Floor(client.id, client.userdata.UserID);
			floor.fetch(id).then((res) => {
				client.emit(evt, res);
				this._logMessage(client, evt, res);
			}).catch((err) => {
				client.emit(evt + '-err', err);
				this._logError(client, evt, err);
			});
		});
	}

	// ROOM =================================================================================================
	/**
	 * room create<br>
	 * create a new room
	 * @example
	 * socket.on('room-create', (res)=>{console.log(res);});
	 * socket.on('room-create-err', (err)=>{console.log(err);});
	 * socket.emit('room-create', {
	 *	'RoomID': null,
	 *	'RoomFloorID': null,
	 *	'RoomName': '',
	 *	'RoomLabel': '',
	 *	'RoomSVGShape': '10,20,30,40'
	 * });
	 * @param client {Object} socket.io connection object
	 */
	roomCreate(client) {
		const evt = 'room-create';
		client.on(evt, (req) => {
			const room = new Room(client.id, client.userdata.UserID);
			room.create(req).then((res) => {
				client.emit(evt, res);
				this._logMessage(client, evt, res);
			}).catch((err) => {
				client.emit(evt + '-err', err);
				this._logError(client, evt, err);
			});
		});
	}

	/**
	 * room update<br>
	 * update existing room
	 * @example
	 * socket.on('room-update', (res)=>{console.log(res);});
	 * socket.on('room-update-err', (err)=>{console.log(err);});
	 * socket.emit('room-update', {
	 *	'RoomID': null,
	 *	'RoomFloorID': null,
	 *	'RoomName': '',
	 *	'RoomLabel': '',
	 *	'RoomSVGShape': '10,20,30,40'
	 * });
	 * @param client {Object} socket.io connection object
	 */
	roomUpdate(client) {
		const evt = 'room-update';
		client.on(evt, (req) => {
			const room = new Room(client.id, client.userdata.UserID);
			room.update(req).then((res) => {
				client.emit(evt, res);
				this._logMessage(client, evt, res);
			}).catch((err) => {
				client.emit(evt + '-err', err);
				this._logError(client, evt, err);
			});
		});
	}

	/**
	 * room delete<br>
	 * delete existing room
	 * @example
	 * socket.on('room-delete', (res)=>{console.log(res);});
	 * socket.on('room-delete-err', (err)=>{console.log(err);});
	 * socket.emit('room-delete', RoomID);
	 * @param client {Object} socket.io connection object
	 */
	roomDelete(client) {
		const evt = 'room-delete';
		client.on(evt, (id) => {
			const room = new Room(client.id, client.userdata.UserID);
			room.delete(id).then((res) => {
				client.emit(evt, id);
				this._logMessage(client, evt, res);
			}).catch((err) => {
				client.emit(evt + '-err', err);
				this._logError(client, evt, err);
			});
		});
	}

	/**
	 * room fetch<br>
	 * fetch room
	 * @example
	 * socket.on('room-fetch', (res)=>{console.log(res);});
	 * socket.on('room-fetch-err', (err)=>{console.log(err);});
	 * socket.emit('room-fetch', RoomID);
	 * @param client {Object} socket.io connection object
	 */
	roomFetch(client) {
		const evt = 'room-fetch';
		client.on(evt, (id) => {
			const room = new Room(client.id, client.userdata.UserID);
			room.fetch(id).then((res) => {
				client.emit(evt, res);
				this._logMessage(client, evt, res);
			}).catch((err) => {
				client.emit(evt + '-err', err);
				this._logError(client, evt, err);
			});
		});
	}

	// TABLE ================================================================================================
	/**
	 * table create<br>
	 * create a new table
	 * @example
	 * socket.on('table-create', (res)=>{console.log(res);});
	 * socket.on('table-create-err', (err)=>{console.log(err);});
	 * socket.emit('table-create', {
	 *	'TableID': null,
	 *	'TableRoomID': 'RoomID | null',
	 *	'TableNumber': 11,
	 *	'TableName': 'Name',
	 *	'TableLabel': '§§TOKEN',
	 *	'TableSettings': {} // json object of svg or canvas settings for this table
	 * });
	 * @param client {Object} socket.io connection object
	 */
	tableCreate(client) {
		const evt = 'table-create';
		client.on(evt, (req) => {
			const table = new Table(client.id, client.userdata.UserID);
			table.create(req).then((res) => {
				client.emit(evt, res);
				this._logMessage(client, evt, res);
			}).catch((err) => {
				client.emit(evt + '-err', err);
				this._logError(client, evt, err);
			});
		});
	}

	/**
	 * table update<br>
	 * update existing table
	 * @example
	 * socket.on('table-update', (res)=>{console.log(res);});
	 * socket.on('table-update-err', (err)=>{console.log(err);});
	 * socket.emit('table-update', {
	 *	'TableID': 'ID of existing table',
	 *	'TableRoomID': 'RoomID | null',
	 *	'TableNumber': 11,
	 *	'TableName': 'Name',
	 *	'TableLabel': '§§TOKEN',
	 *	'TableSettings': {} // json object of svg or canvas settings for this table
	 * });
	 * @param client {Object} socket.io connection object
	 */
	tableUpdate(client) {
		const evt = 'table-update';
		client.on(evt, (req) => {
			const table = new Table(client.id, client.userdata.UserID);
			table.update(req).then((res) => {
				client.emit(evt, res);
				this._logMessage(client, evt, res);
			}).catch((err) => {
				client.emit(evt + '-err', err);
				this._logError(client, evt, err);
			});
		});
	}

	/**
	 * table delete<br>
	 * delete existing table
	 * @example
	 * socket.on('table-delete', (res)=>{console.log(res);});
	 * socket.on('table-delete-err', (err)=>{console.log(err);});
	 * socket.emit('table-delete', TableID);
	 * @param client {Object} socket.io connection object
	 */
	tableDelete(client) {
		const evt = 'table-delete';
		client.on(evt, (id) => {
			const table = new Table(client.id, client.userdata.UserID);
			table.delete(id).then((res) => {
				client.emit(evt, id);
				this._logMessage(client, evt, res);
			}).catch((err) => {
				client.emit(evt + '-err', err);
				this._logError(client, evt, err);
			});
		});
	}

	/**
	 * table fetch<br>
	 * fetch table
	 * @example
	 * socket.on('table-fetch', (res)=>{console.log(res);});
	 * socket.on('table-fetch-err', (err)=>{console.log(err);});
	 * socket.emit('table-fetch', TableID);
	 * @param client {Object} socket.io connection object
	 */
	tableFetch(client) {
		const evt = 'table-fetch';
		client.on(evt, (id) => {
			const table = new Table(client.id, client.userdata.UserID);
			table.fetch(id).then((res) => {
				client.emit(evt, res);
				this._logMessage(client, evt, res);
			}).catch((err) => {
				client.emit(evt + '-err', err);
				this._logError(client, evt, err);
			});
		});
	}

	// SEAT =================================================================================================
	/**
	 * seat create<br>
	 * create a new seat
	 * @example
	 * socket.on('seat-create', (res)=>{console.log(res);});
	 * socket.on('seat-create-err', (err)=>{console.log(err);});
	 * socket.emit('seat-create', {
	 *	'SeatID': null,
	 *	'SeatTableID': 'TableID | null', // null can be for location without table like cinema
	 *	'SeatNumber': '',
	 *	'SeatName': '',
	 *	'SeatSettings': {}, // json object of svg or canvas settings for this seat
	 *	'SeatGrossPrice': 11.22,
	 *	'SeatTaxPercent': 20
	 * });
	 * @param client {Object} socket.io connection object
	 */
	seatCreate(client) {
		const evt = 'seat-create';
		client.on(evt, (req) => {
			const seat = new Seat(client.id, client.userdata.UserID);
			seat.create(req).then((res) => {
				client.emit(evt, res);
				this._logMessage(client, evt, res);
			}).catch((err) => {
				client.emit(evt + '-err', err);
				this._logError(client, evt, err);
			});
		});
	}

	/**
	 * seat update<br>
	 * update existing seat
	 * @example
	 * socket.on('seat-update', (res)=>{console.log(res);});
	 * socket.on('seat-update-err', (err)=>{console.log(err);});
	 * socket.emit('seat-update', {
	 *	'SeatID': null,
	 *	'SeatTableID': 'TableID | null', // null can be for location without table like cinema
	 *	'SeatNumber': '',
	 *	'SeatName': '',
	 *	'SeatSettings': {}, // json object of svg or canvas settings for this seat
	 *	'SeatGrossPrice': 11.22,
	 *	'SeatTaxPercent': 20
	 * });
	 * @param client {Object} socket.io connection object
	 */
	seatUpdate(client) {
		const evt = 'seat-update';
		client.on(evt, (req) => {
			const seat = new Seat(client.id, client.userdata.UserID);
			seat.update(req).then((res) => {
				client.emit(evt, res);
				this._logMessage(client, evt, res);
			}).catch((err) => {
				client.emit(evt + '-err', err);
				this._logError(client, evt, err);
			});
		});
	}

	/**
	 * seat delete<br>
	 * delete existing seat
	 * @example
	 * socket.on('seat-delete', (res)=>{console.log(res);});
	 * socket.on('seat-delete-err', (err)=>{console.log(err);});
	 * socket.emit('seat-delete', SeatID);
	 * @param client {Object} socket.io connection object
	 */
	seatDelete(client) {
		const evt = 'seat-delete';
		client.on(evt, (id) => {
			const seat = new Seat(client.id, client.userdata.UserID);
			seat.delete(id).then((res) => {
				client.emit(evt, id);
				this._logMessage(client, evt, res);
			}).catch((err) => {
				client.emit(evt + '-err', err);
				this._logError(client, evt, err);
			});
		});
	}

	/**
	 * seat fetch<br>
	 * fetch seat
	 * @example
	 * socket.on('seat-fetch', (res)=>{console.log(res);});
	 * socket.on('seat-fetch-err', (err)=>{console.log(err);});
	 * socket.emit('seat-fetch', SeatID);
	 * @param client {Object} socket.io connection object
	 */
	seatFetch(client) {
		const evt = 'seat-fetch';
		client.on(evt, (id) => {
			const seat = new Seat(client.id, client.userdata.UserID);
			seat.fetch(id).then((res) => {
				client.emit(evt, res);
				this._logMessage(client, evt, res);
			}).catch((err) => {
				client.emit(evt + '-err', err);
				this._logError(client, evt, err);
			});
		});
	}

	// ORDER ================================================================================================
	/**
	 * order create<br>
	 * create a new order
	 * @example
	 * socket.on('order-create', (res)=>{console.log(res);});
	 * socket.on('order-create-err', (err)=>{console.log(err);});
	 * socket.emit('order-create', {
	 *	'OrderID': null,
	 *	'OrderNumber': null,
	 *	'OrderNumberText': null,
	 *	'OrderEventID': null,
	 *	'OrderType': '', // 'order' | 'credit'
	 *	'OrderState': '', // 'open' | 'payed' | 'refunded'
	 *	'OrderPayment': '', // 'cash' | 'mpay' | 'paypal' | 'transfer'
	 *	'OrderCreditID': '',
	 *	'OrderDateTimeUTC': '',
	 *	'OrderPayedDateTimeUTC': '',
	 *	'OrderFrom': '', // 'extern' | 'intern'
	 *	'OrderFromUserID': null,
	 *	'OrderUserID': null,
	 *	'OrderCompany': '',
	 *	'OrderCompanyUID': '',
	 *	'OrderGender': '', // 'm' | 'f'
	 *	'OrderTitle': '',
	 *	'OrderFirstname': '',
	 *	'OrderLastname': '',
	 *	'OrderStreet': '',
	 *	'OrderCity': '',
	 *	'OrderZIP': '',
	 *	'OrderCountryCountryISO2': '',
	 *	'OrderUserEmail': '',
	 *	'OrderUserPhone1': '',
	 *	'OrderUserPhone2': '',
	 *	'OrderUserFax': '',
	 *	'OrderUserHomepage': '',
	 *	'OrderGrossPrice': '',
	 *	'OrderNetPrice': '',
	 *	'OrderDetail': [
	 *		{
	 *			'OrderDetailScanCode': null,
	 *			'OrderDetailScanType': '', // 'single' | 'multi' | 'inout' | 'test'
	 *			'OrderDetailOrderID': null,
	 *			'OrderDetailType': '', // 'ticket' | 'seat' | 'special' | 'shippingcost' | 'handlingfee'
	 *			'OrderDetailTypeID': '',
	 *			'OrderDetailState': '', // 'sold' | 'canceled'
	 *			'OrderDetailEANRand': '',
	 *			'OrderDetailNumber': '',
	 *			'OrderDetailEANCheckDigit': '',
	 *			'OrderDetailText': '',
	 *			'OrderDetailGrossRegular': '',
	 *			'OrderDetailGrossDiscount': '',
	 *			'OrderDetailGrossPrice': '',
	 *			'OrderDetailTaxPercent': ''
	 *		}, {
	 *			'OrderDetailScanCode': null,
	 *			'OrderDetailScanType': '', // 'single' | 'multi' | 'inout' | 'test'
	 *			'OrderDetailOrderID': null,
	 *			'OrderDetailType': '', // 'ticket' | 'seat' | 'special' | 'shippingcost' | 'handlingfee'
	 *			'OrderDetailTypeID': '',
	 *			'OrderDetailState': '', // 'sold' | 'canceled'
	 *			'OrderDetailEANRand': '',
	 *			'OrderDetailNumber': '',
	 *			'OrderDetailEANCheckDigit': '',
	 *			'OrderDetailText': '',
	 *			'OrderDetailGrossRegular': '',
	 *			'OrderDetailGrossDiscount': '',
	 *			'OrderDetailGrossPrice': '',
	 *			'OrderDetailTaxPercent': ''
	 *		}
	 *	]
	 * });
	 * @param client {Object} socket.io connection object
	 */
	orderCreate(client) {
		const evt = 'order-create';
		client.on(evt, (req) => {
			const order = new Order(client.id, client.userdata.UserID);
			order.create(req).then((res) => {
				client.emit(evt, res);
				this._logMessage(client, evt, res);
			}).catch((err) => {
				client.emit(evt + '-err', err);
				this._logError(client, evt, err);
			});
		});
	}

	/**
	 * order update<br>
	 * update existing order
	 * @example
	 * socket.on('order-update', (res)=>{console.log(res);});
	 * socket.on('order-update-err', (err)=>{console.log(err);});
	 * socket.emit('order-update', {
	 *	'OrderID': null,
	 *	'OrderTableID': 'TableID | null', // null can be for location without table like cinema
	 *	'OrderNumber': '',
	 *	'OrderName': '',
	 *	'OrderSettings': {}, // json object of svg or canvas settings for this order
	 *	'OrderGrossPrice': 11.22,
	 *	'OrderTaxPercent': 20
	 * });
	 * @param client {Object} socket.io connection object
	 */
	orderUpdate(client) {
		const evt = 'order-update';
		client.on(evt, (req) => {
			const order = new Order(client.id, client.userdata.UserID);
			order.update(req).then((res) => {
				client.emit(evt, res);
				this._logMessage(client, evt, res);
			}).catch((err) => {
				client.emit(evt + '-err', err);
				this._logError(client, evt, err);
			});
		});
	}

	/**
	 * order delete<br>
	 * delete existing order
	 * @example
	 * socket.on('order-delete', (res)=>{console.log(res);});
	 * socket.on('order-delete-err', (err)=>{console.log(err);});
	 * socket.emit('order-delete', OrderID);
	 * @param client {Object} socket.io connection object
	 */
	orderDelete(client) {
		const evt = 'order-delete';
		client.on(evt, (id) => {
			const order = new Order(client.id, client.userdata.UserID);
			order.delete(id).then((res) => {
				client.emit(evt, id);
				this._logMessage(client, evt, res);
			}).catch((err) => {
				client.emit(evt + '-err', err);
				this._logError(client, evt, err);
			});
		});
	}

	/**
	 * order fetch<br>
	 * fetch order
	 * @example
	 * socket.on('order-fetch', (res)=>{console.log(res);});
	 * socket.on('order-fetch-err', (err)=>{console.log(err);});
	 * socket.emit('order-fetch', OrderID);
	 * @param client {Object} socket.io connection object
	 */
	orderFetch(client) {
		const evt = 'order-fetch';
		client.on(evt, (id) => {
			const order = new Order(client.id, client.userdata.UserID);
			order.fetch(id).then((res) => {
				client.emit(evt, res);
				this._logMessage(client, evt, res);
			}).catch((err) => {
				client.emit(evt + '-err', err);
				this._logError(client, evt, err);
			});
		});
	}

	// SCAN =================================================================================================
	/**
	 * scan create<br>
	 * create a new scan
	 * @param client {Object} socket.io connection object
	 */
	scanCreate(client) {
		const evt = 'scan-create';
		client.on(evt, (req) => {
			const scan = new Scan(client.id, client.userdata.UserID);
			scan.create(req).then((res) => {
				client.emit(evt, res);
				this._logMessage(client, evt, res);
			}).catch((err) => {
				client.emit(evt + '-err', err);
				this._logError(client, evt, err);
			});
		});

	}

	// ======================================================================================================
	/**
	 * detect browser language from connection handshake object
	 * @param handshake
	 * @returns {string}
	 * @private
	 */
	_detectLang(handshake) {
		let LangCode = 'en-gb';
		if (handshake && handshake.headers && handshake.headers["accept-language"]) {
			LangCode = handshake.headers["accept-language"];
		}
		return LangCode.toLowerCase().substr(0, 5);
	}

	/**
	 * log message
	 * @param client {Object} socket.io connection object
	 * @param evt {String} event
	 * @param message {Object} message
	 * @private
	 */
	_logMessage(client = null, evt = '', message = '') {
		message = numeral(this._clients).format('0000') + ' => ' + client.id + ' => ' + client.userdata.UserID + ' => ' + evt + ' => ' + JSON.stringify(message);
		log.msg(logPrefix, message);
	}

	/**
	 * log error
	 * @param client {Object} socket.io connection object
	 * @param evt {String} event
	 * @param message {Object} message
	 * @private
	 */
	_logError(client = null, evt = '', message = '') {
		message = numeral(this._clients).format('0000') + ' => ' + client.id + ' => ' + client.userdata.UserID + ' => ' + evt + ' => ' + JSON.stringify(message);
		log.err(logPrefix, message);
	}

};

module.exports = Socket;
