module.exports = {
	sourceMap: true,
	ie8: true,
	ecma: 5,
	parse: {},
	mangle: {
		properties: {
			// mangle property options
		}
	},
	output: {
		comments: false,
		beautify: false,
	},
	exclude: ['./src/server/*'],
	compress: {},
	warnings: false,
	banner: ''
}
