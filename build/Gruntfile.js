module.exports = function (grunt) {

	var _ = require('lodash');

	var buildFolder = "docker/node/app/";

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

	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-exec');

	var options = {
		"buildFolder": buildFolder,
		"date": date,
		"dateString": dateString,
		"nl": "\n",
	};

	var tasks = [];

	if (grunt.option('build')) {

		// run build stuff
		tasks.push('clean');
		tasks.push('copy');
		tasks.push('uglify');

	}

	var configs = require('load-grunt-configs')(grunt, options);
	configs.pkg = grunt.file.readJSON('package.json'), grunt.initConfig(configs);

	grunt.log.write('run tasks' + options.nl);
	grunt.log.write(tasks);

	grunt.registerTask('default', tasks);

}
