import Backbone from 'backbone';
import Events from 'tiny-emitter';
import _ from 'lodash';

export default class Router {

	constructor(config) {
		this.config = config;
		this.events = new Events();
		const AppRouter = Backbone.Router.extend({
			routes: {
				"*actions": "defaultRoute"
			}
		});

		this.router = new AppRouter;

		this.router.on('route:defaultRoute', function(actions) {
			console.log(actions);
		});

		Backbone.history.start();
	}

	connect() {
		this.events.emit('connect');
	}
}