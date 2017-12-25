const path = require('path');
const WebpackShellPlugin = require('webpack-shell-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const nodeExternals = require('webpack-node-externals');
const loaderBabel = require('./loaders/babel');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const uglifyJsPlugin = require('./plugins/server.uglifyJsPlugin');

const plugins = [
	new CleanWebpackPlugin(['dist/src'], {
		root: __dirname + '/../',
		verbose: true,
		dry: false,
		allowExternal: true,
		exclude: ['public', 'config.ini', 'node_modules']
	}),
	new CopyWebpackPlugin([
		{from: 'src/config.ini', to: 'config.ini', toType: 'file'}
		//{from: 'package.json', to: 'package.json', toType: 'file'},
		//{from: 'src/classes/server', to: 'classes/server', toType: 'dir'}
	]),
	//new UglifyJsPlugin(uglifyJsPlugin),
	new WebpackShellPlugin({
		//onBuildStart: ['chmod 744 webpack.config/shell/server_start.sh', 'webpack.config/shell/server_start.sh']
		//onBuildEnd: [''],
	})
]

module.exports = {
	entry: __dirname + '/../src/server.js',
	output: {
		path: path.resolve(__dirname, './../dist/src/'),
		filename: 'server.js'
	},
	//module: {
	//	loaders: [
	//		loaderBabel
	//	]
	//},
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
