const moment = require('moment');
const pkg = require('./../../package');

const now = moment();

const banner = [
	now.format('YYYY-MM-DD'),
	pkg.title,
	`@version ${pkg.version}`,
	`@license ${pkg.license}`,
	`@author ${pkg.author} (${pkg.url})`,
	`@email ${pkg.email}`,
	'Copyright (c) ' + now.format('YYYY')
].join('\n');

module.exports = {
	banner: banner,
	entryOnly: true
}
