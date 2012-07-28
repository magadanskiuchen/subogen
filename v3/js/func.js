jQuery(function ($) {
	var player = new Player($('#player'));
	
	var loadVideoButton = $('#load-video');
	var loadSubtitlesButton = $('#load-subtitles');
	
	var setStartButton = $('#set-start');
	var setStopButton = $('#set-stop');
	var setStopStartButton = $('#set-stop-start');
	
	var saveToYouTubeButton = $('#save-to-youtube');
	var loadVideoFromYouTubeButton = $('#load-video-from-youtube');
	
	var changeFontButton = $('#change-font');
	var helpButton = $('#help');
	
	loadVideoButton.change(function(e) {
		if (typeof(e.currentTarget.files) != 'undefined') {
			player.load(e.currentTarget.files[0]);
		}
	});	
	
	loadSubtitlesButton.change(function(e) {
		// loadSubs(e.currentTarget.files[0]);
	});
});

// class to handle the player functionality
function Player(p) {
	var that = this;
	
	this.load = function (file) {
		if (p[0].canPlayType(file.type)) {
			p[0].src = createObjectURL(file);
		}
	}
}

// shiv for window.URL.createObjectURL
function createObjectURL(file) {
	var output = '';
	
	if (window.URL) {
		output = window.URL.createObjectURL(file);
	} else if (window.webkitURL) {
		output = window.webkitURL.createObjectURL(file);
	} else if (window.mozURL) {
		output = window.mozURL.createObjectURL(file);
	}
	
	return output;
}