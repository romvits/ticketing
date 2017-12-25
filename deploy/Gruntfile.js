module.exports = function (grunt) {

	const env = grunt.option.flags()[0].replace("--", "");
	const copyFlag = (grunt.option('copy')) ? true : false;

	const _ = require('lodash');

	const buildFolder = "../dist/src/";

	const forZero = function (num, len) {
		var numString = num.toString();
		while (numString.length < len) {
			numString = "0" + numString;
		}
		return numString;
	}
	const date = new Date();
	const dateString = date.getFullYear() + (forZero(date.getMonth() + 1, 2)) + (forZero(date.getDate(), 2)) + "_" + forZero(date.getHours(), 2) + forZero(date.getMinutes(), 2) + forZero(date.getSeconds(), 2);

	let secured = {};
	let configGrunt = {};

	grunt.file.defaultEncoding = 'utf8';

	const options = {
		"buildFolder": buildFolder,
		"date": date,
		"dateString": dateString,
		"nl": "\n",
	};

	const tasks = []; //, 'ssh-deploy-release'

	let configCopy = {};
	let configDeploy = {};

	const configFile = 'configurations/' + env + '.json';
	const config = grunt.file.readJSON(configFile);
	if (config) {
		if (copyFlag) {
			tasks.push('copy');
			grunt.loadNpmTasks('grunt-contrib-copy');
			grunt.initConfig({
				copy: {
					config: {
						"expand": true,
						"cwd": __dirname + "/configurations/" + env + "/",
						"src": ["config.ini"],
						"dest": __dirname + "/../dist/src/"
					}
				}
			});
			grunt.registerTask('default', ['copy']);
		} else {

			grunt.loadNpmTasks('grunt-ssh-deploy-release');
			options.secured = config.secured;
			var configs = require('load-grunt-configs')(grunt, options);
			configs.pkg = grunt.file.readJSON('package.json'), grunt.initConfig(configs);
			grunt.registerTask('default', tasks);

		}


	} else {
		grunt.log.write('no deploy options found ' + __dirname + '/' + configFile + options.nl);
	}
}
