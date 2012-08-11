document.addEventListener('DOMContentLoaded', function (e) {
	mu = com.magadanski.utils;
	
	player = new com.magadanski.Player(document.getElementById('player'));
	subData = new com.magadanski.SubData();
	
	loadVideoButton = document.getElementById('load-video');
	loadSubtitlesButton = document.getElementById('load-subtitles');
	
	playerDropTarget = document.getElementById('player-drop-target');
	subDropTarget = document.getElementById('sub-drop-target');
	
	setStartButton = document.getElementById('set-start');
	setStopButton = document.getElementById('set-stop');
	setStopStartButton = document.getElementById('set-stop-start');
	
	saveToYouTubeButton = document.getElementById('save-to-youtube');
	loadVideoFromYouTubeButton = document.getElementById('load-video-from-youtube');
	
	changeFontButton = document.getElementById('change-font');
	helpButton = document.getElementById('help');
	
	window.addEventListener('dragenter', function (e) {
		mu.addClass(document.body, 'dropTarget');
	});
	
	window.addEventListener('dragleave', function (e) {
		if (!e.pageX) mu.removeClass(document.body, 'dropTarget');
	});
	
	window.addEventListener('drop', function (e) {
		e.preventDefault();
		mu.removeClass(document.body, 'dropTarget');
	});
	
	loadVideoButton.addEventListener('change', function (e) {
		if (typeof(e.currentTarget.files) != 'undefined') {
			player.load(e.currentTarget.files[0]);
		}
	});
	
	playerDropTarget.addEventListener('drop', function (e) {
		if (typeof(e.dataTransfer.files) != 'undefined') {
			player.load(e.dataTransfer.files[0]);
		}
	});
	
	loadSubtitlesButton.addEventListener('change', function (e) {
		if (typeof(e.currentTarget.files) != 'undefined') {
			loadFileContent(e.currentTarget.files[0], onSubFileLoaded);
		}
	});
	
	subDropTarget.addEventListener('drop', function (e) {
		if (typeof(e.dataTransfer.files) != 'undefined') {
			loadFileContent(e.dataTransfer.files[0], onSubFileLoaded);
		}
	});
	
	function onSubFileLoaded(e, fileContent) {
		subData.loadSubs(fileContent);
	}
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