module.exports = function(grunt, options) {

	var buildFolder = options.buildFolder;
	grunt.log.write(buildFolder + options.nl);

	var nl = '\n';

	var banner = '';
	banner += '/*\n';
	banner += '          _________________________________________' + nl;
	banner += '  _______|           ballkartenonline.at           |_______' + nl;
	banner += '  \\      |       roman.marlovits@gmail.com         |      /' + nl;
	banner += '   \\     |     Copyright <%=grunt.template.today("yyyy")%> Roman Marlovits      |     /' + nl;
	banner += '    \\    |               <%=grunt.template.today("yyyy-mm-dd")%>                |    /' + nl;
	banner += '    /    |             Version: <%=pkg.version%>              |    \\' + nl;
	banner += '   /     |_________________________________________|     \\' + nl;
	banner += '  /________)                                     (________\\' + nl;
	banner += nl;
	banner += '*/' + nl;

	var banner_web_socket = '';
	banner_web_socket += '// Copyright: Hiroshi Ichikawa <http://gimite.net/en/>' + nl;
	banner_web_socket += '// License: New BSD License' + nl;
	banner_web_socket += '// Reference: http://dev.w3.org/html5/websockets/' + nl;
	banner_web_socket += '// Reference: http://tools.ietf.org/html/rfc6455' + nl;

	var banner_d3 = '';

	var banner_require = '';
	banner_require += '/** vim: et:ts=4:sw=4:sts=4' + nl;
	banner_require += ' * @license RequireJS 2.1.22 Copyright (c) 2010-2015, The Dojo Foundation All Rights Reserved.' + nl;
	banner_require += ' * Available via the MIT or new BSD license.' + nl;
	banner_require += ' * see: http://github.com/jrburke/requirejs for details' + nl;
	banner_require += ' */' + nl;
	banner_require += '//Not using strict: uneven strict support in browsers, #392, and causes' + nl;
	banner_require += '//problems with requirejs.exec()/transpiler plugins that may not be strict.' + nl;
	banner_require += '/*jslint regexp: true, nomen: true, sloppy: true */' + nl;
	banner_require += '/*global window, navigator, document, importScripts, setTimeout, opera */' + nl;

	var banner_bootstrap = '';
	banner_bootstrap += '/*!' + nl;
	banner_bootstrap += ' * Bootstrap v3.3.2 (http://getbootstrap.com)' + nl;
	banner_bootstrap += ' * Copyright 2011-2015 Twitter, Inc.' + nl;
	banner_bootstrap += ' * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)' + nl;
	banner_bootstrap += ' */' + nl;
	banner_bootstrap += '/* ========================================================================' + nl;
	banner_bootstrap += ' * Bootstrap: transition.js v3.3.2' + nl;
	banner_bootstrap += ' * http://getbootstrap.com/javascript/#transitions' + nl;
	banner_bootstrap += ' * ========================================================================' + nl;
	banner_bootstrap += ' * Copyright 2011-2015 Twitter, Inc.' + nl;
	banner_bootstrap += ' * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)' + nl;
	banner_bootstrap += ' * ======================================================================== */' + nl;

	var banner_scrollUp = '';
	banner_scrollUp += '/*' + nl;
	banner_scrollUp += 'scrollUp v1.0.0' + nl;
	banner_scrollUp += 'Author: Mark Goodyear - http://www.markgoodyear.com' + nl;
	banner_scrollUp += 'Git: https://github.com/markgoodyear/scrollup' + nl;
	banner_scrollUp += '' + nl;
	banner_scrollUp += 'Copyright 2013 Mark Goodyear' + nl;
	banner_scrollUp += 'Licensed under the MIT license' + nl;
	banner_scrollUp += 'http://www.opensource.org/licenses/mit-license.php' + nl;
	banner_scrollUp += '' + nl;
	banner_scrollUp += 'Twitter: @markgdyr' + nl;
	banner_scrollUp += '*/' + nl;

	var banner_payment = '';

	return {
		js : {
			options : {
				banner : banner
			},
			files : [ {
				expand : true,
				src : '**/*.js',
				dest : buildFolder + 'www',
				cwd : buildFolder + 'www'
			} ]
		},

		web_socket : {
			options : {
				banner : banner_web_socket
			},
			files : [ {
				expand : true,
				src : '**/*.js',
				dest : buildFolder + 'jslibs/websocket',
				cwd : buildFolder + 'jslibs/websocket'
			} ]
		},

		d3 : {
			options : {
				banner : banner_d3
			},
			files : [ {
				expand : true,
				src : '**/d3.js',
				dest : buildFolder + 'jslibs',
				cwd : buildFolder + 'jslibs'
			} ]
		},

		requirejs : {
			options : {
				banner : banner_require
			},
			files : [ {
				expand : true,
				src : '**/require.js',
				dest : buildFolder + 'jslibs',
				cwd : buildFolder + 'jslibs'
			} ]
		},

		bootstrap : {
			options : {
				banner : banner_bootstrap
			},
			files : [ {
				expand : true,
				src : '**/bootstrap.js',
				dest : buildFolder + 'jslibs',
				cwd : buildFolder + 'jslibs'
			} ]
		},

		scrollUp : {
			options : {
				banner : banner_scrollUp
			},
			files : [ {
				expand : true,
				src : '**/jquery.scrollUp.js',
				dest : buildFolder + 'jslibs',
				cwd : buildFolder + 'jslibs'
			} ]
		},

		payment : {
			options : {
				banner : banner_payment
			},
			files : [ {
				expand : true,
				src : '**/payment.js',
				dest : buildFolder + 'jslibs',
				cwd : buildFolder + 'jslibs'
			} ]
		},

	}

}
