module.exports = function (grunt, options) {
	var buildFolder = options.buildFolder;
	if (grunt.option('build')) {
		return {
			"options": {
				force: true
			},
			"build": [buildFolder]
		}
	}
};