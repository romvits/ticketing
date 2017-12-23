if (typeof define === "undefined") {
	var WEB_SOCKET_DEBUG = true;
	var WEB_SOCKET_SWF_LOCATION = "js/libs/websocket/WebSocketMain.swf";
	var WEB_SOCKET_FORCE_FLASH = false;
	var WEB_SOCKET_LOGGER = false;
	var THEME = "basic";
} else {
	define({
		rm : {
			theme : THEME,
			Debug : false,
			DebugSchritt : 0,
			SysCodeVA : "Id0178249e81238d7c1a1d082cfd2680dbc512c20160912182049",
			sitzplaetze : {
				"er" : "green",
				"ve" : "red",
				"bl" : "orange",
				"wa" : "cyan"
			},
			WSS : {
				WEB_SOCKET_DEBUG : window.WEB_SOCKET_DEBUG,
				WEB_SOCKET_SWF_LOCATION : window.WEB_SOCKET_SWF_LOCATION,
				WEB_SOCKET_FORCE_FLASH : window.WEB_SOCKET_FORCE_FLASH,
				protocol : "wss://",
				url : "wss.ballcomplete.at/www/",
				port : ""
			},
			mpay : {
				disabled : {
					sofort : false
				}
			}
		}
	});
}
