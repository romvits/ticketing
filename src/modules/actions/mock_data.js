class ActionMockData {
	constructor(settings) {

		const io = settings.io;
		const client = settings.client;
		const db = settings.db;
		const req = settings.req;

		const sql = 'SELECT * FROM t_mock_data ORDER BY ' + req.orderby;
		const values = [req.username, req.username, req.password];

		db.query(sql, [], (err, res) => {
			if (!err) {
				client.emit('mock_data', res);
			}
			db.release();
		});
	}
}

module.exports = ActionMockData;
