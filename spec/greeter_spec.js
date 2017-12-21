import Greeter from "../src/server/bundle"
import _ from "lodash";
import chai from "chai"

describe('Greeter', function () {
	let greeter = new Greeter("World");
	let expect = chai.expect;

	it('greets with a string', function () {
		expect(_.isString(greeter.greet())).to.equal(true);
	});

	it('greets eveyone appropriately', function () {
		expect(greeter.greet()).to.equal('Hello World!');
	});

	it('do it all the time', function () {
		expect(greeter.makethedoit()).to.equal('I have it done :)');
	});

});