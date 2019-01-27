
class ActionLogin {
	constructor(settings) {

		const req = settings.req;
		const conn = settings.conn;
		const client = settings.client;

		const sql = 'SELECT * FROM t_user WHERE (nickname = ? || email = ?) && password = ?';
		const values = [req.username, req.username, req.password];

		conn.query(sql, values, (err, res) => {
			if (!err) {
				client.emit('login', res);
			}
			conn.release();
		});
	}
}

module.exports = ActionLogin;
