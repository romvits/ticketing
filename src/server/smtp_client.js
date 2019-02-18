import SMTPConnection from 'nodemailer/lib/smtp-connection';
import MailComposer from 'nodemailer/lib/mail-composer';

class SMTPClient {
	constructor(config) {
		this._config = config;
		this._connection = new SMTPConnection(this._config.options);
	}

	sendPromise() {
		return new Promise((resolve, reject) => {
			this._connection.connect((res) => {
				console.log('connect');
				console.log(res);

				this._connection.login(this._config.login.credentials, (res) => {
					console.log('login');
					console.log(res);

					let mail = new MailComposer();

					this._connection.send({
						from: this._config.from,
						to: 'roman.marlovits@gmail.com',
						subject: 'A test subject.'
					}, 'A test body.', (err, info) => {
						this._connection.quit();
						if (err) {
							reject(err);
							console.log('Message not sent.', err);
						} else {
							resolve('message-sent');
							console.log('Message sent.', info);
						}
					});


				});
			}, (err) => {
				reject(err);
				console.log('err');
				console.log(err);
			});
		});
	}
}

module.exports = SMTPClient;
