import Helpers from './helpers';
import User from './modules/user/user'

/**
 * user events
 * @public
 * @class
 * @memberof Socket
 */
class SocketUser extends Helpers {

	/**
	 * constructor for list socket events<br>
	 * @param client {Object} socket.io connection object
	 */
	constructor(client) {
		super();
		this._client = client;
		//this.onCreate();
		this.onUpdate();
		this.onDelete();
		this.onLogin();
		this.onLogout();
		this.onLogoutByToken();
	}

	/**
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
	userCreate() {
		const evt = 'user-create';
		this._client.on(evt, (req) => {
			const user = new User(this._client.id, this._client.userdata.UserID);
			user.create(req).then((res) => {
				this._client.emit(evt, res);
				this.logSocketMessage(this._client, evt, res);
			}).catch((err) => {
				this._client.emit(evt + '-err', err);
				this.logSocketError(this._client, evt, err);
			});
		});
	}

	/**
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
	onUpdate() {
		const evt = 'user-update';
		this._client.on(evt, (req) => {
			const user = new User(this._client.id, this._client.userdata.UserID);
			user.update(req).then((res) => {
				this._client.emit(evt, res);
				this.logSocketMessage(this._client, evt, res);
			}).catch((err) => {
				this._client.emit(evt + '-err', err);
				this.logSocketError(this._client, evt, err);
			});
		});
	}

	/**
	 * delete existing user
	 * @example
	 * socket.on('user-delete', (res)=>{console.log(res);});
	 * socket.on('user-delete-err', (err)=>{console.log(err);});
	 * socket.emit('user-delete', 'ID of existing user');
	 * @param client {Object} socket.io connection object
	 */
	onDelete() {
		const evt = 'user-delete';
		this._client.on(evt, (id) => {
			const user = new User(this._client.id, this._client.userdata.UserID);
			user.delete(id).then((res) => {
				this._client.emit(evt, res);
				this.logSocketMessage(this._client, evt, res);
			}).catch((err) => {
				this._client.emit(evt + '-err', err);
				this.logSocketError(this._client, evt, err);
			});
		});
	}

	/**
	 * login user
	 * @example
	 * socket.on('user-login', (res)=>{console.log(res);}); // login success
	 * socket.on('user-login-err', (err)=>{console.log(err);}); // login error
	 * socket.on('user-login-token', (res)=>{console.log(res);}); // login success but already logged in on other device. use user-logout-token to logout from other device
	 * socket.emit('user-login', {'UserEmail':email,'UserPassword':md5(sha256(password))}); // send login request
	 * @param client {Object} socket.io connection object
	 */
	onLogin() {
		const evt = 'user-login';
		this._client.on(evt, (req) => {
			const user = new User(this._client.id, this._client.userdata.UserID);
			user.login(req).then((res) => {
				this._client.lang = res.UserLangCode;
				if (!res.LogoutToken) {
					this._client.userdata.UserID = res.UserID;
					this._client.userdata.LangCode = res.UserLangCode;
					this._client.emit(evt, res);
					this.logSocketMessage(client, evt, req);
				} else {
					this._client.emit('user-login-token', res.LogoutToken);
					this.logSocketMessage(client, 'user-logout-token', req);
				}
			}).catch((err) => {
				this._client.emit(evt + '-err', err);
				this.logSocketError(client, evt + '-err', req);
			});
		});
	}

	/**
	 * logout user
	 * @example
	 * socket.on('user-logout', (res)=>{console.log(res);}); // logout success
	 * socket.emit('user-logout', null); // send logout request
	 * @param client {Object} socket.io connection object
	 */
	onLogout() {
		const evt = 'user-logout';
		this._client.on(evt, () => {
			const user = new User(this._client.id, this._client.userdata.UserID);
			user.logout().then((res) => {
				this._client.emit(evt, true);
				this.logSocketMessage(client, evt);
			}).catch((err) => {
				this._client.emit(evt, err);
				this.logSocketError(client, evt);
			});
		});
	}

	/**
	 * logout user by token<br>
	 * @example
	 * socket.on('user-logout-token', (res)=>{console.log(res);}); // user was logged out by token (effects all connected devices which where logged in with that user data)
	 * socket.emit('user-logout-token', token); // send token logout request. the value 'token' 128 characters was send by server on login request when a user tried to log in but was logged in on other device (mobile phone, browser tab, ...)
	 * @param client {Object} socket.io connection object
	 */
	onLogoutByToken() {
		const evt = 'user-logout-token';
		this._client.on(evt, (LogoutToken) => {
			const user = new User(this._client.id, this._client.userdata.UserID);
			user.logoutToken(LogoutToken).then((res) => {
				_.each(res, (row) => {
					this.io.to(`${row.ClientConnID}`).emit('user-logout', false);
					this.io.to(`${row.ClientConnID}`).emit('user-logout', true);
				});
				this._client.emit('user-logout', false);
			}).catch((err) => {
				this.logSocketError(this._client, evt, err);
			});
		});
	}


}

module.exports = SocketUser;
