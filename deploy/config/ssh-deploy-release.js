module.exports = function (grunt, options) {

	var buildFolder = options.buildFolder;
	var secured = options.secured;

	const onAfterDeploy = (context, done) => {
		const commandDeploy = "npm install --production --prefix " + context.release.path;
		const commandStop = "npm run forever-stopall";
		const commandStart = "npm run forever-start --prefix " + context.release.path;
		const commandRestart = "npm run forever-restartall --prefix " + context.release.path;
		const commandChmod = "chmod -R 700 " + context.release.path + "/*";

		context.logger.subhead(commandDeploy);
		const spinnerDeploy = context.logger.startSpinner("installing npm packages");
		context.remote.exec(commandDeploy, () => {
			spinnerDeploy.stop('Done');
			context.logger.ok("npm packages installed!");

			context.logger.subhead(commandChmod);
			const spinnerChmod = context.logger.startSpinner("change file permissions");
			context.remote.exec(commandChmod, () => {
				spinnerChmod.stop('Done');
				context.logger.ok("file permissions changed!");
				context.logger.subhead(commandRestart);
				const spinnerRestart = context.logger.startSpinner("restarting server");
				context.remote.exec(commandRestart, () => {
					spinnerRestart.stop('Done');
					context.logger.ok("server restarted!");
					done();
				}, true);
			}, true);
			/*
			context.logger.subhead(commandStop);
			const spinnerStop = context.logger.startSpinner("stopping server");
			context.remote.exec(commandStop, () => {
				spinnerStop.stop();
				context.logger.ok("server stoped!");
				context.logger.subhead(commandStart);
				const spinnerStart = context.logger.startSpinner("starting server");
				context.remote.exec(commandStart, () => {
					spinnerStart.stop();
					context.logger.ok("server started!");
					done();
				}, true);
			}, true);
			*/
		}, true);

	}

	const onAfterDeployExecute = (context) => {
	}

	return {

		// Global options
		// ==============
		options: {
			localPath: buildFolder,
		},

		// Environments
		// ============
		production: {
			options: {
				host: secured.host,
				port: secured.port,
				username: secured.username,
				password: secured.password,
				deployPath: secured.deployPath,
				onAfterDeploy: onAfterDeploy,
				onAfterDeployExecute: onAfterDeployExecute
			}
		}
	}
}
