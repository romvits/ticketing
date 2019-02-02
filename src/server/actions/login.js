class ActionLogin {
	constructor(settings) {

		const io = settings.io;
		const client = settings.client;
		const db = settings.db;
		const req = settings.req;

		const sql = 'SELECT firstname, lastname, email, nickname FROM t_user WHERE (nickname = ? || email = ?) && password = ?';
		const values = [req.username, req.username, req.password];

		db.query(sql, values, (err, res) => {
			if (!err) {
				if (res.length) {
					client.emit('login', res);
				} else {
					client.emit('err', {'nr': 1000, 'message': 'Wrong username or password'});
				}
			}
			db.release();
		});
	}
}

module.exports = ActionLogin;
