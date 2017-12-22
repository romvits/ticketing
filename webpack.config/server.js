const path = require('path');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const nodeExternals = require('webpack-node-externals');

const loaderBabel = require('./loaders/babel');

const uglifyJsPlugin = require('./plugins/server.uglifyJsPlugin');

module.exports = {
	entry: './src/server.js',
	output: {
		path: path.resolve(__dirname, './../dist/src/'),
		filename: 'server.js'
	},
	module: {
		loaders: [
			loaderBabel
		]
	},
	plugins: [
		new CleanWebpackPlugin(['dist/src'], {
			root: __dirname + '/../',
			verbose: true,
			dry: false,
			allowExternal: true,
			exclude: ['public', 'config.ini']
		}),
		//new UglifyJsPlugin(uglifyJsPlugin)
	],
	node: {
		fs: "empty",
		net: "empty",
		__dirname: false,
		__filename: false
	},
	target: "node",
	externals: [nodeExternals()]
};
