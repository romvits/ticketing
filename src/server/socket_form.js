import Helpers from './helpers';
import Form from './modules/form/form'

/**
 * form events
 * @public
 * @class
 * @memberof Socket
 */
class SocketForm extends Helpers {

	/**
	 * constructor for form socket events<br>
	 * @param client {Object} socket.io connection object
	 */
	constructor(client) {
		super();
		this._client = client;
		//this.onCreate();
		//this.onUpdate();
		//this.onDelete();
		this.onInit();
		//this.onFetch();
	}

	/**
	 * form init<br>
	 * request a form configuration
	 * @example
	 * socket.on('form-init', (res)=>{console.log(res);}); // response (configuration of form and field)
	 * socket.on('form-init-err', (err)=>{console.log(err);});
	 * socket.emit('form-init', FormID); // request a form configuration
	 * @param client {Object} socket.io connection object
	 */
	onInit() {
		const evt = 'form-init';
		this._client.on(evt, (req) => {
			const form = new Form(this._client.id);
			form.init(req.form_id).then((res) => {
				this._client.emit(evt, res);
				this.logSocketMessage(this._client.id, evt);
			}).catch((err) => {
				this._client.emit(evt + '-err', err);
				this.logSocketError(this._client.id, evt, err);
			});
		});
	}

}

module.exports = SocketForm;
