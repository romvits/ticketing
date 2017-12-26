const webpack = require('webpack');
const path = require('path');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const loaderBabel = require('./loaders/babel');

let plugins = [
	new CleanWebpackPlugin(['dist/src/public/admin_mobile'], {
		root: __dirname + '/../',
		verbose: true,
		dry: false,
		allowExternal: true,
		exclude: ['libs']
	}),
	new CopyWebpackPlugin([{
		from: 'src/public/admin_mobile/app.config.js',
		to: 'app.config.js',
		toType: 'file'
	}]),
	new CopyWebpackPlugin([{
		from: 'src/public/admin_mobile/img',
		to: 'img'
	}]),
	new HtmlWebpackPlugin({
		template: './src/public/admin_mobile/index.ejs',
		inject: 'body'
	})
];

module.exports = env => {

	if (env == "build") {
		const WebpackShellPlugin = require('webpack-shell-plugin');
		plugins.push(new WebpackShellPlugin({
			//onBuildStart: [''],
			onBuildEnd: ['chmod 744 webpack.config/shell/admin_mobile_end.sh', 'webpack.config/shell/admin_mobile_end.sh']
		}));

		const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
		const uglifyJsPlugin = require('./plugins/admin_mobile.uglifyJsPlugin');
		plugins.push(new UglifyJsPlugin(uglifyJsPlugin));

		const banner = require('./plugins/banner');
		plugins.push(new webpack.BannerPlugin(banner));
	}

	return {
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
		plugins: plugins
	}

};
