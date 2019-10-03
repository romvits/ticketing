'use strict';
if (!window.$ajapp) window.$ajapp = {};

/*AUTO GENERATED over gen-cc-file.js
 DO NOT EDIT!*/
/******************************************************************************************/
/*** import /cls/main/_res/handlebarExtensions.js ***/
/******************************************************************************************/

Handlebars.registerHelper('l_plan', function(str) {
	return $ajapp.plan.lang(str);
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

Handlebars.registerHelper('_compile_plan', function(tname, _ob, map) {
	var ob = _ob;
	if (typeof ob === "string" && ob === "{null}") {
		ob = {};
	}
	if (tname && ob) {
		if (typeof map === "string" && map) {
			ob = $ajapp.plan.run(map, ob);
		}
		return new Handlebars.SafeString($ajapp.plan.compileElement(tname, ob));
	}
	return '';
});


Handlebars.registerHelper('_template_plan', function(tname, _ob, map, prefix) {
	var ob = _ob;
	if (typeof ob === "string" && ob === "{null}") {
		ob = {};
	}
	if (tname && ob) {
		if (typeof map === "string" && map) {
			ob = $ajapp.plan.run(map, ob);
		}
		if (typeof prefix === "string" && prefix) {
			tname = prefix + "." + tname;
		}
		var runner = $ajapp.plan.template[tname];
		if (!runner) {
			$.log("MISSIN TEMPLATE " + tname, 0, 1);
			return "";
		}
		return new Handlebars.SafeString(runner(ob));
	}
	return '';
});


Handlebars.registerHelper('_run_plan', function(cmd) {
	//var args = Array.prototype.splice.call(arguments, 1);
	var ret = $ajapp.plan.run.apply($ajapp.plan, arguments);
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

Handlebars.registerHelper('_img_src_plan', function(img) {
	var path = "";
	if ($ajapp.plan.isPhoneGap) {
		path = "TODO: set local imapge path here for phone";
	} else {
		path = $ajapp.plan.srvImgPath;
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
    if($ajapp.plan.enableLog) console.log(msg);
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

$ajapp.plan = {
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
			var rt = $ajapp.planRouting.routing[rpath.join("/")];
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
			$ajapp.planRouting.goRouting(_r, data, el);
		} else {
			document.location.hash = _r;
		}
	},

	setRouting: function() {
		if (!$ajapp.planRouting) {

			$ajapp.planRouting = {
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
				$ajapp.planRouting.goRouting("" + document.location.hash.substr(1));
			};
		}

		for (var n in this.routing) {
			$ajapp.planRouting.routing[this.appname + n] = this.routing[n];
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
		this.appCall = this.localPath + "/" + this.appname + ".jart";
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
				$ajapp.planRouting.goRouting("" + document.location.hash.substr(1));
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
		this.req(cmd, d, function(result, rText) {
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
			$ajapp.plan.serializeObject($(this), data);
		});
		$(">.repeater", el).each(function() {
			var dn = $(this).data("dataname");
			var ndata = [];
			data[dn] = ndata;
			$(">.repeateritem", $(this)).each(function() {
				var nnd = {};
				$ajapp.plan.serializeObject($(this), nnd);
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
			var ret = $ajapp.plan.lang(m1);
			if (m1 == ret) {
				return null;
			}
			return ret;
		},

		getMessageValue: function(nname, nob, fname, params) {
			if (params.message) return $ajapp.plan.lang(params.message);
			var msg = this.isMsgChanged(nname + "." + nob + "." + fname);
			if (msg === null) msg = this.isMsgChanged(nname + "." + fname);
			if (msg === null) msg = this.isMsgChanged(nname + "." + nob);
			if (msg === null) msg = this.isMsgChanged(nname);
			if (msg === null && window.jvalidation_messages) msg = window.jvalidation_messages[nname];
			if (!msg) msg = $ajapp.plan.lang("please provide a valid value for this field");
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
						$ajapp.plan.serializeObject(el, data);
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
				if ($ajapp.plan.isPhoneGap && cur.tap) {
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


/*AUTO GENERATED over gen-cc-file.js
 DO NOT EDIT!*/
/******************************************************************************************/
/*** import /prj3/jart_ticket/resources/jquery/panzoom-master/dist/panzoom.min.js ***/
/******************************************************************************************/
(function(f) {
	if (typeof exports === "object" && typeof module !== "undefined") {
		module.exports = f()
	} else if (typeof define === "function" && define.amd) {
		define([], f)
	} else {
		var g;
		if (typeof window !== "undefined") {
			g = window
		} else if (typeof global !== "undefined") {
			g = global
		} else if (typeof self !== "undefined") {
			g = self
		} else {
			g = this
		}
		g.panzoom = f()
	}
})(function() {
	var define, module, exports;
	return function() {
		function r(e, n, t) {
			function o(i, f) {
				if (!n[i]) {
					if (!e[i]) {
						var c = "function" == typeof require && require;
						if (!f && c) return c(i, !0);
						if (u) return u(i, !0);
						var a = new Error("Cannot find module '" + i + "'");
						throw a.code = "MODULE_NOT_FOUND", a
					}
					var p = n[i] = {exports: {}};
					e[i][0].call(p.exports, function(r) {
						var n = e[i][1][r];
						return o(n || r)
					}, p, p.exports, r, e, n, t)
				}
				return n[i].exports
			}

			for (var u = "function" == typeof require && require, i = 0; i < t.length; i++) o(t[i]);
			return o
		}

		return r
	}()({
		1: [function(require, module, exports) {
			"use strict";
			var wheel = require("wheel");
			var animate = require("amator");
			var eventify = require("ngraph.events");
			var kinetic = require("./lib/kinetic.js");
			var preventTextSelection = require("./lib/textSelectionInterceptor.js")();
			var Transform = require("./lib/transform.js");
			var makeSvgController = require("./lib/svgController.js");
			var makeDomController = require("./lib/domController.js");
			var defaultZoomSpeed = .065;
			var defaultDoubleTapZoomSpeed = 1.75;
			var doubleTapSpeedInMS = 300;
			module.exports = createPanZoom;

			function createPanZoom(domElement, options) {
				options = options || {};
				var panController = options.controller;
				if (!panController) {
					if (domElement instanceof SVGElement) {
						panController = makeSvgController(domElement, options)
					}
					if (domElement instanceof HTMLElement) {
						panController = makeDomController(domElement, options)
					}
				}
				if (!panController) {
					throw new Error("Cannot create panzoom for the current type of dom element")
				}
				var owner = panController.getOwner();
				var storedCTMResult = {x: 0, y: 0};
				var isDirty = false;
				var transform = new Transform;
				if (panController.initTransform) {
					panController.initTransform(transform)
				}
				var filterKey = typeof options.filterKey === "function" ? options.filterKey : noop;
				var pinchSpeed = typeof options.pinchSpeed === "number" ? options.pinchSpeed : 1;
				var bounds = options.bounds;
				var maxZoom = typeof options.maxZoom === "number" ? options.maxZoom : Number.POSITIVE_INFINITY;
				var minZoom = typeof options.minZoom === "number" ? options.minZoom : 0;
				var boundsPadding = typeof options.boundsPadding === "number" ? options.boundsPadding : .05;
				var zoomDoubleClickSpeed = typeof options.zoomDoubleClickSpeed === "number" ? options.zoomDoubleClickSpeed : defaultDoubleTapZoomSpeed;
				var beforeWheel = options.beforeWheel || noop;
				var speed = typeof options.zoomSpeed === "number" ? options.zoomSpeed : defaultZoomSpeed;
				validateBounds(bounds);
				if (options.autocenter) {
					autocenter()
				}
				var frameAnimation;
				var lastTouchEndTime = 0;
				var touchInProgress = false;
				var panstartFired = false;
				var mouseX;
				var mouseY;
				var pinchZoomLength;
				var smoothScroll;
				if ("smoothScroll" in options && !options.smoothScroll) {
					smoothScroll = rigidScroll()
				} else {
					smoothScroll = kinetic(getPoint, scroll, options.smoothScroll)
				}
				var moveByAnimation;
				var zoomToAnimation;
				var multiTouch;
				var paused = false;
				listenForEvents();
				var api = {dispose: dispose, moveBy: internalMoveBy, moveTo: moveTo, centerOn: centerOn, zoomTo: publicZoomTo, zoomAbs: zoomAbs, smoothZoom: smoothZoom, showRectangle: showRectangle, pause: pause, resume: resume, isPaused: isPaused, getTransform: getTransformModel, getMinZoom: getMinZoom, getMaxZoom: getMaxZoom};
				eventify(api);
				return api;

				function pause() {
					releaseEvents();
					paused = true
				}

				function resume() {
					if (paused) {
						listenForEvents();
						paused = false
					}
				}

				function isPaused() {
					return paused
				}

				function showRectangle(rect) {
					var clientRect = owner.getBoundingClientRect();
					var size = transformToScreen(clientRect.width, clientRect.height);
					var rectWidth = rect.right - rect.left;
					var rectHeight = rect.bottom - rect.top;
					if (!Number.isFinite(rectWidth) || !Number.isFinite(rectHeight)) {
						throw new Error("Invalid rectangle")
					}
					var dw = size.x / rectWidth;
					var dh = size.y / rectHeight;
					var scale = Math.min(dw, dh);
					transform.x = -(rect.left + rectWidth / 2) * scale + size.x / 2;
					transform.y = -(rect.top + rectHeight / 2) * scale + size.y / 2;
					transform.scale = scale
				}

				function transformToScreen(x, y) {
					if (panController.getScreenCTM) {
						var parentCTM = panController.getScreenCTM();
						var parentScaleX = parentCTM.a;
						var parentScaleY = parentCTM.d;
						var parentOffsetX = parentCTM.e;
						var parentOffsetY = parentCTM.f;
						storedCTMResult.x = x * parentScaleX - parentOffsetX;
						storedCTMResult.y = y * parentScaleY - parentOffsetY
					} else {
						storedCTMResult.x = x;
						storedCTMResult.y = y
					}
					return storedCTMResult
				}

				function autocenter() {
					var w;
					var h;
					var left = 0;
					var top = 0;
					var sceneBoundingBox = getBoundingBox();
					if (sceneBoundingBox) {
						left = sceneBoundingBox.left;
						top = sceneBoundingBox.top;
						w = sceneBoundingBox.right - sceneBoundingBox.left;
						h = sceneBoundingBox.bottom - sceneBoundingBox.top
					} else {
						var ownerRect = owner.getBoundingClientRect();
						w = ownerRect.width;
						h = ownerRect.height
					}
					var bbox = panController.getBBox();
					if (bbox.width === 0 || bbox.height === 0) {
						return
					}
					var dh = h / bbox.height;
					var dw = w / bbox.width;
					var scale = Math.min(dw, dh);
					transform.x = -(bbox.left + bbox.width / 2) * scale + w / 2 + left;
					transform.y = -(bbox.top + bbox.height / 2) * scale + h / 2 + top;
					transform.scale = scale
				}

				function getTransformModel() {
					return transform
				}

				function getMinZoom() {
					return minZoom
				}

				function getMaxZoom() {
					return maxZoom
				}

				function getPoint() {
					return {x: transform.x, y: transform.y}
				}

				function moveTo(x, y) {
					transform.x = x;
					transform.y = y;
					keepTransformInsideBounds();
					triggerEvent("pan");
					makeDirty()
				}

				function moveBy(dx, dy) {
					moveTo(transform.x + dx, transform.y + dy)
				}

				function keepTransformInsideBounds() {
					var boundingBox = getBoundingBox();
					if (!boundingBox) return;
					var adjusted = false;
					var clientRect = getClientRect();
					var diff = boundingBox.left - clientRect.right;
					if (diff > 0) {
						transform.x += diff;
						adjusted = true
					}
					diff = boundingBox.right - clientRect.left;
					if (diff < 0) {
						transform.x += diff;
						adjusted = true
					}
					diff = boundingBox.top - clientRect.bottom;
					if (diff > 0) {
						transform.y += diff;
						adjusted = true
					}
					diff = boundingBox.bottom - clientRect.top;
					if (diff < 0) {
						transform.y += diff;
						adjusted = true
					}
					return adjusted
				}

				function getBoundingBox() {
					if (!bounds) return;
					if (typeof bounds === "boolean") {
						var ownerRect = owner.getBoundingClientRect();
						var sceneWidth = ownerRect.width;
						var sceneHeight = ownerRect.height;
						return {left: sceneWidth * boundsPadding, top: sceneHeight * boundsPadding, right: sceneWidth * (1 - boundsPadding), bottom: sceneHeight * (1 - boundsPadding)}
					}
					return bounds
				}

				function getClientRect() {
					var bbox = panController.getBBox();
					var leftTop = client(bbox.left, bbox.top);
					return {left: leftTop.x, top: leftTop.y, right: bbox.width * transform.scale + leftTop.x, bottom: bbox.height * transform.scale + leftTop.y}
				}

				function client(x, y) {
					return {x: x * transform.scale + transform.x, y: y * transform.scale + transform.y}
				}

				function makeDirty() {
					isDirty = true;
					frameAnimation = window.requestAnimationFrame(frame)
				}

				function zoomByRatio(clientX, clientY, ratio) {
					if (isNaN(clientX) || isNaN(clientY) || isNaN(ratio)) {
						throw new Error("zoom requires valid numbers")
					}
					var newScale = transform.scale * ratio;
					if (newScale < minZoom) {
						if (transform.scale === minZoom) return;
						ratio = minZoom / transform.scale
					}
					if (newScale > maxZoom) {
						if (transform.scale === maxZoom) return;
						ratio = maxZoom / transform.scale
					}
					var size = transformToScreen(clientX, clientY);
					transform.x = size.x - ratio * (size.x - transform.x);
					transform.y = size.y - ratio * (size.y - transform.y);
					if (bounds && boundsPadding === 1 && minZoom == 1) {
						transform.scale *= ratio;
						keepTransformInsideBounds()
					} else {
						var transformAdjusted = keepTransformInsideBounds();
						if (!transformAdjusted) transform.scale *= ratio
					}
					triggerEvent("zoom");
					makeDirty()
				}

				function zoomAbs(clientX, clientY, zoomLevel) {
					var ratio = zoomLevel / transform.scale;
					zoomByRatio(clientX, clientY, ratio)
				}

				function centerOn(ui) {
					var parent = ui.ownerSVGElement;
					if (!parent) throw new Error("ui element is required to be within the scene");
					var clientRect = ui.getBoundingClientRect();
					var cx = clientRect.left + clientRect.width / 2;
					var cy = clientRect.top + clientRect.height / 2;
					var container = parent.getBoundingClientRect();
					var dx = container.width / 2 - cx;
					var dy = container.height / 2 - cy;
					internalMoveBy(dx, dy, true)
				}

				function internalMoveBy(dx, dy, smooth) {
					if (!smooth) {
						return moveBy(dx, dy)
					}
					if (moveByAnimation) moveByAnimation.cancel();
					var from = {x: 0, y: 0};
					var to = {x: dx, y: dy};
					var lastX = 0;
					var lastY = 0;
					moveByAnimation = animate(from, to, {
						step: function(v) {
							moveBy(v.x - lastX, v.y - lastY);
							lastX = v.x;
							lastY = v.y
						}
					})
				}

				function scroll(x, y) {
					cancelZoomAnimation();
					moveTo(x, y)
				}

				function dispose() {
					releaseEvents()
				}

				function listenForEvents() {
					owner.addEventListener("mousedown", onMouseDown);
					owner.addEventListener("dblclick", onDoubleClick);
					owner.addEventListener("touchstart", onTouch);
					owner.addEventListener("keydown", onKeyDown);
					wheel.addWheelListener(owner, onMouseWheel);
					makeDirty()
				}

				function releaseEvents() {
					wheel.removeWheelListener(owner, onMouseWheel);
					owner.removeEventListener("mousedown", onMouseDown);
					owner.removeEventListener("keydown", onKeyDown);
					owner.removeEventListener("dblclick", onDoubleClick);
					owner.removeEventListener("touchstart", onTouch);
					if (frameAnimation) {
						window.cancelAnimationFrame(frameAnimation);
						frameAnimation = 0
					}
					smoothScroll.cancel();
					releaseDocumentMouse();
					releaseTouches();
					triggerPanEnd()
				}

				function frame() {
					if (isDirty) applyTransform()
				}

				function applyTransform() {
					isDirty = false;
					panController.applyTransform(transform);
					triggerEvent("transform");
					frameAnimation = 0
				}

				function onKeyDown(e) {
					var x = 0, y = 0, z = 0;
					if (e.keyCode === 38) {
						y = 1
					} else if (e.keyCode === 40) {
						y = -1
					} else if (e.keyCode === 37) {
						x = 1
					} else if (e.keyCode === 39) {
						x = -1
					} else if (e.keyCode === 189 || e.keyCode === 109) {
						z = 1
					} else if (e.keyCode === 187 || e.keyCode === 107) {
						z = -1
					}
					if (filterKey(e, x, y, z)) {
						return
					}
					if (x || y) {
						e.preventDefault();
						e.stopPropagation();
						var clientRect = owner.getBoundingClientRect();
						var offset = Math.min(clientRect.width, clientRect.height);
						var moveSpeedRatio = .05;
						var dx = offset * moveSpeedRatio * x;
						var dy = offset * moveSpeedRatio * y;
						internalMoveBy(dx, dy)
					}
					if (z) {
						var scaleMultiplier = getScaleMultiplier(z);
						var ownerRect = owner.getBoundingClientRect();
						publicZoomTo(ownerRect.width / 2, ownerRect.height / 2, scaleMultiplier)
					}
				}

				function onTouch(e) {
					beforeTouch(e);
					if (e.touches.length === 1) {
						return handleSingleFingerTouch(e, e.touches[0])
					} else if (e.touches.length === 2) {
						pinchZoomLength = getPinchZoomLength(e.touches[0], e.touches[1]);
						multiTouch = true;
						startTouchListenerIfNeeded()
					}
				}

				function beforeTouch(e) {
					if (options.onTouch && !options.onTouch(e)) {
						return
					}
					e.stopPropagation();
					e.preventDefault()
				}

				function beforeDoubleClick(e) {
					if (options.onDoubleClick && !options.onDoubleClick(e)) {
						return
					}
					e.preventDefault();
					e.stopPropagation()
				}

				function handleSingleFingerTouch(e) {
					var touch = e.touches[0];
					var offset = getOffsetXY(touch);
					mouseX = offset.x;
					mouseY = offset.y;
					smoothScroll.cancel();
					startTouchListenerIfNeeded()
				}

				function startTouchListenerIfNeeded() {
					if (!touchInProgress) {
						touchInProgress = true;
						document.addEventListener("touchmove", handleTouchMove);
						document.addEventListener("touchend", handleTouchEnd);
						document.addEventListener("touchcancel", handleTouchEnd)
					}
				}

				function handleTouchMove(e) {
					if (e.touches.length === 1) {
						e.stopPropagation();
						var touch = e.touches[0];
						var offset = getOffsetXY(touch);
						var dx = offset.x - mouseX;
						var dy = offset.y - mouseY;
						if (dx !== 0 && dy !== 0) {
							triggerPanStart()
						}
						mouseX = offset.x;
						mouseY = offset.y;
						var point = transformToScreen(dx, dy);
						internalMoveBy(point.x, point.y)
					} else if (e.touches.length === 2) {
						multiTouch = true;
						var t1 = e.touches[0];
						var t2 = e.touches[1];
						var currentPinchLength = getPinchZoomLength(t1, t2);
						var scaleMultiplier = 1 + (currentPinchLength / pinchZoomLength - 1) * pinchSpeed;
						mouseX = (t1.clientX + t2.clientX) / 2;
						mouseY = (t1.clientY + t2.clientY) / 2;
						publicZoomTo(mouseX, mouseY, scaleMultiplier);
						pinchZoomLength = currentPinchLength;
						e.stopPropagation();
						e.preventDefault()
					}
				}

				function handleTouchEnd(e) {
					if (e.touches.length > 0) {
						var offset = getOffsetXY(e.touches[0]);
						mouseX = offset.x;
						mouseY = offset.y
					} else {
						var now = new Date;
						if (now - lastTouchEndTime < doubleTapSpeedInMS) {
							smoothZoom(mouseX, mouseY, zoomDoubleClickSpeed)
						}
						lastTouchEndTime = now;
						touchInProgress = false;
						triggerPanEnd();
						releaseTouches()
					}
				}

				function getPinchZoomLength(finger1, finger2) {
					var dx = finger1.clientX - finger2.clientX;
					var dy = finger1.clientY - finger2.clientY;
					return Math.sqrt(dx * dx + dy * dy)
				}

				function onDoubleClick(e) {
					beforeDoubleClick(e);
					var offset = getOffsetXY(e);
					smoothZoom(offset.x, offset.y, zoomDoubleClickSpeed)
				}

				function onMouseDown(e) {
					if (touchInProgress) {
						e.stopPropagation();
						return false
					}
					var isLeftButton = e.button === 1 && window.event !== null || e.button === 0;
					if (!isLeftButton) return;
					smoothScroll.cancel();
					var offset = getOffsetXY(e);
					var point = transformToScreen(offset.x, offset.y);
					mouseX = point.x;
					mouseY = point.y;
					document.addEventListener("mousemove", onMouseMove);
					document.addEventListener("mouseup", onMouseUp);
					preventTextSelection.capture(e.target || e.srcElement);
					return false
				}

				function onMouseMove(e) {
					if (touchInProgress) return;
					triggerPanStart();
					var offset = getOffsetXY(e);
					var point = transformToScreen(offset.x, offset.y);
					var dx = point.x - mouseX;
					var dy = point.y - mouseY;
					mouseX = point.x;
					mouseY = point.y;
					internalMoveBy(dx, dy)
				}

				function onMouseUp() {
					preventTextSelection.release();
					triggerPanEnd();
					releaseDocumentMouse()
				}

				function releaseDocumentMouse() {
					document.removeEventListener("mousemove", onMouseMove);
					document.removeEventListener("mouseup", onMouseUp);
					panstartFired = false
				}

				function releaseTouches() {
					document.removeEventListener("touchmove", handleTouchMove);
					document.removeEventListener("touchend", handleTouchEnd);
					document.removeEventListener("touchcancel", handleTouchEnd);
					panstartFired = false;
					multiTouch = false
				}

				function onMouseWheel(e) {
					if (beforeWheel(e)) return;
					smoothScroll.cancel();
					var scaleMultiplier = getScaleMultiplier(e.deltaY);
					if (scaleMultiplier !== 1) {
						var offset = getOffsetXY(e);
						publicZoomTo(offset.x, offset.y, scaleMultiplier);
						e.preventDefault()
					}
				}

				function getOffsetXY(e) {
					var offsetX, offsetY;
					var ownerRect = owner.getBoundingClientRect();
					offsetX = e.clientX - ownerRect.left;
					offsetY = e.clientY - ownerRect.top;
					return {x: offsetX, y: offsetY}
				}

				function smoothZoom(clientX, clientY, scaleMultiplier) {
					var fromValue = transform.scale;
					var from = {scale: fromValue};
					var to = {scale: scaleMultiplier * fromValue};
					smoothScroll.cancel();
					cancelZoomAnimation();
					zoomToAnimation = animate(from, to, {
						step: function(v) {
							zoomAbs(clientX, clientY, v.scale)
						}
					})
				}

				function publicZoomTo(clientX, clientY, scaleMultiplier) {
					smoothScroll.cancel();
					cancelZoomAnimation();
					return zoomByRatio(clientX, clientY, scaleMultiplier)
				}

				function cancelZoomAnimation() {
					if (zoomToAnimation) {
						zoomToAnimation.cancel();
						zoomToAnimation = null
					}
				}

				function getScaleMultiplier(delta) {
					var scaleMultiplier = 1;
					if (delta > 0) {
						scaleMultiplier = 1 - speed
					} else if (delta < 0) {
						scaleMultiplier = 1 + speed
					}
					return scaleMultiplier
				}

				function triggerPanStart() {
					if (!panstartFired) {
						triggerEvent("panstart");
						panstartFired = true;
						smoothScroll.start()
					}
				}

				function triggerPanEnd() {
					if (panstartFired) {
						if (!multiTouch) smoothScroll.stop();
						triggerEvent("panend")
					}
				}

				function triggerEvent(name) {
					api.fire(name, api)
				}
			}

			function noop() {
			}

			function validateBounds(bounds) {
				var boundsType = typeof bounds;
				if (boundsType === "undefined" || boundsType === "boolean") return;
				var validBounds = isNumber(bounds.left) && isNumber(bounds.top) && isNumber(bounds.bottom) && isNumber(bounds.right);
				if (!validBounds) throw new Error("Bounds object is not valid. It can be: " + "undefined, boolean (true|false) or an object {left, top, right, bottom}")
			}

			function isNumber(x) {
				return Number.isFinite(x)
			}

			function isNaN(value) {
				if (Number.isNaN) {
					return Number.isNaN(value)
				}
				return value !== value
			}

			function rigidScroll() {
				return {start: noop, stop: noop, cancel: noop}
			}

			function autoRun() {
				if (typeof document === "undefined") return;
				var scripts = document.getElementsByTagName("script");
				if (!scripts) return;
				var panzoomScript;
				for (var i = 0; i < scripts.length; ++i) {
					var x = scripts[i];
					if (x.src && x.src.match(/\bpanzoom(\.min)?\.js/)) {
						panzoomScript = x;
						break
					}
				}
				if (!panzoomScript) return;
				var query = panzoomScript.getAttribute("query");
				if (!query) return;
				var globalName = panzoomScript.getAttribute("name") || "pz";
				var started = Date.now();
				tryAttach();

				function tryAttach() {
					var el = document.querySelector(query);
					if (!el) {
						var now = Date.now();
						var elapsed = now - started;
						if (elapsed < 2e3) {
							setTimeout(tryAttach, 100);
							return
						}
						console.error("Cannot find the panzoom element", globalName);
						return
					}
					var options = collectOptions(panzoomScript);
					console.log(options);
					window[globalName] = createPanZoom(el, options)
				}

				function collectOptions(script) {
					var attrs = script.attributes;
					var options = {};
					for (var i = 0; i < attrs.length; ++i) {
						var attr = attrs[i];
						var nameValue = getPanzoomAttributeNameValue(attr);
						if (nameValue) {
							options[nameValue.name] = nameValue.value
						}
					}
					return options
				}

				function getPanzoomAttributeNameValue(attr) {
					if (!attr.name) return;
					var isPanZoomAttribute = attr.name[0] === "p" && attr.name[1] === "z" && attr.name[2] === "-";
					if (!isPanZoomAttribute) return;
					var name = attr.name.substr(3);
					var value = JSON.parse(attr.value);
					return {name: name, value: value}
				}
			}

			autoRun()
		}, {"./lib/domController.js": 2, "./lib/kinetic.js": 3, "./lib/svgController.js": 4, "./lib/textSelectionInterceptor.js": 5, "./lib/transform.js": 6, amator: 7, "ngraph.events": 9, wheel: 10}], 2: [function(require, module, exports) {
			module.exports = makeDomController;

			function makeDomController(domElement, options) {
				var elementValid = domElement instanceof HTMLElement;
				if (!elementValid) {
					throw new Error("svg element is required for svg.panzoom to work")
				}
				var owner = domElement.parentElement;
				if (!owner) {
					throw new Error("Do not apply panzoom to the detached DOM element. ")
				}
				domElement.scrollTop = 0;
				if (!options.disableKeyboardInteraction) {
					owner.setAttribute("tabindex", 0)
				}
				var api = {getBBox: getBBox, getOwner: getOwner, applyTransform: applyTransform};
				return api;

				function getOwner() {
					return owner
				}

				function getBBox() {
					return {left: 0, top: 0, width: domElement.clientWidth, height: domElement.clientHeight}
				}

				function applyTransform(transform) {
					domElement.style.transformOrigin = "0 0 0";
					domElement.style.transform = "matrix(" + transform.scale + ", 0, 0, " + transform.scale + ", " + transform.x + ", " + transform.y + ")"
				}
			}
		}, {}], 3: [function(require, module, exports) {
			module.exports = kinetic;

			function kinetic(getPoint, scroll, settings) {
				if (typeof settings !== "object") {
					settings = {}
				}
				var minVelocity = typeof settings.minVelocity === "number" ? settings.minVelocity : 5;
				var amplitude = typeof settings.amplitude === "number" ? settings.amplitude : .25;
				var lastPoint;
				var timestamp;
				var timeConstant = 342;
				var ticker;
				var vx, targetX, ax;
				var vy, targetY, ay;
				var raf;
				return {start: start, stop: stop, cancel: dispose};

				function dispose() {
					window.clearInterval(ticker);
					window.cancelAnimationFrame(raf)
				}

				function start() {
					lastPoint = getPoint();
					ax = ay = vx = vy = 0;
					timestamp = new Date;
					window.clearInterval(ticker);
					window.cancelAnimationFrame(raf);
					ticker = window.setInterval(track, 100)
				}

				function track() {
					var now = Date.now();
					var elapsed = now - timestamp;
					timestamp = now;
					var currentPoint = getPoint();
					var dx = currentPoint.x - lastPoint.x;
					var dy = currentPoint.y - lastPoint.y;
					lastPoint = currentPoint;
					var dt = 1e3 / (1 + elapsed);
					vx = .8 * dx * dt + .2 * vx;
					vy = .8 * dy * dt + .2 * vy
				}

				function stop() {
					window.clearInterval(ticker);
					window.cancelAnimationFrame(raf);
					var currentPoint = getPoint();
					targetX = currentPoint.x;
					targetY = currentPoint.y;
					timestamp = Date.now();
					if (vx < -minVelocity || vx > minVelocity) {
						ax = amplitude * vx;
						targetX += ax
					}
					if (vy < -minVelocity || vy > minVelocity) {
						ay = amplitude * vy;
						targetY += ay
					}
					raf = window.requestAnimationFrame(autoScroll)
				}

				function autoScroll() {
					var elapsed = Date.now() - timestamp;
					var moving = false;
					var dx = 0;
					var dy = 0;
					if (ax) {
						dx = -ax * Math.exp(-elapsed / timeConstant);
						if (dx > .5 || dx < -.5) moving = true; else dx = ax = 0
					}
					if (ay) {
						dy = -ay * Math.exp(-elapsed / timeConstant);
						if (dy > .5 || dy < -.5) moving = true; else dy = ay = 0
					}
					if (moving) {
						scroll(targetX + dx, targetY + dy);
						raf = window.requestAnimationFrame(autoScroll)
					}
				}
			}
		}, {}], 4: [function(require, module, exports) {
			module.exports = makeSvgController;

			function makeSvgController(svgElement, options) {
				var elementValid = svgElement instanceof SVGElement;
				if (!elementValid) {
					throw new Error("svg element is required for svg.panzoom to work")
				}
				var owner = svgElement.ownerSVGElement;
				if (!owner) {
					throw new Error("Do not apply panzoom to the root <svg> element. " + "Use its child instead (e.g. <g></g>). " + "As of March 2016 only FireFox supported transform on the root element")
				}
				if (!options.disableKeyboardInteraction) {
					owner.setAttribute("tabindex", 0)
				}
				var api = {getBBox: getBBox, getScreenCTM: getScreenCTM, getOwner: getOwner, applyTransform: applyTransform, initTransform: initTransform};
				return api;

				function getOwner() {
					return owner
				}

				function getBBox() {
					var bbox = svgElement.getBBox();
					return {left: bbox.x, top: bbox.y, width: bbox.width, height: bbox.height}
				}

				function getScreenCTM() {
					return owner.getScreenCTM()
				}

				function initTransform(transform) {
					var screenCTM = svgElement.getScreenCTM();
					transform.x = screenCTM.e;
					transform.y = screenCTM.f;
					transform.scale = screenCTM.a;
					owner.removeAttributeNS(null, "viewBox")
				}

				function applyTransform(transform) {
					svgElement.setAttribute("transform", "matrix(" + transform.scale + " 0 0 " + transform.scale + " " + transform.x + " " + transform.y + ")")
				}
			}
		}, {}], 5: [function(require, module, exports) {
			module.exports = createTextSelectionInterceptor;

			function createTextSelectionInterceptor() {
				var dragObject;
				var prevSelectStart;
				var prevDragStart;
				return {capture: capture, release: release};

				function capture(domObject) {
					prevSelectStart = window.document.onselectstart;
					prevDragStart = window.document.ondragstart;
					window.document.onselectstart = disabled;
					dragObject = domObject;
					dragObject.ondragstart = disabled
				}

				function release() {
					window.document.onselectstart = prevSelectStart;
					if (dragObject) dragObject.ondragstart = prevDragStart
				}
			}

			function disabled(e) {
				e.stopPropagation();
				return false
			}
		}, {}], 6: [function(require, module, exports) {
			module.exports = Transform;

			function Transform() {
				this.x = 0;
				this.y = 0;
				this.scale = 1
			}
		}, {}], 7: [function(require, module, exports) {
			var BezierEasing = require("bezier-easing");
			var animations = {ease: BezierEasing(.25, .1, .25, 1), easeIn: BezierEasing(.42, 0, 1, 1), easeOut: BezierEasing(0, 0, .58, 1), easeInOut: BezierEasing(.42, 0, .58, 1), linear: BezierEasing(0, 0, 1, 1)};
			module.exports = animate;
			module.exports.makeAggregateRaf = makeAggregateRaf;
			module.exports.sharedScheduler = makeAggregateRaf();

			function animate(source, target, options) {
				var start = Object.create(null);
				var diff = Object.create(null);
				options = options || {};
				var easing = typeof options.easing === "function" ? options.easing : animations[options.easing];
				if (!easing) {
					if (options.easing) {
						console.warn("Unknown easing function in amator: " + options.easing)
					}
					easing = animations.ease
				}
				var step = typeof options.step === "function" ? options.step : noop;
				var done = typeof options.done === "function" ? options.done : noop;
				var scheduler = getScheduler(options.scheduler);
				var keys = Object.keys(target);
				keys.forEach(function(key) {
					start[key] = source[key];
					diff[key] = target[key] - source[key]
				});
				var durationInMs = typeof options.duration === "number" ? options.duration : 400;
				var durationInFrames = Math.max(1, durationInMs * .06);
				var previousAnimationId;
				var frame = 0;
				previousAnimationId = scheduler.next(loop);
				return {cancel: cancel};

				function cancel() {
					scheduler.cancel(previousAnimationId);
					previousAnimationId = 0
				}

				function loop() {
					var t = easing(frame / durationInFrames);
					frame += 1;
					setValues(t);
					if (frame <= durationInFrames) {
						previousAnimationId = scheduler.next(loop);
						step(source)
					} else {
						previousAnimationId = 0;
						setTimeout(function() {
							done(source)
						}, 0)
					}
				}

				function setValues(t) {
					keys.forEach(function(key) {
						source[key] = diff[key] * t + start[key]
					})
				}
			}

			function noop() {
			}

			function getScheduler(scheduler) {
				if (!scheduler) {
					var canRaf = typeof window !== "undefined" && window.requestAnimationFrame;
					return canRaf ? rafScheduler() : timeoutScheduler()
				}
				if (typeof scheduler.next !== "function") throw new Error("Scheduler is supposed to have next(cb) function");
				if (typeof scheduler.cancel !== "function") throw new Error("Scheduler is supposed to have cancel(handle) function");
				return scheduler
			}

			function rafScheduler() {
				return {next: window.requestAnimationFrame.bind(window), cancel: window.cancelAnimationFrame.bind(window)}
			}

			function timeoutScheduler() {
				return {
					next: function(cb) {
						return setTimeout(cb, 1e3 / 60)
					}, cancel: function(id) {
						return clearTimeout(id)
					}
				}
			}

			function makeAggregateRaf() {
				var frontBuffer = new Set;
				var backBuffer = new Set;
				var frameToken = 0;
				return {next: next, cancel: next, clearAll: clearAll};

				function clearAll() {
					frontBuffer.clear();
					backBuffer.clear();
					cancelAnimationFrame(frameToken);
					frameToken = 0
				}

				function next(callback) {
					backBuffer.add(callback);
					renderNextFrame()
				}

				function renderNextFrame() {
					if (!frameToken) frameToken = requestAnimationFrame(renderFrame)
				}

				function renderFrame() {
					frameToken = 0;
					var t = backBuffer;
					backBuffer = frontBuffer;
					frontBuffer = t;
					frontBuffer.forEach(function(callback) {
						callback()
					});
					frontBuffer.clear()
				}

				function cancel(callback) {
					backBuffer.delete(callback)
				}
			}
		}, {"bezier-easing": 8}], 8: [function(require, module, exports) {
			var NEWTON_ITERATIONS = 4;
			var NEWTON_MIN_SLOPE = .001;
			var SUBDIVISION_PRECISION = 1e-7;
			var SUBDIVISION_MAX_ITERATIONS = 10;
			var kSplineTableSize = 11;
			var kSampleStepSize = 1 / (kSplineTableSize - 1);
			var float32ArraySupported = typeof Float32Array === "function";

			function A(aA1, aA2) {
				return 1 - 3 * aA2 + 3 * aA1
			}

			function B(aA1, aA2) {
				return 3 * aA2 - 6 * aA1
			}

			function C(aA1) {
				return 3 * aA1
			}

			function calcBezier(aT, aA1, aA2) {
				return ((A(aA1, aA2) * aT + B(aA1, aA2)) * aT + C(aA1)) * aT
			}

			function getSlope(aT, aA1, aA2) {
				return 3 * A(aA1, aA2) * aT * aT + 2 * B(aA1, aA2) * aT + C(aA1)
			}

			function binarySubdivide(aX, aA, aB, mX1, mX2) {
				var currentX, currentT, i = 0;
				do {
					currentT = aA + (aB - aA) / 2;
					currentX = calcBezier(currentT, mX1, mX2) - aX;
					if (currentX > 0) {
						aB = currentT
					} else {
						aA = currentT
					}
				} while (Math.abs(currentX) > SUBDIVISION_PRECISION && ++i < SUBDIVISION_MAX_ITERATIONS);
				return currentT
			}

			function newtonRaphsonIterate(aX, aGuessT, mX1, mX2) {
				for (var i = 0; i < NEWTON_ITERATIONS; ++i) {
					var currentSlope = getSlope(aGuessT, mX1, mX2);
					if (currentSlope === 0) {
						return aGuessT
					}
					var currentX = calcBezier(aGuessT, mX1, mX2) - aX;
					aGuessT -= currentX / currentSlope
				}
				return aGuessT
			}

			function LinearEasing(x) {
				return x
			}

			module.exports = function bezier(mX1, mY1, mX2, mY2) {
				if (!(0 <= mX1 && mX1 <= 1 && 0 <= mX2 && mX2 <= 1)) {
					throw new Error("bezier x values must be in [0, 1] range")
				}
				if (mX1 === mY1 && mX2 === mY2) {
					return LinearEasing
				}
				var sampleValues = float32ArraySupported ? new Float32Array(kSplineTableSize) : new Array(kSplineTableSize);
				for (var i = 0; i < kSplineTableSize; ++i) {
					sampleValues[i] = calcBezier(i * kSampleStepSize, mX1, mX2)
				}

				function getTForX(aX) {
					var intervalStart = 0;
					var currentSample = 1;
					var lastSample = kSplineTableSize - 1;
					for (; currentSample !== lastSample && sampleValues[currentSample] <= aX; ++currentSample) {
						intervalStart += kSampleStepSize
					}
					--currentSample;
					var dist = (aX - sampleValues[currentSample]) / (sampleValues[currentSample + 1] - sampleValues[currentSample]);
					var guessForT = intervalStart + dist * kSampleStepSize;
					var initialSlope = getSlope(guessForT, mX1, mX2);
					if (initialSlope >= NEWTON_MIN_SLOPE) {
						return newtonRaphsonIterate(aX, guessForT, mX1, mX2)
					} else if (initialSlope === 0) {
						return guessForT
					} else {
						return binarySubdivide(aX, intervalStart, intervalStart + kSampleStepSize, mX1, mX2)
					}
				}

				return function BezierEasing(x) {
					if (x === 0) {
						return 0
					}
					if (x === 1) {
						return 1
					}
					return calcBezier(getTForX(x), mY1, mY2)
				}
			}
		}, {}], 9: [function(require, module, exports) {
			module.exports = function(subject) {
				validateSubject(subject);
				var eventsStorage = createEventsStorage(subject);
				subject.on = eventsStorage.on;
				subject.off = eventsStorage.off;
				subject.fire = eventsStorage.fire;
				return subject
			};

			function createEventsStorage(subject) {
				var registeredEvents = Object.create(null);
				return {
					on: function(eventName, callback, ctx) {
						if (typeof callback !== "function") {
							throw new Error("callback is expected to be a function")
						}
						var handlers = registeredEvents[eventName];
						if (!handlers) {
							handlers = registeredEvents[eventName] = []
						}
						handlers.push({callback: callback, ctx: ctx});
						return subject
					}, off: function(eventName, callback) {
						var wantToRemoveAll = typeof eventName === "undefined";
						if (wantToRemoveAll) {
							registeredEvents = Object.create(null);
							return subject
						}
						if (registeredEvents[eventName]) {
							var deleteAllCallbacksForEvent = typeof callback !== "function";
							if (deleteAllCallbacksForEvent) {
								delete registeredEvents[eventName]
							} else {
								var callbacks = registeredEvents[eventName];
								for (var i = 0; i < callbacks.length; ++i) {
									if (callbacks[i].callback === callback) {
										callbacks.splice(i, 1)
									}
								}
							}
						}
						return subject
					}, fire: function(eventName) {
						var callbacks = registeredEvents[eventName];
						if (!callbacks) {
							return subject
						}
						var fireArguments;
						if (arguments.length > 1) {
							fireArguments = Array.prototype.splice.call(arguments, 1)
						}
						for (var i = 0; i < callbacks.length; ++i) {
							var callbackInfo = callbacks[i];
							callbackInfo.callback.apply(callbackInfo.ctx, fireArguments)
						}
						return subject
					}
				}
			}

			function validateSubject(subject) {
				if (!subject) {
					throw new Error("Eventify cannot use falsy object as events subject")
				}
				var reservedWords = ["on", "fire", "off"];
				for (var i = 0; i < reservedWords.length; ++i) {
					if (subject.hasOwnProperty(reservedWords[i])) {
						throw new Error("Subject cannot be eventified, since it already has property '" + reservedWords[i] + "'")
					}
				}
			}
		}, {}], 10: [function(require, module, exports) {
			module.exports = addWheelListener;
			module.exports.addWheelListener = addWheelListener;
			module.exports.removeWheelListener = removeWheelListener;
			var prefix = "", _addEventListener, _removeEventListener, support;
			detectEventModel(typeof window !== "undefined" && window, typeof document !== "undefined" && document);

			function addWheelListener(elem, callback, useCapture) {
				_addWheelListener(elem, support, callback, useCapture);
				if (support == "DOMMouseScroll") {
					_addWheelListener(elem, "MozMousePixelScroll", callback, useCapture)
				}
			}

			function removeWheelListener(elem, callback, useCapture) {
				_removeWheelListener(elem, support, callback, useCapture);
				if (support == "DOMMouseScroll") {
					_removeWheelListener(elem, "MozMousePixelScroll", callback, useCapture)
				}
			}

			function _addWheelListener(elem, eventName, callback, useCapture) {
				elem[_addEventListener](prefix + eventName, support == "wheel" ? callback : function(originalEvent) {
					!originalEvent && (originalEvent = window.event);
					var event = {
						originalEvent: originalEvent, target: originalEvent.target || originalEvent.srcElement, type: "wheel", deltaMode: originalEvent.type == "MozMousePixelScroll" ? 0 : 1, deltaX: 0, deltaY: 0, deltaZ: 0, clientX: originalEvent.clientX, clientY: originalEvent.clientY, preventDefault: function() {
							originalEvent.preventDefault ? originalEvent.preventDefault() : originalEvent.returnValue = false
						}, stopPropagation: function() {
							if (originalEvent.stopPropagation) originalEvent.stopPropagation()
						}, stopImmediatePropagation: function() {
							if (originalEvent.stopImmediatePropagation) originalEvent.stopImmediatePropagation()
						}
					};
					if (support == "mousewheel") {
						event.deltaY = -1 / 40 * originalEvent.wheelDelta;
						originalEvent.wheelDeltaX && (event.deltaX = -1 / 40 * originalEvent.wheelDeltaX)
					} else {
						event.deltaY = originalEvent.detail
					}
					return callback(event)
				}, useCapture || false)
			}

			function _removeWheelListener(elem, eventName, callback, useCapture) {
				elem[_removeEventListener](prefix + eventName, callback, useCapture || false)
			}

			function detectEventModel(window, document) {
				if (window && window.addEventListener) {
					_addEventListener = "addEventListener";
					_removeEventListener = "removeEventListener"
				} else {
					_addEventListener = "attachEvent";
					_removeEventListener = "detachEvent";
					prefix = "on"
				}
				if (document) {
					support = "onwheel" in document.createElement("div") ? "wheel" : document.onmousewheel !== undefined ? "mousewheel" : "DOMMouseScroll"
				} else {
					support = "wheel"
				}
			}
		}, {}]
	}, {}, [1])(1)
});


$.extend($ajapp.plan, {
	logMissingLang: false,
	tscale: 0.35,


	init: function() {
		/* this.formLoadTemplate("plan", function(){this.isReady = true;}, true); */
		this.isReady = true;
	},

	start: function() {
		this.send("getBaseData", {isAdminMode: (this.isAdminMode ? "ja" : "")});
	},

	addToWk: function(el, data) {
		if (!this.isPan) {
			if (el.hasClass("tischEl")) {
				$(".siztzEl", el).each(function() {
					$ajapp.plan.addSitzToWk($(this));
				});
				this.curMode = "";
			} else if (el.hasClass("siztzEl")) {
				this.addSitzToWk(el, true);
			}
		}
	},

	onRaumDraw: function() {

	},

	nextBtn: function() {
		if (this.runNextBtn) this.runNextBtn();
	},

	addSitzToWk: function(el, sMode) {
		if (!this.runAddSitzToWk) return;
		if (el.hasClass("seatFree")) {
			if (this.curMode && this.curMode != "seatFree") return;
			this.curMode = "seatFree";
			this.runAddSitzToWk(el, sMode, $(el).data("tisch_id"), function(bestellung_sitzplatz_id) {
				el.data("bestellung_sitzplatz_id", bestellung_sitzplatz_id);
				el.removeClass("seatFree");
				el.addClass("seatOwned");
			});
		} else if (el.hasClass("seatOwned")) {
			if (this.curMode && this.curMode != "seatOwned") return;
			this.curMode = "seatOwned";
			this.runRemoveSitzFromWk(el, sMode, $(el).data("bestellung_sitzplatz_id"), function() {
				el.data("bestellung_sitzplatz_id", '');
				el.addClass("seatFree");
				el.removeClass("seatOwned");
			});
		}
	},

	setZoom: function(el, data) {
		var s = data.split(":");
		//$.log(this.pzoomInstance);
		this.pzoomInstance.zoomAbs(parseFloat(s[1]), parseFloat(s[0]), parseFloat(s[2]));
		this.pzoomInstance.moveTo((parseFloat(s[1]) * parseFloat(s[2])) * -1, (parseFloat(s[0]) * parseFloat(s[2])) * -1);

	},

	setBaseData: function(data) {
		//$.log(data);
		this.baseData = data;


		this.each(data.raum, function(i, raum) {
			//$.log(raum);
			var tisch = raum.tisch;

			this.each(tisch, function(i, v) {
				v.svg_width = (parseInt(v.svg_width) * this.tscale);
				v.svg_height = (parseInt(v.svg_height) * this.tscale);
				v.txt_x = (v.svg_width / 2) - 20;
				v.txt_y = (v.svg_height / 2) - 5;
				v.x_pos = parseInt(parseInt(v.x_pos) + 0);
				v.y_pos = parseInt(parseInt(v.y_pos) + 0);
				v.adm = $ajapp.plan.isAdminMode;
				var sp = v.sitzpos.split(",");
				v.sitz = [];
				this.each(sp, function(i, v2) {
					var p = v2.split(":");
					v.sitz.push({x: ((parseInt(p[0]) + 0) * this.tscale) + 1, y: ((parseInt(p[1]) + 0) * this.tscale) + 0, w: 20 * this.tscale, tisch_id: v.tisch_id});
				});
			});
		});

		this.draw("main", data);
		$("[name=goRoom]").val('1:1:0.27');
		var instance = panzoom($(".tozoom")[0], {
			maxZoom: 7,
			minZoom: 0.12
		});

		instance.on('panstart', function(e) {
			$ajapp.plan.isPan = true;
		});

		instance.on('panend', function(e) {
			setTimeout(function() {
				$ajapp.plan.isPan = false
			}, 1);
		});

		instance.on('zoom', function(e) {
			$ajapp.plan.isPan = true;
			var lastPanUid = $.uid();
			$ajapp.plan.lastPanUid = lastPanUid;
			setTimeout(function() {
				if ($ajapp.plan.lastPanUid == lastPanUid) $ajapp.plan.isPan = false;
			}, 150);
		});

		instance.zoomAbs(
			1, // initial x position
			1, // initial y position
			0.27  // initial zoom
		);

		this.pzoomInstance = instance;

		this.send("getSeats", {isAdminMode: (this.isAdminMode ? "ja" : "")});
	},

	setSeats: function(data) {
		this.each(data.tisch, function(n, v) {
			if (v.im_web_als_verkauft_anzeigen == 'ja') v.anz = v.tisch_typ_sessel_anzahl;
			for (var i = 0; i < parseInt(v.tisch_typ_sessel_anzahl); i++) {
				var e = $(".S_" + v.tisch_id + "_" + i);
				if (i < parseInt(v.anz)) {
					if (!e.hasClass("seatOwned")) e.addClass("seatBlocked");
				} else {
					e.addClass("seatFree");
				}
			}
		});
	}

});


$ajapp.plan.appname = 'plan';
$ajapp.plan.absPath = '/prj3/jart_ticket/app/plan';
