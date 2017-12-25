module.exports = function (grunt, options) {

	let buildFolder = options.buildFolder;
	let secured = options.secured;

	const onAfterDeploy = (context, done) => {
		context.logger.subhead('execute: npm install --production on remote sever');
		const spinner = context.logger.startSpinner('executing: npm install --production on remote sever');
		const command = 'cd application/www && npm install --production';
		const showLog = true;
		context.remote.exec(
			 command,
			 () => {
				 spinner.stop();
				 done();
			 },
			 showLog
		);
	};

	return {

		// Global options
		// ==============
		options: {
			localPath: buildFolder,
		},

		// Environments
		// ============

		// Test Version
		ticketing_appcomplete_at: {
			options: {
				host: secured.host,
				port: secured.port,
				username: secured.username,
				password: secured.password,
				deployPath: secured.deployPath,
				exclude: ['node_modules/**'],
				onAfterDeploy: onAfterDeploy
			}

		}
	}
};
