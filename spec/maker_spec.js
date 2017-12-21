import Maker from "../src/server/bundle"
import _ from "lodash";
import chai from "chai"

describe('Maker', function () {
	var maker = new Maker("Roman you did it :)");
	var expect = chai.expect;

	it('made it', function () {
		expect(_.isString(maker.greet())).to.equal(true);
	});

	it('made it again', function () {
		expect(maker.greet()).to.equal('Make Roman you did it :)!');
	});

});