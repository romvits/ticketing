const path = require('path');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const WebpackShellPlugin = require('webpack-shell-plugin');

const loaderBabel = require('./loaders/babel');


const plugins = [
	new CleanWebpackPlugin(['dist/src/public/admin'], {
		root: __dirname + '/../',
		verbose: true,
		dry: false,
		allowExternal: true,
		exclude: ['libs']
	}),
	new WebpackShellPlugin({
		onBuildStart: ['echo "Webpack Start"'],
		onBuildEnd: ['php src/public/admin/libs/dhtmlxSuite_v51/libCompiler/lib_compiler.php']
	}),
	//new UglifyJsPlugin(uglifyJsPlugin),
	new HtmlWebpackPlugin({
		template: './src/public/admin/index.ejs',
		inject: 'body'
	})
]


module.exports = {
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
};
