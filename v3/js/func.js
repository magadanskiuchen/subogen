com = (typeof(com) != 'undefined') ? com : {};
com.magadanski = (typeof(com.magadanski) != 'undefined') ? com.magadanski : {};

com.magadanski.SubEditor = function (g) {
	var that = this;
	
	if (typeof(g) == 'undefined') g = null;
	
	this.g = g;
	this.currentLine = 0;
	this.subData = null;
}

com.magadanski.SubEditor.prototype = new com.magadanski.EventDispatcher();
com.magadanski.SubEditor.prototype.constructor = com.magadanski.SubEditor;
com.magadanski.SubEditor.prototype.parent = com.magadanski.EventDispatcher.prototype;

com.magadanski.SubEditor.prototype.CURRENT_LINE_CLASS = 'currentLine';

com.magadanski.SubEditor.prototype.getRow = function (index) {
	return this.g.getElementsByTagName('tr').item(index);
}

com.magadanski.SubEditor.prototype.setCurrentLine = function (index) {
	var row = this.getRow(index);
	
	if (typeof(row) != 'undefined') {
		com.magadanski.utils.removeClass(this.getRow(this.currentLine), this.CURRENT_LINE_CLASS);
		com.magadanski.utils.addClass(row, this.CURRENT_LINE_CLASS);
		this.currentLine = index;
	}
}

com.magadanski.SubEditor.prototype.render = function (subData) {
	var that = this;
	
	this.subData = subData;
	
	var markup = '';
	var tbody = this.g.getElementsByTagName('tbody').item(0);
	
	for (var s in this.subData) {
		markup += '<tr data-index="' + s + '">';
			markup += '<td class="text" contenteditable="true">' + this.subData[s].text + '</td>';
			markup += '<td class="start" contenteditable="true">' + com.magadanski.utils.formatTime(this.subData[s].start) + '</td>';
			markup += '<td class="end" contenteditable="true">' + com.magadanski.utils.formatTime(this.subData[s].end) + '</td>';
		markup += '</tr>';
	}
	
	tbody.innerHTML = markup;
	
	var cells = that.g.getElementsByTagName('td');
	for (var i = 0; i < cells.length; ++i) {
		var cell = cells.item(i);
		
		cell.addEventListener('focus', function (e) {
			that.setCurrentLine(e.target.parentNode.rowIndex);
		});
		
		cell.addEventListener('blur', function (e) {
			var row = e.target.parentNode;
			var subDataIndex = row.getAttribute('data-index');
			var subRipParser = new com.magadanski.parsers.SubRipParser();
			
			that.subData[subDataIndex].text = row.getElementsByClassName('text').item(0).innerHTML.replace(/<br\s?\/?>/, '\n');
			that.subData[subDataIndex].start = subRipParser.parseTime(row.getElementsByClassName('start').item(0).innerText);
			that.subData[subDataIndex].end = subRipParser.parseTime(row.getElementsByClassName('end').item(0).innerText);
			
			var customEvent = {};
			customEvent.originalEvent = e;
			customEvent.currentTarget = that;
			
			that.dispatchEvent('update', customEvent);
		});
	}
}

com.magadanski.Subogen = null;

(function () {
	com.magadanski.Subogen = function () {
		this.player = null;
		
		this.subData = new com.magadanski.SubData();
		this.subEditor = null;
		
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
				var customEvent = {};
				customEvent.originalEvent = e;
				customEvent.currentTarget = that;
				customEvent.fileContent = fileContent;
				
				that.dispatchEvent('subsloaded', customEvent);
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
		subogen.subEditor.render(subogen.subData.data);
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
	
	subogen.subEditor = new com.magadanski.SubEditor(document.querySelector('#grid > table'));
	subogen.subEditor.addEventListener('update', function (e) {
		subogen.subData.data = e.currentTarget.subData;
	});
	
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