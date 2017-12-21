import $ from 'jquery';
import _ from 'lodash';
import Maker from "../classes/maker"

$(function () {
	this.maker = new Maker("deploy");
	console.log(this.maker.greet());

	_.each(['a', 'b', 'c'], (value) => {
		console.log(value);
		console.log(this.maker);
		console.log("da");
		console.log("dort");
		console.log("geil");
		console.log("funkt!");
		console.log("noch mehr geilo?");
	});

});