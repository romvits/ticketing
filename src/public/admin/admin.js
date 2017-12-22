import $ from 'jquery';
import Admin from "../../classes/admin"


$(function () {
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