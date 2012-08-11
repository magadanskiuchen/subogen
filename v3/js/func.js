jQuery(function ($) {
	var player = new com.magadanski.Player(document.getElementById('player'));
	var subData = new com.magadanski.SubData();
	
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
		loadFileContent(e.currentTarget.files[0], function (e, fileContent) {
			subData.loadSubs(fileContent);
		});
	});
});

function loadFileContent(file, callback) {
	var reader = new FileReader(file);
	
	reader.onloadend = function(e) {
		if (typeof(callback) == 'function') {
			callback(e, this.result);
		}
	}
	
	reader.readAsText(file);
}
