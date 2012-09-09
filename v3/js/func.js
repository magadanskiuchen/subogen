com = (typeof(com) != 'undefined') ? com : {};
com.magadanski = (typeof(com.magadanski) != 'undefined') ? com.magadanski : {};

com.magadanski.Subogen = null;

(function () {
	com.magadanski.Subogen = function () {
		this.player = null;
		this.subData = new com.magadanski.SubData();
		this.loadVideoButton = null;
		this.loadSubtitlesButton = null;
		this.playerDropTarget = null;
		this.subDropTarget = null;
		this.setStartButton = null;
		this.setStopButton = null;
		this.setStopStartButton = null;
		this.saveToYouTubeButton = null;
		this.loadVideoFromYouTubeButton = null;
		this.changeFontButton = null;
		this.helpButton = null;
	}
	
	com.magadanski.Subogen.prototype = new com.magadanski.WebApp();
	com.magadanski.Subogen.prototype.constructor = com.magadanski.Subogen;
	com.magadanski.Subogen.prototype.parent = com.magadanski.WebApp.prototype;
	
	com.magadanski.Subogen.prototype.loadSubs = function (file) {
		var that = this;
		
		if (file instanceof File) {
			com.magadanski.utils.loadFileContent(file, function (e, fileContent) {
				e.fileContent = fileContent;
				
				that.dispatchEvent('subsloaded', e);
			});
		} else {
			throw new com.magadanski.exceptions.TypeException('Subogen.loadSubs requires first argument to be File, ' + file.prototype + ' passed.');
		}
	}
})();

subogen = new com.magadanski.Subogen();
subogen.init(function () {
	subogen.addEventListener('subsloaded', function (e) {
		subogen.subData.loadSubs(e.fileContent);
	});
	
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
	
	subogen.player = new com.magadanski.Player(document.getElementById('player'));
	
	subogen.loadVideoButton = document.getElementById('load-video');
	subogen.loadSubtitlesButton = document.getElementById('load-subtitles');
	
	subogen.playerDropTarget = document.getElementById('player-drop-target');
	subogen.subDropTarget = document.getElementById('sub-drop-target');
	
	subogen.setStartButton = document.getElementById('set-start');
	subogen.setStopButton = document.getElementById('set-stop');
	subogen.setStopStartButton = document.getElementById('set-stop-start');
	
	subogen.saveToYouTubeButton = document.getElementById('save-to-youtube');
	subogen.loadVideoFromYouTubeButton = document.getElementById('load-video-from-youtube');
	
	subogen.changeFontButton = document.getElementById('change-font');
	subogen.helpButton = document.getElementById('help');
	
	subogen.loadVideoButton.addEventListener('change', function (e) {
		subogen.player.load(e.currentTarget.files[0]);
	});
	
	subogen.playerDropTarget.addEventListener('drop', function (e) {
		subogen.player.load(e.dataTransfer.files[0]);
	});
	
	subogen.loadSubtitlesButton.addEventListener('change', function (e) {
		subogen.loadSubs(e.currentTarget.files[0]);
	});
	
	subogen.subDropTarget.addEventListener('drop', function (e) {
		subogen.loadSubs(e.dataTransfer.files[0]);
	});
});