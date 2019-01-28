class ActionCreateAccount {
	constructor(settings) {

		const io = settings.io;
		const client = settings.client;
		const db = settings.db;
		const req = settings.req;

		console.log('CREATE ACCOUNT');

		/*
		const sql = 'SELECT firstname, lastname, email, nickname FROM t_user WHERE (nickname = ? || email = ?) && password = ?';
		const values = [req.username, req.username, req.password];

		db.query(sql, values, (err, res) => {
			if (!err) {
				if (res.length) {
					client.emit('login', res);
				} else {
					client.emit('err', {'nr': 1000, 'message': 'Wrong user name or password'});
				}
			}
			db.release();
		});
		*/
	}

	create() {

	}

	update() {

	}

	login(settings) {

		let username = settings.username;
		let password_md5 = settings.password_md5;

		// find record by username
		// than add salt to settings.md5 password
		// than check password

	}

	setPassword(settings) {

		let syscode = settings.syscode;
		let password_cleartext = settings.password_cleartext;
		let password_md5 = settings.password_md5;


	}
}

module.exports = ActionCreateAccount;