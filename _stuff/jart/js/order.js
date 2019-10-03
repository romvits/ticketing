'use strict';
if (!window.$ajapp) window.$ajapp = {};

/*AUTO GENERATED over gen-cc-file.js
 DO NOT EDIT!*/
/******************************************************************************************/
/*** import /cls/main/_res/handlebarExtensions.js ***/
/******************************************************************************************/

Handlebars.registerHelper('l_order', function(str) {
	return $ajapp.order.lang(str);
});

Handlebars.registerHelper('_bo', function(str) {
	return '{{';
});

Handlebars.registerHelper('_bc', function(str) {
	return '}}';
});

Handlebars.registerHelper('_json', function(ob) {
	if (ob) {
		var ret = JSON.stringify(ob);
		return ret;
	}
	return '';
});

Handlebars.registerHelper('_compile_order', function(tname, _ob, map) {
	var ob = _ob;
	if (typeof ob === "string" && ob === "{null}") {
		ob = {};
	}
	if (tname && ob) {
		if (typeof map === "string" && map) {
			ob = $ajapp.order.run(map, ob);
		}
		return new Handlebars.SafeString($ajapp.order.compileElement(tname, ob));
	}
	return '';
});


Handlebars.registerHelper('_template_order', function(tname, _ob, map, prefix) {
	var ob = _ob;
	if (typeof ob === "string" && ob === "{null}") {
		ob = {};
	}
	if (tname && ob) {
		if (typeof map === "string" && map) {
			ob = $ajapp.order.run(map, ob);
		}
		if (typeof prefix === "string" && prefix) {
			tname = prefix + "." + tname;
		}
		var runner = $ajapp.order.template[tname];
		if (!runner) {
			$.log("MISSIN TEMPLATE " + tname, 0, 1);
			return "";
		}
		return new Handlebars.SafeString(runner(ob));
	}
	return '';
});


Handlebars.registerHelper('_run_order', function(cmd) {
	//var args = Array.prototype.splice.call(arguments, 1);
	var ret = $ajapp.order.run.apply($ajapp.order, arguments);
	if (!ret) return "";
	return new Handlebars.SafeString(ret);
});


Handlebars.registerHelper('_concat', function(v1, v2) {
	return '' + v1 + v2;
});


Handlebars.registerHelper('_prop', function(obj, p) {
	if (obj && obj[p]) return obj[p];
	return "";
});


Handlebars.registerHelper('_onlyOne', function(obj) {
	var ret = false;
	if (obj && obj.length && obj.length == 1) {
		ret = true;
	}
	return ret;
});


Handlebars.registerHelper('_rt_value', function(val) {
	if (!val) return "";
	return new Handlebars.SafeString(val.replace(/<[\/]{0,1}body>/gi, ""));
});

Handlebars.registerHelper('_date', function(val, format, inFormat) {
	if (!val) return "";
	var m;
	if (typeof inFormat === "string") {
		m = moment(val, inFormat);
	} else {
		m = moment(val);
	}
	var f = typeof format === "string" ? format : "DD.MM.YYYY";
	return "" + m.format(f);
});


Handlebars.registerHelper('_number', function(val, format_, locale_) {
	//TODO implement this
	//http://numeraljs.com/#use-it is already included
	var l = typeof locale_ === "string" ? locale_ : "de";
	var f = typeof format_ === "string" ? format_ : "0,0.00";
	var ret = numeral(val).format(f);
	if (l != 'en') {
		ret = ret.replace(/\./g, 'x').replace(/\,/g, '.').replace(/x/g, ',');
	}
	return ret;
	/*if(!val && val != 0) return "";
	var format = typeof format_ === "string" ? format_ : "#,##0.00";
	var locale = (typeof locale_ === "string" ? locale_ : (data["j-db-lang"] ? data["j-db-lang"] : "de"));
	var fval = parseFloat(val);
	var myFormat = new java.text.DecimalFormat(format);
	var dc = new java.text.DecimalFormatSymbols(new java.util.Locale(locale));
	myFormat.setDecimalFormatSymbols(dc);
	return "" + myFormat.format(fval);*/
});

Handlebars.registerHelper('_img_src_order', function(img) {
	var path = "";
	if ($ajapp.order.isPhoneGap) {
		path = "TODO: set local imapge path here for phone";
	} else {
		path = $ajapp.order.srvImgPath;
	}
	var imgSrc = "";
	if (img) {
		if (img.indexOf(":") !== -1) {
			imgSrc = img.split(":")[1];
		} else {
			imgSrc = img;
		}
		imgSrc = path + "/" + imgSrc;
	}
	return imgSrc;
});


/******************************************************************************************/
/*** import /cls/main/_res/functions.js ***/
/******************************************************************************************/

/*$.log = function(msg){
    if($ajapp.order.enableLog) console.log(msg);
}*/

$.fn.serializeObject = function() {
	var o = {};
	var a = this.serializeArray();
	$.each(a, function() {
		if (o[this.name] !== undefined) {
			if (!o[this.name].push) {
				o[this.name] = [o[this.name]];
			}
			o[this.name].push(this.value || '');
		} else {
			o[this.name] = this.value || '';
		}
	});
	return o;
};

function $filter(sel, el) {
	return $(el).find(sel).addBack(sel);
}

$.uid = function(_len) {
	var ret = "";
	var len = _len ? _len : 2;
	for (var i = 0; i < len; i++) {
		ret += (ret ? "X" : "R") + (((1 + Math.random()) * 0x10000000) | 0).toString(16).substring(1);
	}
	return ret;
};

$.fn.isOnScreen = function(Cor) {
	var win = $(window);


	var viewport = {
		top: win.scrollTop() + (Cor ? Cor : 0),
		//left : win.scrollLeft() + (Cor ? Cor : 0)
	};

	//viewport.right = viewport.left + win.outerWidth();
	viewport.bottom = viewport.top + win.outerHeight();

	var bounds = this.offset();
	//bounds.right = bounds.left + this.outerWidth();
	bounds.bottom = bounds.top + this.outerHeight();


	return (!(viewport.bottom < bounds.top));

};


var $instance = null;

$ajapp.order = {
	enableCodeHints: false,
	template: {},
	templateSource: {},
	datasrc: {},
	config: {},
	langdata: {},
	devmode: null,
	timedDelay: 10000,
	missingLang: {},
	enableLog: true,
	logMissingLang: false,
	drawTo: "#master",
	channelReadyState: "C1A1",

	absPath: "",
	appname: "",


	"___info: ajAppC.js": function() {
		/***
		 * general app functions
		 *
		 *
		 * */
	},

	_startJsDocu: function(objTo) {
		var me = this;
		if (!this.isReady) {
			setTimeout(function() {
				me._startJsDocu(objTo);
			}, 5);
			return;
		}
		objTo.runJsDocu(this);
	},


	registerChannel: function(channel, cb) {
		if ($.jartWebsocket) {
			$.jartWebsocket.registerChannel(this.myId, channel, cb);
		}
	},

	unregisterChannel: function(channel, cb) {
		if ($.jartWebsocket) {
			$.jartWebsocket.unregisterChannel(this.myId, channel);
		}
	},

	onChannel: function(data, channel) {
		$.log("global channel data arrived, please implement onChannel: function(data, channel). channel: " + channel + ", data: " + data);
	},

	getWebsocketClientId: function() {
		if ($.jartWebsocket) return $.jartWebsocket.clientId;
		return null;
	},


	loadAjapp: function(url, _prop, _mode) {
		var clsName = url.substr(url.lastIndexOf("/") + 1);
		clsName = clsName.substr(0, clsName.indexOf('.jartc'));
		var mode = _mode ? _mode : "start";
		var prop = _prop ? _prop : {};
		if (!$ajapp[clsName]) {
			var path = url.substr(0, url.indexOf('.jartc'));
			$('<link rel="stylesheet" href="' + path + '.css">').appendTo("head");
			$('<script src="' + url + '?cmd=getJS"></script>').appendTo("body");
			//var propStr = JSON.stringify(prop);
			var propId = "loadAjappPROP_" + $.uid();
			$[propId] = prop;
			$('<script type="text/javascript">$ajapp.' + clsName + '._init("' + this.curlang + '")._' + mode + '($.' + propId + '); delete $.' + propId + '; </script>').appendTo("body");
		} else {
			$ajapp[clsName]["_" + mode](prop);
		}
	},

	onWsStateChanged: function(wst) {
		/***
		 * implement in your ajapp to react on websocket state changes
		 * wst is a string value representig the different socket states in
		 * format type char and 0 for false or 1 for true.
		 * type chars:
		 ** C = connection
		 ** A = all ready
		 ** S = stopped by user or function
		 ** L = login ok if login was required
		 *
		 * Examples:
		 ** "C0A0S0L0" is currently conneting
		 ** "C1A1S0L0" connected an not logged in
		 ** "C1A1S0L1" connected an logged in
		 ** "C0A0S1L0" manually diskonneted
		 * **/
	},

	wsStateChanged: function(wst) {
		this.onWsStateChanged(wst);
	},

	run: function(cmd) {
		if (this[cmd]) {
			var args = Array.prototype.splice.call(arguments, 1);
			return this[cmd].apply(this, args);
		}
		$.log("run MISSING FUNCTION: " + cmd);

	},

	handleData: function(data) {

	},

	jvalidationChecks: {},

	routing: {},

	silentRouting: false,

	_go: function(r, rpath, _data, el, oldR) {
		var data = _data ? _data : {};
		if (r.length > 0) {
			var cstep = r.shift();
			var oldStep = oldR.length > 0 ? oldR.shift() : "";
			var checkNew = cstep;
			var checkOld = oldStep;
			rpath.push(cstep);
			var rt = $ajapp.orderRouting.routing[rpath.join("/")];
			if (rt.args) {
				var args = rt.args.split(",");
				for (var i = 0; i < args.length; i++) {
					var a = r.shift();
					checkNew += "/" + a;
					var aOld = oldR.length > 0 ? oldR.shift() : "";
					checkOld += "/" + aOld;
					data[args[i]] = a;
				}
			}
			$.log(checkOld + " > " + checkNew);
			$.log(r);
			if (checkOld == checkNew) {
				this._go(r, rpath, data, el, oldR);
			} else {
				if (rt) {
					rt.prc = rt.process.split(",");
					this._nextStep(rt, r, rpath, data, el, cstep, oldR);
				}
			}
		}
	},

	_nextStep: function(rt, r, rpath, data, el, cstep, oldR) {
		var curProcess = rt.prc.shift();
		if (curProcess) {
			this._goStep(curProcess, rt, r, rpath, data, el, cstep, oldR);
		} else {
			this._go(r, rpath, data, el, oldR);
		}
	},

	_goStep: function(curProcess, rt, r, rpath, data, el, cstep, oldR) {
		$.log("run step " + rpath + " : " + curProcess);
		if (curProcess == "draw") {
			this.draw(rt.draw ? rt.draw : cstep, data, rt.target, rt.drawMode);
			this._nextStep(rt, r, rpath, data, el, cstep, oldR);
		} else if (curProcess == "request") {
			var cbN = "R" + $.uid();
			this[cbN] = function(data) {
				this._nextStep(rt, r, rpath, data, el, cstep, oldR);
				delete this[cbN];
			};
			this.send(rt.request ? rt.request : cstep, cbN, data);
		} else {

		}
	},

	goRouting: function(_r, data, el) {
		if (this.silentRouting) {
			$ajapp.orderRouting.goRouting(_r, data, el);
		} else {
			document.location.hash = _r;
		}
	},

	setRouting: function() {
		if (!$ajapp.orderRouting) {

			$ajapp.orderRouting = {
				routing: {},

				goRouting: function(_r, data, el) {
					var r = _r.split("/");
					var app = r.shift();
					var rpath = [app];
					if ($ajapp[app]) {
						$.log("***** " + _r);
						var oldR = (this.lastRouting ? this.lastRouting : "").split("/");
						var oldApp = oldR.shift();
						this.lastRouting = _r;
						if (oldApp != app) {
							oldR = [];
						}
						$ajapp[app]._go(r, rpath, data, el, oldR);
					} else {
						$.log("load app have to be implemented");
					}
				}

			};

			window.onhashchange = function(evt) {
				$ajapp.orderRouting.goRouting("" + document.location.hash.substr(1));
			};
		}

		for (var n in this.routing) {
			$ajapp.orderRouting.routing[this.appname + n] = this.routing[n];
		}
	},

	_init: function(lang, p) {
		if (p) $.extend(this, p);
		this.setRouting();
		this.jvalidation.checks = this.jvalidationChecks;
		this.jvalidation.checks.__self = this;
		var appname = this.appname;
		this.addTemplate("_draw_" + appname, "{{#each this}}{{#if this._template}}{{_template_" + appname + " this._template this this._map}}{{/if}}{{/each}");
		this.addTemplate("_sub_" + appname, "{{_template_" + appname + " '_draw_" + appname + "' this._sub}}");
		this.addTemplate("_compileSub_" + appname, "{{#each sub__data}}{{_compile_" + appname + " element__type this}}{{/each}}");
		//if(this.enableCodeHints && !this.isPhoneGap) startCodeHints("ajapp");
		this.curlang = lang;
		this.localPath = "/jart" + this.absPath;
		this.appCall = "https://juristenball.ticketselect.io/" + this.localPath + "/" + this.appname + ".jart";
		this.initA();
		return this;
	},


	_start: function(p) {
		if (p) $.extend(this, p);
		this.jvalidation.checks.__self = this;
		var me = this;
		if (this.reloadFormFieldData && this.formFieldLoadByNew) {
			this.formFieldLoadByNew(function() {
				me._start();
			});
			return;
		}
		if (!this.isReady) {
			setTimeout(function() {
				me._start();
			}, 5);
			return;
		}
		if ($.jartWebsocket) $.jartWebsocket.register(this.myId, this);
		$(this.drawTo).addClass("__instance");
		$(this.drawTo).data("__instance", this);
		if (this.start) {
			this.start();
		} else {
			if (document.location.hash && ("" + document.location.hash) !== "#" && ("" + document.location.hash) !== "") {
				$ajapp.orderRouting.goRouting("" + document.location.hash.substr(1));
			} else {
				this.goRouting(this.appname + "/start");
			}
		}
		return true;
	},

	_skip: function(p) {
		if (p) $.extend(this, p);
	},

	_remove: function() {
		if ($.jartWebsocket) $.jartWebsocket.unregister(this.myId);
		$(this.drawTo).html("");
	},

	_new: function(_p, cb) {
		if (!this.isReady) {
			var me = this;
			setTimeout(function() {
				me._new(_p, cb);
			}, 5);
			return;
		}
		var newInstance = $.extend(true, {}, this, _p ? _p : {});
		newInstance.myId = this.appname + ":" + $.uid();
		newInstance.jvalidation.checks.__self = newInstance;
		if (cb) {
			cb(newInstance);
		} else {
			newInstance._start();
		}
	},

	drawData: function(data) {
		this.draw(data.__template, data, data.__target ? this.$(data.__target) : this.drawTo, data.__mode);
	},

	saveForm: function(el, data) {
		var cmd = el.attr("name");
		$("button[type=submit]", el).prop("disabled", true);
		this.send(cmd, "", data);
	},

	send: function(cmd, cb, data) {
		if ($.jartWebsocket && $.jartWebsocket.allReady) {
			if (!this.sendWS(cmd, cb, data)) {
				this.sendHttp(cmd, cb, data);
			}
		} else {
			this.sendHttp(cmd, cb, data);
		}
	},

	postToBlank: function(cmd, data) {
		$("#postform").remove();
		var pf = $("<form>", {action: this.appCall, method: "POST", target: "_blank", id: "postform"}).appendTo("body");
		$("<input>", {type: "hidden", name: "cmd", value: cmd}).appendTo(pf);
		$("<input>", {type: "hidden", name: "data", value: JSON.stringify(data ? data : {})}).appendTo(pf);
		pf.submit();
	},

	sendWS: function(cmd, cb, data) {
		if (typeof cb === 'object') {
			data = cb;
			cb = "";
		}
		var d = data ? data : {};
		d.__lang = this.curlang;
		if (!$.jartWebsocket || !$.jartWebsocket.allReady) {
			$.log("ERROR Websocket not ready!");
			return;
		}
		var clsCall = this.appCall.substr(5);
		return $.jartWebsocket.send(clsCall, cmd, $.extend({__cbObject: this.myId, __cbCommand: cb ? cb : ""}, d));
	},

	sendHttp: function(cmd, cb, data) {
		if (typeof cb === 'object') {
			data = cb;
			cb = "";
		}
		var d = data ? data : {};
		d.__lang = this.curlang;
		console.warn('sendHttp', cmd, cb, data);
		this.req(cmd, d, function(result, rText) {
			console.log(result, rText);
			if (!result && rText) {
				$.log("Unexpected HTTP Result: " + rText);
				return;
			}
			if (result && result.__cbCommand) {
				this.run(result.__cbCommand, result);
				return;
			}
			this.run(cb, result);
		});
	},

	getEventObject: function(e) {
		if (e.originalEvent) return e.originalEvent;
		return e;
	},

	getEventAbsPos: function(e) {
		var eObj = this.getEventObject(e);
		return {target: eObj.target, x: eObj.clientX, y: eObj.clientY};
	},

	req: function(cmd, data, _cb, _type) {
		var cb = _cb ? _cb : this.handleData;
		var type = _type ? _type : "json";
		var me = this;
		var params = {cmd: cmd, data: data ? JSON.stringify(data) : JSON.stringify({})};
		$.ajax({
			url: this.appCall,
			method: 'POST',
			dataType: type,
			data: params,
			success: function(_data) {
				cb.apply(me, [_data]);
			},
			error: function(eOb) {
				cb.apply(me, [null, eOb.responseText]);
			}
		});
	},

	addTemplateFile: function(name, v) {
		var code = v;
		var pos1 = code.indexOf("<!---###");
		if (pos1 > -1) {
			var ncode = code.substr(pos1 + 8);
			code = code.substr(0, pos1);
			var pos2 = ncode.indexOf("###--->");
			var nname = ncode.substr(0, pos2);
			ncode = ncode.substr(pos2 + 7);
			code = code.replace(/[\r\n\t]/g, "");
			this.addTemplate(name, code);
			this.addTemplateFile(nname, ncode);
		} else {
			code = code.replace(/[\r\n\t]/g, "");
			this.addTemplate(name, code);
		}
	},

	loadLocal: function(url, cb, _ltype) {
		//$.log(url);
		var _url = url;
		var ltype = _ltype ? _ltype : "json";
		var me = this;
		if (url.indexOf("/jart/") === 0) {
		} else if (url.indexOf("/") === 0) {
			_url = "/jart" + url;
		} else {
			_url = this.localPath + "/" + url;
		}
		$.ajax({
			url: _url,
			method: 'POST',
			dataType: ltype,
			success: function(_data) {
				cb.apply(me, [_data]);
			},
			error: function() {
				cb.apply(me, [null]);
			}
		});
	},

	initLocalValue: function(name, value) {
		if (typeof localStorage[name] === 'undefined') localStorage[name] = value;
	},

	appAlert: function(msg) {
		alert(msg);
	},

	appConfirm: function(msg) {
		return confirm(msg);
	},

	$: function(sel) {
		return $(sel, this.drawTo);
	},

	lang: function(str) {
		if (!str) return "";
		var k = str.replace(/[^a-zA-Z0-9\.\-]/g, '').replace(/^[0-9\.\-]*/g, '');
		if (k.length > 25) k = k.substr(0, 25) + "." + k.length;
		if (this.langdata[k]) return this.langdata[k];
		if (this.logMissingLang) {
			if (!this.missingLang[str]) this.missingLang[str] = true;
			var out = "";
			for (var n in this.missingLang) {
				out += (out ? "\n" : "") + n;
			}
			$.log("*** missing lang *****************************\n" + out);
		}
		return str;
	},

	getLocalStorageRef: function() {
		return this.localPath + "/" + this.appname + ":";
	},

	globalLanguageFile: "",

	loadGobalLanguageData: function(useLS, LSName) {
		this.loadLocal(this.globalLanguageFile + "." + this.curlang + ".json", function(data) {
			this.langdata = $.extend(this.langdata, data);
			this.loadLanguageData(useLS, LSName);
		});
	},

	loadLanguageData: function(useLS, LSName) {
		this.loadLocal(this.appname + ".lang." + this.curlang + ".json", function(data) {
			this.langdata = $.extend(this.langdata, data);
			if (useLS) {
				localStorage[LSName] = JSON.stringify(data);
				localStorage[LSName + ".version"] = this.appVersion;
			}
			this.initB();
		});
	},

	initA: function(data) {
		if (!window.$instance) $instance = function(el, smd, e) {
			$(el).closest(".__instance").each(function() {
				var data = null;
				$(el).closest("[data-data]").each(function() {
					data = $(this).data("data");
				});
				$(this).data("__instance").run(smd, $(el), data, e);
			});
		};
		this.appCall += "c";
		this.myId = this.appname;

		var LSName = this.getLocalStorageRef() + "lang." + this.curlang;
		var useLS = false;
		var doLoad = true;
		if (this.appVersion && localStorage) {
			useLS = true;
			if (localStorage[LSName + ".version"] == this.appVersion) {
				this.langdata = JSON.parse(localStorage[LSName]);
				doLoad = false;
			}
		}
		if (doLoad) {
			if (this.globalLanguageFile) {
				this.loadGobalLanguageData(useLS, LSName);
			} else {
				this.loadLanguageData(useLS, LSName);
			}
		} else {
			this.initB();
		}
	},

	initB: function(data) {
		var LSName = this.getLocalStorageRef() + "html";
		var useLS = false;
		var doLoad = true;
		if (this.appVersion && localStorage) {
			useLS = true;
			if (localStorage[LSName + ".version"] == this.appVersion) {
				var templateData = localStorage[LSName];
				this.addTemplateFile("__dummy", templateData);
				doLoad = false;
				this.initFin();
				return;
			}
		}
		if (doLoad) {
			this.req("getHTML", {}, function(data) {
				if (data) {
					if (data.substr(0, 1) == '{') {
						if (data.indexOf('"__cbCommand"') > -1) {
							var c = JSON.parse(data);
							this[c.__cbCommand](data);
							return;
						}
					}
					if (useLS) {
						localStorage[LSName] = data;
						localStorage[LSName + ".version"] = this.appVersion;
					}
					this.addTemplateFile("__dummy", data);
				}
				this.initFin();
			}, "text");
		}
	},


	initFin: function() {
		if (this.routing) {
			if (this.init) {
				this.init();
			} else {
				this.isReady = true;
			}
		} else {
			if (this.init) {
				if (this.init()) {
					this.draw("main", this, "#" + this.appname);
				}
			} else {
				this.draw("main", this, "#" + this.appname);
			}
		}

	},

	runTimed: function() {
	},


	getTemplate: function(_template, part) {
		if (typeof _template === "string") {
			return (part && _template.indexOf(".") === -1 ? part.name + "." : "") + _template;
		}
		if ($.isArray(_template)) {
			for (var i = 0; i < _template.length; i++) {
				var ck = part && _template[i].indexOf(".") === -1 ? part.name + "." + _template[i] : _template[i];
				if (this.template[ck]) {
					return ck;
				}
			}
			return "";
		} else if ($.isFunction(_template)) {
			return _template(data, target, mode);
		}
		return "";
	},

	compileElement: function(template, data) {
		var tmpl = template;
		if (this.compliePrefix && !this.template[template]) this.each(this.compliePrefix, function(i, v) {
			if (this.template[v + tmpl]) {
				tmpl = v + tmpl;
			}
		});
		if (!this.template[tmpl]) {
			var tstr = template;
			if (this.compliePrefix) this.each(this.compliePrefix, function(i, v) {
				tstr += " or " + v + template;
			});

			$.log("MISSING TEMPLATE: " + tstr);
			return "";
		}
		return this.template[tmpl](data);
	},

	draw: function(template, data, _target, mode, disableEvents) {
		var target = _target ? _target : this.drawTo;
		if (!this.template[template]) {
			$.log("MISSING TEMPLATE: " + template);
			return;
		}
		if (!mode) $(target).html('');
		var ret = $(this.template[template](data));
		//$.log({template: template, data: data, ret: ret});
		if (mode == 'prepend') {
			ret.prependTo(target);
		} else if (mode == 'replace') {
			ret.insertAfter(target);
			target.remove();
		} else {
			ret.appendTo(target);
		}
		if (!disableEvents) this.setEvents(ret, data);
		return ret;
	},

	serializeObject: function(el, data) {
		$(">[name]", el).each(function() {
			var e = $(this);
			var nn = e.prop("tagName");
			var n = e.attr("name");
			var nt = n + ".text";
			var v = "";
			var tv = "";
			var t = e.attr("type");
			if (t === "radio" || t === "checkbox") {
				if (e.prop("checked")) {
					v = e.attr("value");
					tv = e.parent().text();
				}
			} else {
				v = e.val();
			}
			if (v && nn === "SELECT") {
				tv = $("option", e)[e[0].selectedIndex].innerHTML;
			}
			if (!data[n]) data[n] = "";
			if (v) {
				data[n] += (data[n] ? "," : "") + v;
				if (tv) {
					if (!data[nt]) data[nt] = "";
					data[nt] += (data[nt] ? ", " : "") + tv;
				}
			}
		});
		$(">:not('.repeater')", el).each(function() {
			$ajapp.order.serializeObject($(this), data);
		});
		$(">.repeater", el).each(function() {
			var dn = $(this).data("dataname");
			var ndata = [];
			data[dn] = ndata;
			$(">.repeateritem", $(this)).each(function() {
				var nnd = {};
				$ajapp.order.serializeObject($(this), nnd);
				ndata.push(nnd);
			});
		});
		/*$(".repeater", el).each(function(){
			var newa = [];
			var dname = $(this).data("dataname");
			data[dname] = newa;
			$.each(">.repeateritem", function(){

			});
		});*/
	},

	jvalidation: {

		isMsgChanged: function(m1) {
			var ret = $ajapp.order.lang(m1);
			if (m1 == ret) {
				return null;
			}
			return ret;
		},

		getMessageValue: function(nname, nob, fname, params) {
			if (params.message) return $ajapp.order.lang(params.message);
			var msg = this.isMsgChanged(nname + "." + nob + "." + fname);
			if (msg === null) msg = this.isMsgChanged(nname + "." + fname);
			if (msg === null) msg = this.isMsgChanged(nname + "." + nob);
			if (msg === null) msg = this.isMsgChanged(nname);
			if (msg === null && window.jvalidation_messages) msg = window.jvalidation_messages[nname];
			if (!msg) msg = $ajapp.order.lang("please provide a valid value for this field");
			return msg;
		}
	},

	setEvents: function(toEl, data) {
		var me = this;
		/*$filter("[name]", toEl).each(function(){
			var e = $(this);
			if(data && data[$(this).attr("name")]){
				if(e.attr("type") && e.attr("type") == "checkbox" && data[e.attr("name")].indexOf(e.val()) > -1){
					e.prop("checked", true);
				} else if(e.attr("type") && e.attr("type") == "radio" && data[e.attr("name")] == e.val()){
					e.prop("checked", true);
				} else {
					e.val(data[e.attr("name")]);
				}
			}
		});*/
		$filter("select", toEl).each(function() {
			$(this).val($(this).attr("value"));
		});
		$filter(".optionkeeper", toEl).each(function() {
			var v = $(this).data("value");
			$("input[value='" + v + "']", this).prop("checked", true);
		});
		$filter(".checkboxkeeper", toEl).each(function() {
			var v = "," + $(this).data("value") + ",";
			$("input", this).each(function() {
				if (v.indexOf("," + $(this).attr("value") + ",") > -1) {
					$(this).prop("checked", true);
				}
			});
			$("input[value='" + v + "']", this).prop("checked", true);
		});
		$filter("form:not([data-run])", toEl).each(function() {
			var cur = $(this);
			if (cur.jvalidation) cur.jvalidation(me.jvalidation);
		});
		$filter("[data-run]", toEl).each(function() {
			var cur = $(this);
			if (cur.attr("data-toggle") == "tab") return;
			var tag = cur.prop("tagName").toUpperCase();
			if (tag == "FORM") {
				if (cur.jvalidation) cur.jvalidation(me.jvalidation);
				cur.submit(function() {
					var el = $(this);
					var hasError = el.hasClass("validation-error") || $(".has-error", el).length > 0 || $(".field_error", el).length > 0;
					if (!hasError) {
						//var data = el.serializeObject();
						var data = {};
						$ajapp.order.serializeObject(el, data);
						me.run(el.data("run"), el, data);
						return false;
					} else {
						//$.log("val error");
					}
					return false;
				});
			} else if (cur.prop("contenteditable") == "true") {
				cur.data("curdata", cur.html());
				cur.data("curtxt", cur.text());
				cur.blur(function() {
					var el = $(this);
					var oldData = el.data("curdata");
					if (el.data("curdata") != el.html()) {
						el.data("curdata", el.html());
						me.run(el.data("run"), el, {txt: el.text(), oldTxt: el.data("curtxt"), html: el.html(), oldHtml: oldData});
					} else {
						if (el.data("cancel")) me.run(el.data("cancel"), el, {txt: el.text(), oldTxt: el.data("curtxt"), html: el.html(), oldHtml: oldData});
					}
					return false;
				});
				if (cur.hasClass("on-enter")) {
					cur.keydown(function(e) {
						if (e.keyCode == 13) {
							e.stopPropagation();
							$(this).blur();
							return false;
						}
					});
				}
				cur.keyup(function(e) {
					if (e.keyCode == 27) {
						var el = $(this);
						el.html(el.data("curdata"));
						el.blur();
					}
				});
			} else if ((" INPUT SELECT TEXTAREA ").indexOf(" " + tag + " ") > -1) {
				cur.change(function(e) {
					var el = $(this);
					me.run(el.data("run"), el, el.val(), e);
					return false;
				});
			} else {
				if ($ajapp.order.isPhoneGap && cur.tap) {
					cur.tap(function(e) {
						var el = $(this);
						me.run(el.data("run"), el, el.closest("[data-data]").data("data"), $(this).data(), e);
						if (el.closest(".mainnav").length > 0) {
							$(".active", el.closest(".mainnav")).removeClass("active");
							el.parent().addClass("active");
						}
						if (!el.hasClass("is-menu")) return false;
					});
				} else {
					cur.click(function(e) {
						var el = $(this);
						me.run(el.data("run"), el, el.closest("[data-data]").data("data"), $(this).data(), e);
						if (el.closest(".mainnav").length > 0) {
							$(".active", el.closest(".mainnav")).removeClass("active");
							el.parent().addClass("active");
						}
						if (!el.hasClass("is-menu")) {
							return false;
						}
					});
				}
			}
		});
		$filter(".do-clickmarker a", toEl).click(function() {
			$(this).closest(".do-clickmarker").each(function() {
				$(".clickmarker", $(this).parent()).removeClass("clickmarker");
				$(this).addClass("clickmarker");
			});
		});
		$filter("[data-ondraw]", toEl).each(function() {
			var r = "" + $(this).data("ondraw");
			$(this).data("ondraw", "");
			$(this).removeAttr("data-ondraw");
			if (r) {
				me.run(r, $(this));
			}
		});
	},

	each: function(ob, cb) {
		var me = this;
		if (ob) $.each(ob, function(i, v) {
			cb.apply(me, [i, v]);
		});
	},

	addTemplate: function(name, code) {
		//$.log("compile template " + name + " code: " + code);
		this.templateSource[name] = code;
		this.template[name] = Handlebars.compile(code);
	}


};


$.extend($ajapp.order, {
	isHttpStartup: true,

	_start_SUPER_Rf2862e9X56e88a8: $ajapp.order._start,

	_start: function(p) {
		if (!this._start_SUPER_Rf2862e9X56e88a8(p)) return;
		this.drawTo = "body";
		this.setEvents($("body"), {});
		this.htmlEventsSet = true;
	},

});
$.extend($ajapp.order, {
	rowId: parseInt(Math.random() * 9999999999),

	reloadFormFieldData: false,

	drawModal: function(template, data) {
		var ret = this.draw(template, data, this.drawTo, "append");
		ret.modal().on('hidden.bs.modal', function() {
			ret.remove();
		});
		$("input, textarea, select, .btn-focus", ret).first().focus().select();
		return ret;
	},

	openModal: function(el, data) {
		if (data && typeof data === 'string') {
			this.drawModal(data, {});
		}
	},

	closeModal: function(c) {
		if (c && typeof c === 'string') {
			$("#" + c).modal("hide");
		} else {
			$(".modal").modal("hide");
		}
	},

	formFieldLoadByNew: function(cb, force) {
		if ((this.reloadFormFieldData || force) && this.formFieldDataLoader && this.formFieldDataLoader.length > 0) {
			this.reloadFormFieldData = false;
			var me = this;
			this.formFieldLoadByNewNext(0, cb);
		}
	},

	formFieldLoadByNewNext: function(cnum, cb) {
		var me = this;
		this.loadFormFieldData(this.formFieldDataLoader[cnum], function() {
			var ncnum = cnum + 1;
			if (me.formFieldDataLoader.length > ncnum) {
				me.formFieldLoadByNewNext(ncnum, cb);
			} else {
				cb.apply(me);
			}
		});
	},

	formLoadTemplate: function(_tmpl, cb, useCachedData) {
		if (!this.formFieldDataLoader) this.formFieldDataLoader = [];
		var tmpl = _tmpl;
		var me = this;
		if (_tmpl.indexOf("/") == -1) {
			tmpl = this.localPath + "/" + _tmpl;
		}
		var myLoader = {tmpl: tmpl};
		if (!useCachedData) this.formFieldDataLoader.push(myLoader);
		var LSName = this.getLocalStorageRef() + "tmpl." + tmpl;
		var useLS = false;
		if (this.appVersion && localStorage) {
			useLS = true;
			if (localStorage[LSName + ".version"] == this.appVersion) {
				myLoader.data = JSON.parse(localStorage[LSName]);
				this.loadFormFieldData(myLoader, cb, true, useCachedData ? useLS : false, LSName);
				return;
			}
		}
		this.loadLocal(tmpl + ".json", function(data) {
			myLoader.data = data;
			if (useLS) {
				localStorage[LSName] = JSON.stringify(data);
				localStorage[LSName + ".version"] = this.appVersion;
			}
			this.loadFormFieldData(myLoader, cb, false, useCachedData ? useLS : false, LSName);
		});
	},

	loadFormDataParams: null,

	loadFormFieldData: function(myLoader, cb, fromCache, useLS, LSName) {
		var me = this;
		var tmpl = myLoader.tmpl;
		var data = myLoader.data;
		if (fromCache && useLS) {
			var lstr = localStorage[LSName + ".cTempl"];

			if (lstr) {
				var tdata = JSON.parse(lstr);
				for (var i = 0; i < tdata.length; i++) {
					me.addTemplate(tdata[i].name, tdata[i].data);
				}
				if (cb) {
					cb.apply(me);
				}
				return;
			}
		}
		var reqDat = {params: {tfile: (tmpl.indexOf("/jart/") === 0 ? "/" + tmpl.split("/jart/")[1] : tmpl)}, __lang: this.curlang};
		if (this.loadFormDataParams) {
			reqDat.params = $.extend(reqDat.params, this.loadFormDataParams);
		}
		this.req("getFormListData", reqDat, function(fdata) {
			this.formFieldData = fdata;
			var cTempl = [];
			this.compileFormTemplate(data, useLS, cTempl);
			if (useLS) localStorage[LSName + ".cTempl"] = JSON.stringify(cTempl);
			if (cb) {
				cb.apply(me);
			}
		});
	},

	templateCreator: function(tname, cb, ext, force) {
		if (!force && this.template[tname]) return;

		var gen = $.extend({
			types: {
				"field": {"element__type": "field", "fieldcaption": "", "type": "string", "fieldname": ""},
				"b4modal": {"element__type": "b4modal", "id": "", "backdrop": "static", "title": "Dialog", "dialogClass": "modal-lg"}
			},
			setter: {
				"_": function(p) {
					if (p.c) {
						p["class"] = p.c;
						p["classes"] = p.c;
						delete p.c;
					}
					return p;
				},
				"field": function(p) {
					if (p.n) {
						p.fieldname = p.n;
						delete p.n;
					}
					if (!p.fieldcaption) p.fieldcaption = p.fieldname;
					if (p.type == "hidden") p.fieldcaption = "";
					return p;
				},
				"b4modal": function(p) {
					if (!p.id) p.id = "DLG" + $.uid();
					return p;
				},
			}
		}, ext ? ext : {});

		var _ = function(type, _prop, sub) {
			var prop = $.extend({}, _prop);
			prop = gen.setter._(prop);
			prop = gen.setter[type] ? gen.setter[type](prop) : prop;
			var r = gen.types[type] ? gen.types[type] : {"element__type": type};
			var x = $.extend({}, r, prop);
			x.sub__data = sub ? sub : [];
			return x;
		};

		var t = {
			"element__type": "template",
			"template_name": tname,
			"sub__data": cb.apply(this, [_])
		};

		this.compileFormTemplate([t]);
	},

	compileFormTemplate: function(data, useLS, cTempl) {
		this.compliePrefix = ["hb.code:", "bootstrap.element:", "form.element:"];
		this.each(data, function(i, v) {
			if (v.element__type === "template") {
				var c = this.compileElement("_compileSub_" + this.appname, v);
				if (useLS) cTempl.push({name: v.template_name, data: c});
				this.addTemplate(v.template_name, c);
			}
		});
	},

	newRowId: function() {
		this.rowId = parseInt(Math.random() * 9999999999);
	},

	getRowId: function(fn) {
		return this.rowId;
	},

	formParsedCode: function(code) {
		if (!code) return "";
		return code.replace(/_template/g, "_template_" + this.appname).replace(/_run/g, "_run_" + this.appname);
	},

	formDrawOption: function(fname) {
		var ret = "";
		if (this.formFieldData[fname]) this.each(this.formFieldData[fname], function(i, v) {
			v.caption = this.lang(v.caption);
			ret += this.template["form.element:field.select.option"](v);
		});
		return ret;
	},

	formDrawRadio: function(fname, cls) {
		var ret = "";
		if (this.formFieldData[fname]) this.each(this.formFieldData[fname], function(i, v) {
			v.fieldname = fname;
			v.class = cls;
			v.caption = this.lang(v.caption);
			ret += this.template["form.element:field.option.item"](v);
		});
		return ret;
	},


	formDrawCheckbox: function(fname, cls) {
		var ret = "";
		if (this.formFieldData[fname]) this.each(this.formFieldData[fname], function(i, v) {
			v.fieldname = fname;
			v.class = cls;
			v.caption = this.lang(v.caption);
			ret += this.template["form.element:field.checkbox.item"](v);
		});
		return ret;
	},

	formCheckRepeater: function(el, min, max) {
		var _min = min;
		var _max = max;
		if (typeof (min) == "undefined") {
			_min = parseInt(el.data("min"));
			_max = parseInt(el.data("max"));
		}
		var cnt = 0;
		$(">.repeateritem", el).each(function() {
			cnt++;
			if (cnt > _max) el.remove();
		});
		while (cnt < _min) {
			this.formAddRepeater(el);
			cnt++;
		}
	},

	formDelRepeater: function(el) {
		var ri = el.closest(".repeater");
		var di = el.closest(".repeateritem");
		di.remove();
		this.formCheckRepeater(ri);
	},

	formAddRepeater: function(el, data) {
		var me = this;
		this.newRowId();
		var dataname = el.data("dataname");
		var template = el.data("template");
		var _max = parseInt(el.data("max"));
		if ($(">.repeateritem", el).length < _max) {
			var nel = me.draw("form.element:repeated.item", {dataname: dataname, template: template}, el, "append");
			me.draw(template, data ? data : {}, nel);
			return true;
		}
		return false;
	}

});

$.extend($ajapp.order, {
	initPayment: function() {
		$.log("********* payment init")
		var $payment = $("#payment");

		var rel = $payment.data("rel");
		var bestellung_id = $payment.data("bestellung_id");
		var dataModel = {
			bestellung_id: bestellung_id
		};

		var formLabels = {};

		HEIDELPAY.init("#heidelpayIframe",
			"/jart/prj3/jart_ticket/resources/api/heidelpay/jart_ticket-payment.jartc",
			rel,
			formLabels,
			dataModel,
			onPaymentSuccess,
			onPaymentFailure);
	}
});


//*************************

function onPaymentSuccess() {
	//alert("payment success");
	window.location.href = (window.location.href + "?").split("?")[0] + "?req=paymentok";
	//this.draw("payment-success", this.formData, ".view-wrapper");
	//this.send("clearSession");
}


function onPaymentFailure() {
	//alert("payment failure");
	window.location.href = (window.location.href + "?").split("?")[0] + "?req=paymentfail";
	//this.draw("payment-failure", this.formData, ".view-wrapper");
}

const HEIDELPAY = function() {

	var iframeSelector, jartClassPath, lang, customData;
	var typeId; //payment ID we got from Iframe
	var paymentMethod; //payment method (card, paypal, sofort, ...)
	var onPaymentSuccess;
	var onPaymentFailure;

	//default labels
	var formLabels = {
		"heidelpay.card": "Kreditkarte",
		"heidelpay.sofort": "Sofortüberweisung",
		"heidelpay.paypal": "PayPal",
		"heidelpay.pay": "Bezahlen"
	}

	function setFormLabels(newFormLabels) {
		//overwrite only existing values
		formLabels = Object.keys(formLabels)
			.reduce(function(accumulator, key) {
				accumulator[key] = newFormLabels[key]
				return accumulator
			}, {});
		$.log("formLabels: ");
		$.log(formLabels);
	}

	function doRedirect(url) {
		$(iframeSelector)[0].src = url;
		/*
		var message = {
			type: "redirect",
			redirectUrl: url
		};

		*/

		//send message to included iframe to redirect
		//$(iframeSelector)[0].contentWindow.postMessage(message, '*');
	}

	function onIframeMessage(event) {
		console.log("payment-extension.onIframeMessage");
		console.log(event);
		if (event.data.type) {
			if (event.data.type == "getPaymentTypes") {
				getPaymentTypes();

			} else if (event.data.type == "gotTypeId") {
				typeId = event.data.typeId;
				paymentMethod = event.data.paymentMethod;

				startPayment();
			} else if (event.data.type == "paymentFinished") {
				if (event.data.success == "true") {
					onPaymentSuccess();
				} else {
					onPaymentFailure();
				}
			}
		}
	}

	function sendIframeMessage() {
		//message types
		//tell iframe to redirect
	}

	function init(_iframeSelector, _jartClassPath, _lang, _formLabels, _customData, _onPaymentSuccess, _onPaymentFailure) {
		iframeSelector = _iframeSelector;
		jartClassPath = _jartClassPath;
		lang = _lang;
		setFormLabels(_formLabels);
		customData = _customData;
		onPaymentSuccess = _onPaymentSuccess;
		onPaymentFailure = _onPaymentFailure;

		//1) bind to iframe events
		$.log("bind to iframe events")
		$.log("iframe: " + $(iframeSelector).length);


		//$(iframeSelector)[0].contentWindow.addEventListener("message", onIframeMessage, false);
		window.addEventListener("message", onIframeMessage, false);

		//2) init server and get payment types in return, which are passed to the iframe if it asks for
		//getPaymentTypes();
	}

	function getPaymentTypes() {
		$.log("************* call getPaymentTypes");
		var req = {};

		$.ajax({
			url: jartClassPath,
			method: 'POST',
			dataType: "json",
			data: {cmd: "getPaymentMethods", data: JSON.stringify(req)},
			success: function(resp) {

				$.log("xxx paymenttypes:");
				$.log(resp);

				//pass payment types down to iframe
				var message = {
					type: "initPaymentTypes",
					paymentTypes: resp,
					formLabels: formLabels
				};
				$(iframeSelector)[0].contentWindow.postMessage(message, '*');

			},
			error: function(eOb) {
				$.log("ERR");
				$.log(eOb);
			}
		});
	}

	function startPayment() {
		var data = {
			typeId: typeId,
			paymentMethod: paymentMethod,
			server: location.protocol + "//" + location.host,
			lang: lang,
			customData: customData
		};

		$.ajax({
			url: jartClassPath,
			method: 'POST',
			dataType: "json",
			data: {cmd: "startPayment", data: JSON.stringify(data)},
			success: function(resp) {

				if (resp.isSuccess == "true") {
					onPaymentSuccess();
				} else if (resp.isError == "true") {
					onPaymentFailure();
				} else if (resp.isPending == "true") {
					doRedirect(resp.redirectUrl);
				}


			},
			error: function(eOb) {
				$.log("ERR");
				$.log(eOb);
			}
		});
	}


	return {
		init: init,
		startPayment: startPayment   //just for testing
	}

}();

$.extend($ajapp.order, {

	upload: function(opt, files) {

		var settings = {
			name: "file",
			path: ""
		};

		$.extend(settings, opt, {
			postUrl: this.appCall + "?cmd=runUpload&j-multipart=yes&path="
		});

		if (!settings.on) {
			$.log("At least an on handler musst be defined in settings!");
			return;
		}

		var me = this;

		for (var i = 0; i < files.length; i++) {
			fileHandler(files[i], i);
		}

		function fileHandler(file, num) {
			var fileReader = new FileReader();

			fileReader.onabort = function(e) {
				if (settings.onClientAbort) {
					settings.onClientAbort.apply(me, [e, file, num]);
				} else {
					settings.on.apply(me, ['onClientAbort', e, file, num]);
				}
			};

			fileReader.onerror = function(e) {
				if (settings.onClientError) {
					settings.onClientError.apply(me, [e, file, num]);
				} else {
					settings.on.apply(me, ['onClientError', e, file, num]);
				}
			};

			fileReader.onload = function(e) {
				if (settings.onClientLoad) {
					settings.onClientLoad.apply(me, [e, file, num]);
				} else {
					settings.on.apply(me, ['onClientLoad', e, file, num]);
				}
			};

			fileReader.onloadend = function(e) {
				if (settings.onClientLoadEnd) {
					settings.onClientLoadEnd.apply(me, [e, file, num]);
				} else {
					settings.on.apply(me, ['onClientLoadEnd', e, file, num]);
				}
			};

			fileReader.onloadstart = function(e) {
				if (settings.onClientLoadStart) {
					settings.onClientLoadStart.apply(me, [e, file, num]);
				} else {
					settings.on.apply(me, ['onClientLoadStart', e, file, num]);
				}
			};

			fileReader.onprogress = function(e) {
				if (settings.onClientProgress) {
					settings.onClientProgress.apply(me, [e, file, num]);
				} else {
					settings.on.apply(me, ['onClientProgress', e, file, num]);
				}
			};

			fileReader.readAsDataURL(file);

			var xmlHttpRequest = new XMLHttpRequest();

			xmlHttpRequest.upload.onabort = function(e) {
				if (settings.onServerAbort) {
					settings.onServerAbort.apply(me, [e, file, num]);
				} else {
					settings.on.apply(me, ['onServerAbort', e, file, num]);
				}
			};

			xmlHttpRequest.upload.onerror = function(e) {
				if (settings.onServerError) {
					settings.onServerError.apply(me, [e, file, num]);
				} else {
					settings.on.apply(me, ['onServerError', e, file, num]);
				}
			};

			xmlHttpRequest.upload.onload = function(e) {
				if (settings.onServerLoad) {
					settings.onServerLoad.apply(me, [e, file, num]);
				} else {
					settings.on.apply(me, ['onServerLoad', e, file, num]);
				}
			};

			xmlHttpRequest.upload.onloadstart = function(e) {
				if (settings.onServerLoadStart) {
					settings.onServerLoadStart.apply(me, [e, file, num]);
				} else {
					settings.on.apply(me, ['onServerLoadStart', e, file, num]);
				}
			};

			xmlHttpRequest.upload.onprogress = function(e) {
				if (settings.onServerProgress) {
					settings.onServerProgress.apply(me, [e, file, num]);
				} else {
					settings.on.apply(me, ['onServerProgress', e, file, num]);
				}
			};

			xmlHttpRequest.onreadystatechange = function(e) {
				if (settings.onServerReadyStateChange) {
					settings.onServerReadyStateChange.apply(me, [e, file, num, xmlHttpRequest.readyState]);
				} else {
					settings.on.apply(me, ['onServerReadyStateChange', e, file, num, xmlHttpRequest.readyState]);
				}
				if (xmlHttpRequest.readyState == 4 && xmlHttpRequest.status == 200) {
					if (settings.onSuccess) {
						settings.onSuccess.apply(me, [e, file, num, xmlHttpRequest.responseText]);
					} else {
						settings.on.apply(me, ['onSuccess', e, file, num, xmlHttpRequest.responseText]);
					}
				}
			};

			xmlHttpRequest.open("POST", settings.postUrl + settings.path, true);

			if (file.getAsBinary) {
				var data = "Content-Disposition: form-data;" + "name=\"" + settings.name + "\";" + "filename=\"" + unescape(encodeURIComponent(file.name)) + "\"" + crlf + "Content-Type: application/octet-stream" + crlf + crlf + file.getAsBinary() + crlf;
				xmlHttpRequest.setRequestHeader("Content-Type", "multipart/form-data");
				xmlHttpRequest.sendAsBinary(data);
			} else if (window.FormData) {
				var formData = new FormData();
				formData.append(settings.name, file);
				xmlHttpRequest.send(formData);
			}
		}

		return settings;
	}

});


$.extend($ajapp.order, {
	logMissingLang: false,

	wk: {},

	init: function() {
		this.defPar = $.queryToObject();
		this.formLoadTemplate("order", function() {
			if (this.defPar.lp) {
				this.formLoadTemplate("/prj3/jart_ticket/app/landingpage/" + this.defPar.lp, function() {
					this.isReady = true;
				});
			} else {
				this.isReady = true;
			}
		}, true);


		if (window.location !== window.parent.location) {
			$.log("APP is loaded in iframe");
			/*
			app is loaded in iframe.
			this happens when
			  1) paying with paypal
			  2) cancelling the payment
			  3) then the iframe itself is redirected (from paypal) to the order-app
			  4) hence the order app is loaded in an iframe

			  if this happens, we just reload the parent
			*/
			parent.location = window.location;


		} else {
			$.log("APP is loaded in own window");
		}

		//this.isReady = true;
	},

	start: function() {
		this.send("getSettings", "setSettings", {});
	},

	setSettings: function(data) {
		this.opt = {};
		this.ball = data.ball ? data.ball[0] : {};
		this.each(data.einstellung, function(i, v) {
			this.opt[v.keyname] = v;
		});
		if (this.defPar.lp) {
			this.draw("Landingpage", {land: 1289565446079}, "#mkard");
		} else if (this.defPar.ordertan) {
			$(".master-content").html("loading order ...");
			this.send("openOrderByTan", this.defPar);
		} else if (this.defPar.lbt) {
			this.send("loadOrderByTan", this.defPar);
		} else {
			this.setSettingsB(data);
		}
		$(".ck0").each(function() {
			if (!$(this).val()) $(this).val(0);
		});
	},

	loadOrderByTanOK: function(data) {
		if (data.bestellung_id) {
			$(".myhome").data("data", data.bestellung_id);
			this.setSettingsB();
		} else {
			alert(this.lang("Ihre Bestellung konnte nicht geöffnet werden!"));
		}

	},

	wkUpdated: function(data) {

	},

	setSettingsB: function() {
		var bid = $(".myhome").data("data");
		if (bid) {
			this.send("loadWK", {bestellung_id: bid});
		} else {
			this.showNewOrder();
		}
		this.loadAjapp("/jart/prj3/jart_ticket/app/plan/plan.jartc", {
			drawTo: ".tischwahlcont",
			curlang: this.curlang,
			onRaumDraw: function(rel) {
				$ajapp.order.setAddSitz();
				$(".tischNextButton").text($ajapp.order.lang("Weiter"));
				$("[name=goRoom] option").first().text($ajapp.order.lang("Gesamtplan"));
				this.each($ajapp.order.wk.bestellung_sitzplatz, function(i, v) {
					var tel = $(".T_" + v.tisch_id);
					//$.log(tel);
					var isSet = false;
					$(".siztzEl", tel).each(function() {
						var el = $(this);
						if (!el.hasClass("seatOwned") && !isSet) {
							el.data("bestellung_sitzplatz_id", v.bestellung_sitzplatz_id);
							el.addClass("seatOwned");
							isSet = true;
							//$.log($ajapp.order.wk)
							//$ajapp.order.wk.sitze.push({bestellung_sitzplatz_id: v.bestellung_sitzplatz_id, tisch_name: v.tisch_name, raum_name: v.raum_name, preis: v.preis});
							$ajapp.order.setAddSitz();
						}

					});
					$ajapp.order.checkTabsSettings($(".tischNextButton"));
				});
			},
			runAddSitzToWk: function(el, sMode, tisch_id, cb) {
				if (sMode) return;
				$ajapp.order.runAddSitzToWk(el, sMode, tisch_id, cb);
			},
			runRemoveSitzFromWk: function(el, sMode, bestellung_sitzplatz_id, cb) {
				if (sMode) return;
				$ajapp.order.runRemoveSitzFromWk(el, sMode, bestellung_sitzplatz_id, cb);
			},
			runNextBtn: function() {
				$ajapp.order.goNextTab();
			}
		});
	},

	setLoadedWK: function(data) {
		$.log(data);
		this.loadingWK = true;
		this.wk = data;
		if (!this.wk.versand_id) this.wk.versand_id = this.ball.versand ? this.ball.versand[0].versand_id : '';
		if (!this.wk.land) this.wk.land = 1289565446079;
		this.wk.karten_anz = 0;
		this.wk.sitze_anz_set = 0;
		this.wk.sitze_anz = 0;
		this.wk.karten = [];
		this.wk.sitze = [];
		data.extendkarten = [];
		var ckt = {};
		this.each(data.bestellung_karte, function(i, v) {
			if (!v.online && v.karten_tags && !ckt[v.karten_typ_id]) {
				ckt[v.karten_typ_id] = true;
				data.extendkarten.push(v);
			}
		});

		this.draw("extendKarten", data, ".extendkarten");

		this.each(data.bestellung_karte, function(i, v) {
			var val = $("[name=" + v.karten_typ_id + "]").val();
			val = val ? parseInt(val) + 1 : 1;
			$("[name=" + v.karten_typ_id + "]").val(val);
			this.wk.karten_anz++;
		});
		this.each(data.bestellung_sitzplatz, function(i, v) {
			this.wk.sitze_anz++;
			this.wk.sitze_anz_set++;
			this.wk.sitze.push(v);
		});

		$("[name=sitze]").val(this.wk.sitze_anz);
		this.loadingWK = false;

		$("#TAB_anz").removeClass("disabled");
		if ($("#TAB_siztzanz").length > 0) {
			$("#TAB_siztzanz").removeClass("disabled");
			$(".kartenNext").removeClass("nextBtn");
			$(".kartenNext").prop("disabled", false);
		}
		this.send("refreshWKView", {bestellung_id: this.wk.bestellung_id});
		$("#TAB_wkov").removeClass("disabled");
		$(".startButton").html(this.lang("Ticketbestellung fortsetzen"));
		$(".startButtonN").removeClass("d-none");
		$(".myhome").removeClass("d-none");

		this.checkTabsSettings();
		$(".startButton").click();
	},

	showNewOrder: function() {
		this.wk = {ball_id: this.ball.ball_id, sitze_anz: 0, sitze_anz_set: 0, sitze: [], karten_anz: 0, karten: [], rla: 'ja', versand_id: this.ball.versand ? this.ball.versand[0].versand_id : '', land: 1289565446079};
		this.kartenAnzahlChanged();
		$(".myhome").removeClass("d-none");
		if (localStorage.newMode) {
			delete localStorage.newMode;
			$(".startButton").click();
		}
		this.upddateWKView({});
	},

	curBatch: 0,

	runAddSitzToWk: function(el, sMode, tisch_id, cb) {
		this.anzSitzeChange = this.wk.sitze_anz - this.wk.sitze_anz_set;
		if (this.wk.sitze_anz > this.wk.sitze_anz_set) {
			this.wk.sitze_anz_set++;
			var CBUid = "CB_" + $.uid();
			this[CBUid] = function(data) {
				if (data.nid) {
					this.wk.sitze.push({bestellung_sitzplatz_id: data.nid, tisch_name: data.tisch_name, raum_name: data.raum_name});
					cb(data.nid);
				} else {
					this.wk.sitze_anz_set--;
				}
				this.checkSitzeNextBtn();
				this.curBatch--;
				if (this.curBatch == 0) {
					this.send("refreshWKView", {bestellung_id: this.wk.bestellung_id});
				}
				delete this[CBUid];
			};
			this.curBatch++;
			this.send("addSitz", CBUid, {tisch_id: tisch_id, bestellung_id: this.wk.bestellung_id});
		}
	},

	setAddSitz: function(o) {
		var sanz = 0;
		var spreis = 0;
		this.each(this.wk.sitze, function(i, v) {
			sanz++;
			//spreis += parseFloat(v.preis);
		});
		$(".swahldisplay").text(sanz + " " + this.lang("Sitze  von") + " " + this.wk.sitze_anz + " " + this.lang("ausgewählt"));
	},

	runRemoveSitzFromWk: function(el, sMode, bestellung_sitzplatz_id, cb) {
		var CBUid = "CB_" + $.uid();
		this[CBUid] = function(data) {
			this.wk.sitze_anz_set--;
			var nsitze = [];
			for (var i = 0; i < this.wk.sitze.length; i++) {
				if (this.wk.sitze[i].bestellung_sitzplatz_id != bestellung_sitzplatz_id) {
					nsitze.push(this.wk.sitze[i]);
				}
			}
			this.wk.sitze = nsitze;
			cb();
			this.checkSitzeNextBtn();
			this.curBatch--;
			if (this.curBatch == 0) {
				this.send("refreshWKView", {bestellung_id: this.wk.bestellung_id});
			}
			delete this[CBUid];
		};
		this.curBatch++;
		this.send("removeSitz", CBUid, {bestellung_sitzplatz_id: bestellung_sitzplatz_id, bestellung_id: this.wk.bestellung_id});
	},

	checkSitzeNextBtn: function() {
		this.setAddSitz();
		this.checkTabsSettings($(".tischNextButton"));
	},

	kartenSitzeChanged: function(el, data) {
		if (this.loadingWK) return;
		this.wk.sitze_anz = data;
		this.wk.sitze_anz_set = 0;
		this.wk.sitze = [];
		this.send("removeAllSitze", {bestellung_id: this.wk.bestellung_id});
		$(".seatOwned").removeClass("seatOwned").addClass("seatFree");
		$ajapp.order.setAddSitz();
		this.checkTabsSettings($(".nextBtn"));
	},

	kartenAnzahlChanged: function(el, data) {
		$(".landingButton").each(function() {
			var anz = 0;
			$(".karteninput").each(function() {
				//$.log(this);
				var v = $(this).val();
				if (v && v > 0) {
					v = parseInt(v);
					anz += v;
				}
			});
			$(this).prop("disabled", anz == 0);
		});
		if (!this.wk.bestellung_id) return;
		if (this.loadingWK) return;
		var karten = [];
		var anz = 0;
		$(".karteninput").each(function() {
			//$.log(this);
			var v = $(this).val();
			if (v && v > 0) {
				v = parseInt(v);
				anz += v;
				var o = $.extend({}, $(this).data());
				delete o.run;
				for (var i = 0; i < v; i++) karten.push(o);
			}
		});
		//$.log(karten);
		this.wk.karten_anz = anz;
		this.wk.karten = karten;
		this.checkTabsSettings($(".nextBtn"));
		this.send("setKarten", this.wk);
	},

	upddateWKView: function(data) {
		if ($("#TAB_persdaten").hasClass("disabled")) data.disablePerData = true;
		if (this.wk.sitze_anz > 0 && this.wk.sitze_anz != this.wk.sitze_anz_set) data.setSeats = true;
		this.draw("wkOverview", data, "#wkov");
		if ($(".master-content > .nav-tabs > li > a.active").attr("id") == "TAB_persdaten") this.goNextTab();
	},

	checkTabsSettings: function(btn) {
		if (this.wk.sitze_anz > 0) {
			$(".seatNextBtn").text(this.lang("Weiter"));
		} else {
			$(".seatNextBtn").text(this.lang("WEITER OHNE SITZPLATZKARTEN"));
		}
		if ((this.wk.karten_anz > 0 || this.wk.sitze_anz > 0) && this.wk.sitze_anz == this.wk.sitze_anz_set) {
			$("#TAB_persdaten").removeClass("disabled");
			$("#TAB_zusatz").removeClass("disabled");
		} else {
			$("#TAB_persdaten").addClass("disabled");
			$("#TAB_zusatz").addClass("disabled");
		}
		if (this.wk.sitze_anz > 0) {
			$("#TAB_tischwahl").removeClass("disabled");
		} else {
			$("#TAB_tischwahl").addClass("disabled");
		}

		if (!btn && (this.wk.karten_anz > 0 || this.wk.sitze_anz > 0)) {
			$.log("xxx");
			$(".nextBtn").prop("disabled", false);
		}

		if (btn) {
			if (this.getNextActiveTab()) {
				btn.prop("disabled", false);
			} else {
				btn.prop("disabled", true);
			}
		}
		$.log(this.wk);
		this.draw("PersonalForm", this.wk, "#persdaten");
		$('[type="checkbox"]').each(function() {
			if ($ajapp.order.wk[$(this).attr("name")]) $(this).prop("checked", true);
		});

		if (this.opt.versandNurStrandard) $(".versandRow").hide();

		if (this.wk.karten_anz > 0) $(".landingButton").prop("disabled", false); else $(".landingButton").prop("disabled", true);

		//$.log(this.wk);
	},

	saveLandingPageData: function(el, data) {
		this.savedata = data;
		this.savedata.files = [];
		$(".upload").each(function() {
			$ajapp.order.runUploads($(this)[0].files);
		});
		if ($(".upload").length == 0) {
			this.saveLandingPageData2();
		}
	},

	saveLandingPageData2: function() {
		this.savedata.ball_id = this.ball.ball_id;
		var karten = [];
		var anz = 0;
		$(".karteninput").each(function() {
			//$.log(this);
			var v = $(this).val();
			if (v && v > 0) {
				v = parseInt(v);
				anz += v;
				var o = $.extend({}, $(this).data());
				delete o.run;
				for (var i = 0; i < v; i++) karten.push(o);
			}
		});
		//$.log(karten);
		this.wk.karten_anz = anz;
		this.wk.karten = karten;
		this.savedata.karten = this.wk.karten;
		this.savedata.lp = this.defPar.lp;
		this.send("saveLandingPage", this.savedata);
	},

	runUploads: function(f) {
		if (!f || f.length === 0) return;
		$ajapp.order.ulen = f.length;

		this.upload({
			path: '/prj3/jart_ticket/data/useruploads/tmp',

			on: function(what, e, file, num, data) {
				if ((" onClientLoadStart onServerReadyStateChange onServerLoad onServerLoadStart onClientLoad onClientLoadEnd onClientProgress ").indexOf(" " + what + " ") == -1) {
					$.log(what + " ::: " + num + " ::: " + file.name);
					$.log(e);
				}
			},

			onServerProgress: function(e, file, num) {
			},

			onSuccess: function(e, file, num, data) {
				$ajapp.order.ulen--;
				var ret = JSON.parse(data);
				$ajapp.order.each(ret["multipart-file"], function(i, v) {
					this.savedata.files.push({filename: v.value});
					if ($ajapp.order.ulen == 0) {
						$ajapp.order.saveLandingPageData2();
					}
				});

			}

		}, f);
	},

	goNextTab: function(el) {
		var t = this.getNextActiveTab();
		if (t) {
			$("#" + t).click();
			setTimeout(function() {
				$(window).scrollTop(0);
			});
		}
	},

	activateSelling: function() {
		this.send("createWK", this.wk);
	},

	activateSellingNew: function() {
		this.send("resetWK", "reloadPage", {});
	},

	reloadPage: function() {
		localStorage.newMode = "true";
		document.location.href = "order.jartc";
		//setTimeout(function(){document.location.reload();}, 10);
	},

	setBestellungWK: function(data) {
		if (!data.bestellung_id) return;
		$("#TAB_wkov").removeClass("disabled");
		$("#TAB_zusatz").removeClass("disabled");
		$(".startButton").html(this.lang("Ticketbestellung fortsetzen"));
		$(".startButtonN").removeClass("d-none");
		this.wk.bestellung_id = data.bestellung_id;
		$("#TAB_anz").removeClass("disabled");
		if ($("#TAB_siztzanz").length > 0) {
			$("#TAB_siztzanz").removeClass("disabled");
			$(".kartenNext").removeClass("nextBtn");
			$(".kartenNext").prop("disabled", false);
		}
		//$.log(data);
		//this.upddateWKView(data);
		this.goNextTab();
	},

	activateSitz: function() {
		$("#TAB_anz").removeClass("disabled");
		this.goNextTab();
	},

	goBackTab: function(el, data) {
		var ct = null;
		$(".master-content > .nav-tabs > li > a").each(function() {
			if (!$(this).hasClass("disabled")) {
				if ($(this).hasClass("active")) {
					ct.click();
					return;
				}
				ct = $(this);
			}
		});
	},


	getNextActiveTab: function() {
		var nextTabTg = '';
		var passedActive = false;

		$(".master-content > .nav-tabs > li > a").each(function() {
			if (!$(this).hasClass("disabled")) {
				if ($(this).hasClass("active")) {
					passedActive = true;
				} else {
					if (passedActive && !nextTabTg) {
						nextTabTg = $(this).attr("id");
					}
				}
			}
		});
		return nextTabTg;
	},


	setPersonalData: function(el, data) {
		if (data.reAdresse) {
			this.each(data.reAdresse[0], function(i, v) {
				data["re_" + i] = v;
			});
		}
		data.ball_id = this.ball.ball_id;
		data.bestellung_id = this.wk.bestellung_id;
		//$.log(data);
		$.extend(this.wk, data);
		this.send("setPersonalData", data);
	},

	createOrder: function(el, data) {
		this.send("createOrder", this.wk);
	},

	orderCreated: function(data) {
		$.log(data);
		this.draw("orderOverview", data, $(".master-content"));
		this.draw("paymentStart", data, $(".master-content"), "append");
	},

	setRla: function(el, data) {
		if (data) {
			this.formDelRepeater($(".REPEATER-reAdresse .repeateritem"))
		} else {
			this.formAddRepeater($(".REPEATER-reAdresse"));
		}
	}

});

//_agbText
Handlebars.registerHelper('_agbText', function(tname, _ob, map) {
	return new Handlebars.SafeString('<a href="' + $ajapp.order.opt.AGB_pdf.keyvalue + '" target="_blank">' + $ajapp.order.lang("agb_akzeptiert") + '</a>');
});


$ajapp.order.appname = 'order';
$ajapp.order.absPath = '/prj3/jart_ticket/app';
