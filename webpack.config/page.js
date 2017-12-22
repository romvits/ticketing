const path = require('path');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const loaderBabel = require('./loaders/babel');

const uglifyJsPlugin = require('./plugins/server.uglifyJsPlugin');

module.exports = {
	entry: __dirname + '/../src/public/page.js',
	output: {
		path: path.resolve(__dirname, './../dist/src/public/'),
		filename: 'page.js'
	},
	module: {
		loaders: [
			loaderBabel
		]
	},
	plugins: [
		new CleanWebpackPlugin(['dist/src/public'], {
			root: __dirname + '/../',
			verbose: true,
			dry: false,
			allowExternal: true,
			exclude: ['admin', 'admin_mobile']
		}),
		//new UglifyJsPlugin(uglifyJsPlugin),
		new HtmlWebpackPlugin({
			template: './src/public/index.ejs',
			inject: 'body'
		})
	]
};
