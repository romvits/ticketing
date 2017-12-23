module.exports = function (grunt, options) {

	var buildFolder = options.buildFolder;
	var target = grunt.option('target');

	if (target) { // ballkartenonline
		return {
			"ticketing_appcomplete_at": {
				"expand": true,
				"cwd": target,
				"src": [".*", ".config/*"],
				"dest": buildFolder + "/"
			}
		}
	}

}
