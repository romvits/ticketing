
class Order {

	create(values) {
		var result = {};
		return new Promise((resolve, reject) => {
			console.log(values);
			resolve(values);
		});
	}

	fetch(OrderID = null) {

	}

	storno(OrderID, values) {

	}

}

module.exports = Order;
