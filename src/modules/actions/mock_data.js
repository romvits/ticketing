class ActionMockData {
	constructor(settings) {

		const req = settings.req;
		const conn = settings.conn;
		const client = settings.client;

		const sql = 'SELECT * FROM t_mock_data ORDER BY ' + req.orderby;
		const values = [req.username, req.username, req.password];

		conn.query(sql, [], (err, res) => {
			if (!err) {
				client.emit('mock_data', res);
			}
			conn.release();
		});
	}
}

module.exports = ActionMockData;
