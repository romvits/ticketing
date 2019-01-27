
class ActionLogin {
	constructor(settings) {

		const req = settings.req;
		const conn = settings.conn;
		const client = settings.client;

		const sql = 'SELECT firstname, lastname, email, nickname FROM t_user WHERE (nickname = ? || email = ?) && password = ?';
		const values = [req.username, req.username, req.password];

		conn.query(sql, values, (err, res) => {
			if (!err) {
				if (res.length) {
					client.emit('login', res);
				} else {
					client.emit('login-err', {});
				}
			}
			conn.release();
		});
	}
}

module.exports = ActionLogin;
