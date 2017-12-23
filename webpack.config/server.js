const path = require('path');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const nodeExternals = require('webpack-node-externals');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const loaderBabel = require('./loaders/babel');

const uglifyJsPlugin = require('./plugins/server.uglifyJsPlugin');

const plugins = [
	new CleanWebpackPlugin(['dist/src'], {
		root: __dirname + '/../',
		verbose: true,
		dry: false,
		allowExternal: true,
		exclude: ['public', 'config.ini']
	}),
	//new UglifyJsPlugin(uglifyJsPlugin),
	new CopyWebpackPlugin([{
		from: 'src/package.json',
		to: 'package.json',
		toType: 'file'
	}]),
]

module.exports = {
	entry: __dirname + '/../src/server.js',
	output: {
		path: path.resolve(__dirname, './../dist/src/'),
		filename: 'server.js'
	},
	module: {
		loaders: [
			loaderBabel
		]
	},
	plugins: plugins,
	node: {
		fs: "empty",
		net: "empty",
		__dirname: false,
		__filename: false
	},
	target: "node",
	externals: [nodeExternals()]
};
