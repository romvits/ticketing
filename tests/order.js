class Order {
	constructor(props) {

	}

	create() {
		let order = {
			EventID: '0178249e81238d7c20160912182049',
			Type: 'order',
			State: 'open',
			Payment: 'cash',
			From: 'intern',
			FromUserID: '111111111111111111111111111111',
			UserID: '111111111111111111111111111111',
			Company: '',
			CompanyUID: '',
			Gender: 'm',
			Title: '',
			Firstname: 'Roman',
			Lastname: 'Marlovits',
			Street: 'Gentzgasse 160/1/6',
			City: 'Wien',
			ZIP: '1180',
			CountryCountryISO2: 'AT',
			UserEmail: 'roman.marlovits@gmail.com',
			UserPhone: '+436648349919',
			Details: [
				{
					ID: '0f66445b815002e320160924132559', 	// type id
					Type: 'ticket', 						// type
					GrossDiscount: 0.00 					// discount
				}, {
					ID: '0f66445b815002e320160924132559', 	// type id
					Type: 'ticket', 						// type
					GrossDiscount: 5.00 					// discount
				}, {
					ID: '0f66445b815002e320160924132559', 	// type id
					Type: 'ticket', 						// type
					GrossDiscount: 0.00 					// discount
				}, {
					ID: '0f66445b815002e320160924132559', 	// type id
					Type: 'ticket', 						// type
					GrossDiscount: 0.00 					// discount
				}, {
					ID: '1ff426d4e3718d3820160913133226',	// type id
					Type: 'seat', 							// type
					GrossDiscount: 0.00 					// discount
				}, {
					ID: '37b7d8065e5f5d2c20160913133226',	// type id
					Type: 'seat', 							// type
					GrossDiscount: 0.00 					// discount
				}, {
					ID: 'ab0ca694294b9d7020160925154908', 	// type id
					Type: 'special', 						// type
					GrossDiscount: 2.00 					// discount
				}, {
					ID: 'ab0ca694294b9d7020160925154908', 	// type id
					Type: 'special', 						// type
					GrossDiscount: 0.00 						// discount
				}, {
					Type: 'shippingcost', 					// type
					GrossDiscount: 2.50 					// discount
				}, {
					Type: 'handlingfee', 					// type
					GrossDiscount: 1.50 					// discount
				}

			]
		}

		this.socket.emit('order-create', order);
	}
}

module.exports = Order;
