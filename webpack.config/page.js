const path = require('path');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const loaderBabel = require('./loaders/babel');

let plugins = [
	new CleanWebpackPlugin(['dist/src/public'], {
		root: __dirname + '/../',
		verbose: true,
		dry: false,
		allowExternal: true,
		exclude: ['admin', 'admin_mobile']
	}),
	new HtmlWebpackPlugin({
		template: './src/public/index.ejs',
		inject: 'body'
	})
];

module.exports = env => {

	if (env == "build") {
		console.log("build");
		const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
		const uglifyJsPlugin = require('./plugins/page.uglifyJsPlugin');
		plugins.push(new UglifyJsPlugin(uglifyJsPlugin))
	} else {
		console.log("watch");
	}

	return {
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
		plugins: plugins
	}
};
