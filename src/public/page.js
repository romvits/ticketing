import $ from 'jquery';
import Page from "../classes/page";
import Socket from "../classes/socket";
import Router from "../classes/router";

$(function () {

	$.get('/config.html', (config) => {

		console.log(config);
		this.socket = new Socket(config.wss);
		this.socket.events.on('connect', () => {
			console.log("welcome to Page 1 ");
			this.router = new Router();
			console.log(this.router);
			this.router.events.on('link', () => {

			});
			this.page = new Page();
		});
		this.socket.connect();
	});
});