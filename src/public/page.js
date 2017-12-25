import $ from 'jquery';
import Page from "../classes/page";
import Socket from "../classes/socket";

$(function () {

	$.get('/config.html', (config) => {

		console.log(config);
		this.socket = new Socket(config.wss);
		this.socket.events.on('connect', () => {
			console.log("welcome to Page");

			this.page = new Page();
		});
		this.socket.connect();
	});
});