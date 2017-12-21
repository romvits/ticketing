export default class Maker {

	constructor(name) {
		this.name = name;
	}

	greet() {
		return 'Make: ' + this.name + '!';
	}
}