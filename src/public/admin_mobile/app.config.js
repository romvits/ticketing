$.root_ = $('body');
$.navAsAjax = false;
$.sound_path = "sound/";
$.sound_on = true;
var root = this,
	 debugState = false,
	 debugStyle = 'font-weight: bold; color: #00f;',
	 debugStyle_green = 'font-weight: bold; font-style:italic; color: #46C246;',
	 debugStyle_red = 'font-weight: bold; color: #ed1c24;',
	 debugStyle_warning = 'background-color:yellow',
	 debugStyle_success = 'background-color:green; font-weight:bold; color:#fff;',
	 debugStyle_error = 'background-color:#ed1c24; font-weight:bold; color:#fff;',
	 throttle_delay = 350,
	 menu_speed = 235,
	 menu_accordion = true,
	 enableJarvisWidgets = true,
	 localStorageJarvisWidgets = true,
	 sortableJarvisWidgets = true,
	 enableMobileWidgets = false,
	 fastClick = false,
	 boxList = [],
	 showList = [],
	 nameList = [],
	 idList = [],
	 chatbox_config = {
		 width: 200,
		 gap: 35
	 },
	 ignore_key_elms = ["#header, #left-panel, #right-panel, #main, div.page-footer, #shortcut, #divSmallBoxes, #divMiniIcons, #divbigBoxes, #voiceModal, script, .ui-chatbox"],
	 voice_command = true,
	 voice_command_auto = false,
	 voice_command_lang = 'en-US',
	 voice_localStorage = true;
if (voice_command) {

	var commands = {

		'show dashboard': function () {
			$('nav a[href="dashboard.html"]').trigger("click");
		},
		'show inbox': function () {
			$('nav a[href="inbox.html"]').trigger("click");
		},
		'show graphs': function () {
			$('nav a[href="flot.html"]').trigger("click");
		},
		'show flotchart': function () {
			$('nav a[href="flot.html"]').trigger("click");
		},
		'show morris chart': function () {
			$('nav a[href="morris.html"]').trigger("click");
		},
		'show inline chart': function () {
			$('nav a[href="inline-charts.html"]').trigger("click");
		},
		'show dygraphs': function () {
			$('nav a[href="dygraphs.html"]').trigger("click");
		},
		'show tables': function () {
			$('nav a[href="table.html"]').trigger("click");
		},
		'show data table': function () {
			$('nav a[href="datatables.html"]').trigger("click");
		},
		'show jquery grid': function () {
			$('nav a[href="jqgrid.html"]').trigger("click");
		},
		'show form': function () {
			$('nav a[href="form-elements.html"]').trigger("click");
		},
		'show form layouts': function () {
			$('nav a[href="form-templates.html"]').trigger("click");
		},
		'show form validation': function () {
			$('nav a[href="validation.html"]').trigger("click");
		},
		'show form elements': function () {
			$('nav a[href="bootstrap-forms.html"]').trigger("click");
		},
		'show form plugins': function () {
			$('nav a[href="plugins.html"]').trigger("click");
		},
		'show form wizards': function () {
			$('nav a[href="wizards.html"]').trigger("click");
		},
		'show bootstrap editor': function () {
			$('nav a[href="other-editors.html"]').trigger("click");
		},
		'show dropzone': function () {
			$('nav a[href="dropzone.html"]').trigger("click");
		},
		'show image cropping': function () {
			$('nav a[href="image-editor.html"]').trigger("click");
		},
		'show general elements': function () {
			$('nav a[href="general-elements.html"]').trigger("click");
		},
		'show buttons': function () {
			$('nav a[href="buttons.html"]').trigger("click");
		},
		'show fontawesome': function () {
			$('nav a[href="fa.html"]').trigger("click");
		},
		'show glyph icons': function () {
			$('nav a[href="glyph.html"]').trigger("click");
		},
		'show flags': function () {
			$('nav a[href="flags.html"]').trigger("click");
		},
		'show grid': function () {
			$('nav a[href="grid.html"]').trigger("click");
		},
		'show tree view': function () {
			$('nav a[href="treeview.html"]').trigger("click");
		},
		'show nestable lists': function () {
			$('nav a[href="nestable-list.html"]').trigger("click");
		},
		'show jquery U I': function () {
			$('nav a[href="jqui.html"]').trigger("click");
		},
		'show typography': function () {
			$('nav a[href="typography.html"]').trigger("click");
		},
		'show calendar': function () {
			$('nav a[href="calendar.html"]').trigger("click");
		},
		'show widgets': function () {
			$('nav a[href="widgets.html"]').trigger("click");
		},
		'show gallery': function () {
			$('nav a[href="gallery.html"]').trigger("click");
		},
		'show maps': function () {
			$('nav a[href="gmap-xml.html"]').trigger("click");
		},
		'show pricing tables': function () {
			$('nav a[href="pricing-table.html"]').trigger("click");
		},
		'show invoice': function () {
			$('nav a[href="invoice.html"]').trigger("click");
		},
		'show search': function () {
			$('nav a[href="search.html"]').trigger("click");
		},
		'go back': function () {
			history.back(1);
		},
		'scroll up': function () {
			$('html, body').animate({scrollTop: 0}, 100);
		},
		'scroll down': function () {
			$('html, body').animate({scrollTop: $(document).height()}, 100);
		},
		'hide navigation': function () {
			if ($.root_.hasClass("container") && !$.root_.hasClass("menu-on-top")) {
				$('span.minifyme').trigger("click");
			} else {
				$('#hide-menu > span > a').trigger("click");
			}
		},
		'show navigation': function () {
			if ($.root_.hasClass("container") && !$.root_.hasClass("menu-on-top")) {
				$('span.minifyme').trigger("click");
			} else {
				$('#hide-menu > span > a').trigger("click");
			}
		},
		'mute': function () {
			$.sound_on = false;
			$.smallBox({
				title: "MUTE",
				content: "All sounds have been muted!",
				color: "#a90329",
				timeout: 4000,
				icon: "fa fa-volume-off"
			});
		},
		'sound on': function () {
			$.sound_on = true;
			$.speechApp.playConfirmation();
			$.smallBox({
				title: "UNMUTE",
				content: "All sounds have been turned on!",
				color: "#40ac2b",
				sound_file: 'voice_alert',
				timeout: 5000,
				icon: "fa fa-volume-up"
			});
		},
		'stop': function () {
			smartSpeechRecognition.abort();
			$.root_.removeClass("voice-command-active");
			$.smallBox({
				title: "VOICE COMMAND OFF",
				content: "Your voice commands has been successfully turned off. Click on the <i class='fa fa-microphone fa-lg fa-fw'></i> icon to turn it back on.",
				color: "#40ac2b",
				sound_file: 'voice_off',
				timeout: 8000,
				icon: "fa fa-microphone-slash"
			});
			if ($('#speech-btn .popover').is(':visible')) {
				$('#speech-btn .popover').fadeOut(250);
			}
		},
		'help': function () {
			$('#voiceModal').removeData('modal').modal({remote: "ajax/modal-content/modal-voicecommand.html", show: true});
			if ($('#speech-btn .popover').is(':visible')) {
				$('#speech-btn .popover').fadeOut(250);
			}
		},
		'got it': function () {
			$('#voiceModal').modal('hide');
		},
		'logout': function () {
			$.speechApp.stop();
			window.location = $('#logout > span > a').attr("href");
		}
	};
}