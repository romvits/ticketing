import $ from 'jquery';
import AdminMobile from "../../classes/admin_mobile";
import Socket from "../../classes/socket";

$(function () {
	$.get('/config.html', (config) => {
		this.socket = new Socket(config.wss);
		this.socket.events.on('connect', () => {
			console.log("welcome to admin_mobile");
			this.page = new AdminMobile();
		});
		this.socket.connect();
	});
});
