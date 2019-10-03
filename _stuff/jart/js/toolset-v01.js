function getClassName(obj) {
	if (typeof obj != "object" || obj === null) return false;
	try{
		return /(\w+)\(/.exec(obj.constructor.toString())[1];
	} catch(e) {
		return null;
	}
}

function copyTextToClipboard(text) {
    var textArea = document.createElement("textarea");
    textArea.style.position = 'fixed';
    textArea.style.top = 0;
    textArea.style.left = 0;
    textArea.style.width = '2em';
    textArea.style.height = '2em';
    textArea.style.padding = 0;
    textArea.style.border = 'none';
    textArea.style.outline = 'none';
    textArea.style.boxShadow = 'none';
    textArea.style.background = 'transparent';
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.select();
    try {
    var successful = document.execCommand('copy');
    } catch (err) {}
    document.body.removeChild(textArea);
}

(function($){

    $.h = function(node, appendTo, _sprop, _prop, sublist, data){
        var prop = $.initVal(_prop, {});
        var sprop = $.initVal(_sprop, "");
        var o = null;
        if(data){
            o = (data ? $.xmlAttToProperty(data) : null);
            var spa = sprop.split(", ");
            for(var x = 0; x < spa.length; x++){
                if(spa[x]){
                    var s = spa[x].split("=");
                    if(o){
                        prop[s[0]] = s[1].template(o);
                    } else {
                        prop[s[0]] = s[1];
                    }
                }
            }
        }
        if(prop.init_before) prop.init_before(o, data);
        var ret = $("<" + node + ">", prop).appendTo(appendTo);
        if(prop.init_base) prop.init_base(ret, o, data);
        if(sublist && sublist.length > 0){
            for(var i = 0; i < sublist.length; i++){
                var d = sublist[i];
                if(d[0].indexOf("$") === 0){
                    if(data){
                        $(d[0].substr(1), data).each(function(){
                            $.h(d[1], ret, $.initVal(d[2], null), $.initVal(d[3], null), $.initVal(d[4], null), this);
                        });
                    }
                } else {
                    $.h(d[0], ret, $.initVal(d[1], null), $.initVal(d[2], null), $.initVal(d[3], null), data);
                }
            }
        }
        if(prop.init) prop.init(ret, o, data);
        ret.data("ob", o);
        ret.data("xob", data)
        return ret;
    };

    $.initVal = function(v, d){
        return (v ? v : d);
    };

	$.objectToXml = function(dat, _el, dataName, _xml){
        var xml = _xml ? _xml : $.createXMLDom("<" + dataName + "/>");
        var el = _el ? _el : xml.documentElement;
		var cname = getClassName(dat);
		if(cname == "Array"){
			for(var i = 0; i < dat.length; i++){
				var nel = xml.createElement(dataName);
				$.objectToXml(dat[i], nel, dataName, xml);
				el.appendChild(nel);
			}
		} else if(cname == "Object"){
            for(var i in dat){
				$.objectToXml(dat[i], el, i, xml);
			}
		}	else {
			var nel = xml.createElement(dataName);
			var txt = xml.createTextNode("" + dat);
			nel.appendChild(txt);
			el.appendChild(nel);
		}
		return xml;
	};

	$.styleUiButtons = function(s, imgMode){
		if(!imgMode) $(s).addClass("ui-button ui-widget ui-state-default ui-corner-all ui-button-text-only");
		else $(s).addClass("ui-button ui-widget ui-state-default ui-corner-all");
		$(s).hover(
			function(){ $(this).addClass("ui-state-hover"); },
			function(){ $(this).removeClass("ui-state-hover");}
		)
	};

	$.extendScriptToObject = function(o, s){
		var toEv = "var tmp = {" + s + "}";
		eval(toEv);
		var ret = $.extend(o, tmp);
		return ret;
	};

	$.createXMLDom = function(xmlString){
		var doc;
		if (window.ActiveXObject) {
            doc = new ActiveXObject("Microsoft.XMLDOM")
            doc.async="false"
            doc.loadXML(xmlString)
        } else if(document.implementation.createDocument){
            var parser = new DOMParser()
            doc = parser.parseFromString(xmlString, "text/xml");
        }

		/*if(document.implementation.createDocument) {
		    $.log("fmode");
            var parser = new DOMParser()
            doc = parser.parseFromString(xmlString, "text/xml");
        // MSIE
        } else if (window.ActiveXObject) {
            $.log("axmode");
            doc = new ActiveXObject("Microsoft.XMLDOM")
            doc.async="false"
            doc.loadXML(xmlString)
        }*/
        return doc;
	};

	$.log = function(message) {
		//$('#logdiv').html('<div>' + message + '</div>' + $('#logdiv').html());
	  if(window.console) {
	  	if(console.log) {
	  		console.log(message);
	  		return;
	  	}
	  	if(console.debug) {
	  		console.debug(message);
	  		return;
	  	}
	  	if(console.info) {
	  		console.info(message);
	  		return;
	  	}
	  } else {
	     //alert(message);
	  }
	};

	$.isDef = function(v){
		return (!(typeof(v) == 'undefined'))
	};

    $.xSelect = function(xdata, cb, dbcon){
        var url = "/jart/prj3/jart-tools/js-apps/db-admin/bin/select.jart?db-con=" + (dbcon ? dbcon : $.app.dbcon.dbcon + ".qcon");
        $.ajax({
            processData: false,
            contentType: "text/xml",
            url: url,
            dataType: "xml",
            type: "POST",
            data: xdata,
            success: cb
        });
    },


	$.jartXMLFile = {
		postURL: "bin/save-xml.jart?file=",
		save: function(xdata, _fn, cb){
			var fn = _fn;
            if(fn.indexOf("/jart/") === 0){
                fn = fn.substr(5);
            }
			$.ajax({
				processData: false,
				contentType: "text/xml",
				url: this.postURL + fn,
				dataType: "xml",
				type: "POST",
				data: xdata,
				success: cb
			});
		},
		/*open: function(fn, cb, cb2){
			var f = "bin/load-xml.jart?file=" + fn;
			//var f = fn.indexOf("?") > -1 ? fn + "&dummy=" + $.uid() : fn + "?dummy=" + $.uid();
			//if(f.substr(0,1) == "/") f = "/jart" + f;
			$.log(f);
			$.ajax({
				//url: f,
				url: f,
				dataType: "xml",
				type: "GET",
				success: cb,
				error: cb2,
			});*/
		open: function(fn, cb, cb2){
			var f = fn.indexOf("?") > -1 ? fn + "&dummy=" + $.uid() : fn + "?dummy=" + $.uid();
			if(f.substr(0,1) == "/") f = "/jart" + f;
			$.ajax({
				url: f,
				dataType: "xml",
				type: "GET",
				success: cb,
				error: cb2
			});
		}
	};

	$.jartJSonFile = {
		postURL: "bin/save-json.jart",
		save: function(obj, _fn, cb){
            var fn = _fn;
            if(fn.indexOf("/jart/") === 0){
                fn = fn.substr(5);
            }
			var data = [{name: "data", value: JSON.stringify(obj)}, {name: "file", value: fn}];
			$.ajax({
				url: this.postURL,
				dataType: "xml",
				type: "POST",
				data: data,
				success: cb
			});
		},
		open: function(fn, cb, ce, synced){
		    var async = true;
		    if(synced) async = false;
			var f = fn.indexOf("?") > -1 ? fn + "&dummy=" + $.uid() : fn + "?dummy=" + $.uid();
			if(f.substr(0,1) == "/") f = "/jart" + f;
			$.ajax({
				url: f,
				async: async,
				dataType: "json",
				type: "GET",
				success: cb,
				error: ce
			});
		}
	};


	$.uid = function(_len){
        var ret = "";
        var len = _len ? _len : 2;
        for(var i = 0; i < len; i++){
            ret += (ret ? "X" : "R") + (((1+Math.random())*0x10000000)|0).toString(16).substring(1);
        }
        return ret;
	};

	$.xmlAttToProperty = function(o1, o2) {
        if(!o1.attributes) return null;
		var ret = o2;
		if(!ret) ret = new Object();
		for(var i = 0; i <  o1.attributes.length; i++){
			var newName = o1.attributes[i].name.split("-").join("_");
			ret[newName] = o1.attributes[i].value;
		}
        //ret["_text"] = $(o1).text();
		return ret;
	};

    $.x2o = $.xmlAttToProperty;

	String.prototype.template = function (o) {
		return this.replace(/{([^{}]*)}/g,
	  function (a, b) {
	  		var r = o[b];
	    	return typeof r === 'string' || typeof r === 'number' ? r : a;
	    }
	  );
	};


	/*
	String.prototype.replaceMultiple = function (f, to) {
		var ret = this;
		for(var i = 0; i < f.length; i++){
			var t = "";
			if(to && to[0]){
				t = to[i] ? to[i] : to[0];
			}
			ret = ret.replace(RegExp(f[i], "g"), t);
		}
		return ret;
	};

	Array.prototype.each = function (fnc) {
		for(var i = 0; i < this.length; i++){
			fnc(this[i], i);
		}
	};

    Array.prototype.filter = function (fnc) {
        var ret = [];
    	for(var i = 0; i < this.length; i++){
			if(fnc(this[i])){
    		    ret.push(this[i]);
			}
		}
        return ret;
	};
	*/

	$.queryToObject = function(n){
		var ret = {};
		var b = window.location.href.split("?");
		if(b.length > 1){
			var p = b[1].split("&");
			for(var i = 0; i < p.length; i++){
				var c = p[i].split("=");
				ret[c[0]] = c[1];
			}
		}
		return ret;
	};

    $.cookie = function(name, value, options) {
    if (typeof value != 'undefined') { // name and value given, set cookie
        options = options || {};
        if (value === null) {
            value = '';
            options.expires = -1;
        }
        var expires = '';
        if (options.expires && (typeof options.expires == 'number' || options.expires.toUTCString)) {
            var date;
            if (typeof options.expires == 'number') {
                date = new Date();
                date.setTime(date.getTime() + (options.expires * 24 * 60 * 60 * 1000));
            } else {
                date = options.expires;
            }
            expires = '; expires=' + date.toUTCString(); // use expires attribute, max-age is not supported by IE
        }
        // CAUTION: Needed to parenthesize options.path and options.domain
        // in the following expressions, otherwise they evaluate to undefined
        // in the packed version for some reason...
        var path = options.path ? '; path=' + (options.path) : '';
        var domain = options.domain ? '; domain=' + (options.domain) : '';
        var secure = options.secure ? '; secure' : '';
        document.cookie = [name, '=', encodeURIComponent(value), expires, path, domain, secure].join('');
    } else { // only name given, get cookie
        var cookieValue = null;
        if (document.cookie && document.cookie != '') {
            var cookies = document.cookie.split(';');
            for (var i = 0; i < cookies.length; i++) {
                var cookie = jQuery.trim(cookies[i]);
                // Does this cookie string begin with the name we want?
                if (cookie.substring(0, name.length + 1) == (name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    }
    };



})(jQuery);
