const webpack = require('webpack');
const loaderBabel = require('./loaders/babel');

let plugins = [];

module.exports = env => {

	return {
		entry: __dirname + '/../dist/src/server.js',
		module: {
			loaders: [
				loaderBabel
			]
		},
		plugins: plugins
	}
};
