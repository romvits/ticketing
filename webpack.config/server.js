const webpack = require('webpack');
const banner = require('./plugins/banner');
const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const nodeExternals = require('webpack-node-externals');
const VersionFile = require('webpack-version-file');

const loaderBabel = require('./loaders/babel');

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
	]),
	new VersionFile({
		output: './dist/src/version.txt',
		package: './package.json'
	})
	//new webpack.BannerPlugin(banner)
]

module.exports = env => {

	if (env == "build") {
		const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
		const uglifyJsPlugin = require('./plugins/server.uglifyJsPlugin');
		plugins.push(new UglifyJsPlugin(uglifyJsPlugin));

		const banner = require('./plugins/banner');
		plugins.push(new webpack.BannerPlugin(banner));
	} else {
		console.log("watch");
	}

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
		module: {
			loaders: [
				loaderBabel
			]
		},
		target: "node",
		externals: [nodeExternals()]
	}
};
