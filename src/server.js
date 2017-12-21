import Greeter from "./classes/greeter"
import Maker from "./classes/maker"
import _ from "lodash"

var greeter = new Greeter("World");
console.log(greeter.greet());
console.log(greeter.makethedoit());

var maker = new Maker("Roman you did it :)");
console.log(maker.greet());

_.each([1, 2, 3], (value) => {
	console.log(value);
});