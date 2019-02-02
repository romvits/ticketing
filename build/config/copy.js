module.exports = function(grunt, options) {
	var buildFolder = options.buildFolder;
	if (grunt.option('build')) {
		return {
			"folders": {
				"expand": true,
				"cwd": "../src/",
				"src": ['server/**/**', 'www/**/**'],
				"dest": buildFolder + "/"
			},
			"files": {
				"expand": true,
				"cwd": "../src/",
				"src": ['server.js', 'package.json'],
				"dest": buildFolder + "/"
			}
		}
	}
}