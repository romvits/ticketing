import $ from 'jquery';
import Admin from "../../classes/admin";
import Socket from "../../classes/socket";

$(function () {

	$.get('/config.html', (config) => {

		console.log(config);
		this.socket = new Socket(config.wss);
		this.socket.events.on('connect', () => {
			console.log("welcome to admin");

			this.page = new Admin();

			this.layoutObject = new dhtmlXLayoutObject({
				parent: document.body,
				pattern: "2U",
				skin: "material",
				cells: [
					{id: "a", text: "Navigation", width: 250},
					{id: "b", text: "Main"},
				]
			});

			this.layoutObject.setSkin("material");

			this.nav = this.layoutObject.cells('a');
			this.main = this.layoutObject.cells('b');

			this.main.hideArrow();
			this.main.hideHeader();

			this.toolbarObject = this.layoutObject.attachToolbar();
			this.statusbarObject = this.layoutObject.attachStatusBar();
		});
		this.socket.connect();
	});
});