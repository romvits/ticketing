const webpack = require('webpack');
const path = require('path');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const loaderBabel = require('./loaders/babel');

let plugins = [
	new CleanWebpackPlugin(['dist/src/public/admin'], {
		root: __dirname + '/../',
		verbose: true,
		dry: false,
		allowExternal: true,
		exclude: ['libs']
	}),
	new HtmlWebpackPlugin({
		template: './src/public/admin/index.ejs',
		inject: 'body'
	})
];

module.exports = env => {

	if (env == "build") {
		const WebpackShellPlugin = require('webpack-shell-plugin');
		plugins.push(new WebpackShellPlugin({
			//onBuildStart: [''],
			onBuildEnd: ['php src/public/admin/libs/dhtmlxSuite_v51/libCompiler/lib_compiler.php']
		}));

		const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
		const uglifyJsPlugin = require('./plugins/admin.uglifyJsPlugin');
		plugins.push(new UglifyJsPlugin(uglifyJsPlugin));

		const banner = require('./plugins/banner');
		plugins.push(new webpack.BannerPlugin(banner));
	}

	return {
		entry: __dirname + '/../src/public/admin/admin.js',
		output: {
			path: path.resolve(__dirname, './../dist/src/public/admin'),
			filename: 'admin.js'
		},
		module: {
			loaders: [
				loaderBabel
			]
		},
		plugins: plugins
	}

};
