module.exports = function (options) {

	let modString = function (string, len) {
		let newString = '';
		let strLength = string.length;
		let diff = len - strLength;
		let left = 0;
		let right = 0;
		if (diff > 0) {
			left = Math.floor(diff / 2);
			right = Math.ceil(diff / 2);
			for (let i = 0; i < left; i++) string = ' ' + string;
			for (let i = 0; i < right; i++) string += ' ';
			newString = string;
		} else {
			newString = string.substring(0, len);
		}

		return newString;
	};

	let nl = "\n";
	let pkg = options.pkg;
	let name = (pkg.name) ? pkg.name : 'demoproject';
	let email = (pkg.email) ? pkg.email : 'roman.marlovits@gmail.com';
	let yearString = (options.yearString) ? options.yearString : new Date().getFullYear().toString();
	let author = (pkg.author) ? pkg.author : 'Roman Marlovits';
	let dateFullString = (options.dateFullString) ? options.dateFullString : new Date().toISOString();
	let version = (pkg.version) ? pkg.version : '0.0.1';
	let footer = 'please do not modify or remove this'

	let banner = '';
	banner += '/*' + nl;
	banner += '          __________________________________________________' + nl;
	banner += '  _______|' + modString(name, 50) + '|_______' + nl;
	banner += '  \\      |' + modString(email, 50) + '|      /' + nl;
	banner += '   \\     |' + modString('copyright © ' + yearString + ' ' + author, 50) + '|     /' + nl;
	banner += '    \\    |' + modString('build: ' + dateFullString, 50) + '|    /' + nl;
	banner += '    /    |' + modString('version: v' + version, 50) + '|    \\' + nl;
	banner += '   /     |__________________________________________________|     \\' + nl;
	banner += '  /________)' + modString(footer, 46) + '(________\\' + nl;
	banner += nl;
	banner += '*/';

	return banner;

};
