module.exports = {
	test: /\.(js|jsx)$/,
	loader: 'babel-loader',
	exclude: /(node_modules|bower_components)/,
	query: { presets: ["env"] }
};