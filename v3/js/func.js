document.addEventListener('DOMContentLoaded', function (e) {
	var mu = com.magadanski.utils;
	
	var player = new com.magadanski.Player(document.getElementById('player'));
	var subData = new com.magadanski.SubData();
	
	var loadVideoButton = document.getElementById('load-video');
	var loadSubtitlesButton = document.getElementById('load-subtitles');
	
	var setStartButton = document.getElementById('set-start');
	var setStopButton = document.getElementById('set-stop');
	var setStopStartButton = document.getElementById('set-stop-start');
	
	var saveToYouTubeButton = document.getElementById('save-to-youtube');
	var loadVideoFromYouTubeButton = document.getElementById('load-video-from-youtube');
	
	var changeFontButton = document.getElementById('change-font');
	var helpButton = document.getElementById('help');
	
	loadVideoButton.addEventListener('change', function (e) {
		if (typeof(e.currentTarget.files) != 'undefined') {
			player.load(e.currentTarget.files[0]);
		}
	});
	
	window.addEventListener('drop', function (e) {
		e.preventDefault();
		mu.removeClass(document.body, 'dropTarget');
		
		var file = e.dataTransfer.files[0];
	});
	
	window.addEventListener('dragenter', function (e) {
		mu.addClass(document.body, 'dropTarget');
	});
	
	window.addEventListener('dragleave', function (e) {
		if (!e.pageX) mu.removeClass(document.body, 'dropTarget');
	});
	
	loadSubtitlesButton.addEventListener('change', function (e) {
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
