window.addEventListener('dragenter', function (e) {
	com.magadanski.utils.addClass(document.body, 'dropTarget');
});

window.addEventListener('dragleave', function (e) {
	if (!e.pageX) com.magadanski.utils.removeClass(document.body, 'dropTarget');
});

window.addEventListener('dragover', function (e) {
	e.preventDefault();
});

window.addEventListener('drop', function (e) {
	e.preventDefault();
	com.magadanski.utils.removeClass(document.body, 'dropTarget');
}, true);

document.addEventListener('DOMContentLoaded', function (e) {
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
	if (window.FileReader) {
		var chunkSize = 2097152; // 2MB
		var startByte = 0;
		var endByte = 0;
		var reader = new FileReader(file);
		var fileContent = null;
		var fileSlice = file.slice || file.webkitSlice || file.mozSlice;
		
		function readChunk() {
			endByte = Math.min(startByte + chunkSize, file.size);
			reader.readAsText( fileSlice.call(file, startByte, endByte) );
		}
		
		reader.onloadend = function(e) {
			if (e.target.readyState == FileReader.DONE) {
				fileContent = new Blob([fileContent, e.target.result], { type: 'text/plain; charset=UTF-8', endings: 'native' });
				
				if (endByte < file.size) {
					startByte += chunkSize;
					readChunk();
				} else {
					if (typeof(callback) == 'function') {
						callback(e, this.result);
					}
				}
			}
		}
		
		readChunk();
	} else {
		alert('Your browser does not support HTML5 File System access');
	}
}