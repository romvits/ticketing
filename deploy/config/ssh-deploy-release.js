module.exports = function (grunt, options) {

	var buildFolder = options.buildFolder;
	var secured = options.secured;

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

				onAfterDeploy: (context, done) => {
					context.logger.subhead('Do something');
					const spinner = context.logger.startSpinner('Doing something');
					const command = 'cd application/www && npm install';
					const showLog = true;

					context.remote.exec(
						 command,
						 () => {
							 spinner.stop();
							 done();
						 },
						 showLog
					);
				}
			}

		}
	}
}
