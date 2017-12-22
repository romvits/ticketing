const path = require('path');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const loaderBabel = require('./loaders/babel');

const uglifyJsPlugin = require('./plugins/server.uglifyJsPlugin');

module.exports = {
	entry: __dirname + '/../src/public/admin_mobile/admin_mobile.js',
	output: {
		path: path.resolve(__dirname, './../dist/src/public/admin_mobile'),
		filename: 'admin_mobile.js'
	},
	module: {
		loaders: [
			loaderBabel
		]
	},
	plugins: [
		new CleanWebpackPlugin(['dist/src/public/admin_mobile'], {
			root: __dirname + '/../',
			verbose: true,
			dry: false,
			allowExternal: true
		}),
		//new UglifyJsPlugin(uglifyJsPlugin),
		new HtmlWebpackPlugin({
			template: './src/public/admin_mobile/index.ejs',
			inject: 'body'
		}) // {template: './src/index.ejs'}
	]
};
