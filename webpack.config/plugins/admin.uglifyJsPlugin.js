module.exports = {
	sourceMap: true,
	ie8: false,
	ecma: 6,
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
