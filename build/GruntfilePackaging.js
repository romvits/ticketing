module.exports = function(grunt) {

	grunt.loadNpmTasks('grunt-package-modules');

	grunt.initConfig({
		packageModules: {
			dist: {
				src: '../src/package.json',
				dest: './modules_packaging'
			}
		},
	});

	var tasks = ['packageModules'];

	grunt.registerTask('default', tasks);


}