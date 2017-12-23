module.exports = function (grunt) {

	var _ = require('lodash');

	var buildFolder = "../dist/src/";

	var forZero = function (num, len) {
		var numString = num.toString();
		while (numString.length < len) {
			numString = "0" + numString;
		}
		return numString;
	}
	var date = new Date();
	var dateString = date.getFullYear() + (forZero(date.getMonth() + 1, 2)) + (forZero(date.getDate(), 2)) + "_" + forZero(date.getHours(), 2) + forZero(date.getMinutes(), 2) + forZero(date.getSeconds(), 2);

	var secured = {};

	grunt.file.defaultEncoding = 'utf8';

	//grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-ssh-deploy-release');

	var options = {
		"buildFolder": buildFolder,
		"date": date,
		"dateString": dateString,
		"nl": "\n",
	};

	var tasks = [];

	// run deploy stuff
	var secured, deploy = false;
	if (grunt.option('ticketing_appcomplete_at')) {
		secured = grunt.file.readJSON('configurations/ticketing_appcomplete_at.json');
		deploy = true;
	} else {
		grunt.log.write('unknown option!' + options.nl);
	}

	if (deploy) {
		//if (grunt.option('copy')) {
			//tasks.push('copy');
		//}

		grunt.log.write('DEPLOY started!' + options.nl);
		options.secured = secured;

		var configs = require('load-grunt-configs')(grunt, options);
		configs.pkg = grunt.file.readJSON('package.json'), grunt.initConfig(configs);

		grunt.log.write('run tasks' + options.nl);
		grunt.log.write(tasks);

		grunt.registerTask('default', tasks);

	} else {

	}


}
