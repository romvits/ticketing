const webpack = require('webpack');
const banner = require('./plugins/banner');
const path = require('path');
const WebpackShellPlugin = require('webpack-shell-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const nodeExternals = require('webpack-node-externals');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const uglifyJsPlugin = require('./plugins/server.uglifyJsPlugin');
const VersionFile = require('webpack-version-file');

const plugins = [
	new CleanWebpackPlugin(['dist/src'], {
		root: __dirname + '/../',
		verbose: true,
		dry: false,
		allowExternal: true,
		exclude: ['public', 'config.ini', 'node_modules']
	}),
	new CopyWebpackPlugin([
		{from: 'src/config.ini', to: 'config.ini', toType: 'file'},
		{from: 'package.json', to: 'package.json', toType: 'file'}
		//{from: 'src/classes/server', to: 'classes/server', toType: 'dir'}
	]),
	//new UglifyJsPlugin(uglifyJsPlugin),
	new WebpackShellPlugin({
		//onBuildStart: ['chmod 744 webpack.config/shell/server_start.sh', 'webpack.config/shell/server_start.sh']
		//onBuildEnd: [''],
	}),
	new VersionFile({
		output: './dist/src/version.txt',
		package: './package.json'
	}),
	new webpack.BannerPlugin(banner)
]

module.exports = env => {
	return {
		entry: __dirname + '/../src/server.js',
		output: {
			path: path.resolve(__dirname, './../dist/src/'),
			filename: 'server.js'
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
	}
};
