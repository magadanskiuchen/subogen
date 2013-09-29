inc('com.magadanski.utils');

inc('com.magadanski.EventDispatcher');
inc('com.magadanski.WebApp');
inc('com.magadanski.exceptions.TypeException');
inc('com.magadanski.parsers.SubRipParser');
inc('com.magadanski.SubData');
inc('com.magadanski.Player');

define('com.magadanski.SubEditor', function () {
	var currentLine;
	
	function SubEditor(g) {
		var that = this;
		
		if (typeof(g) == 'undefined') g = null;
		
		that.g = g;
		currentLine = 0;
		that.subData = null;
	}
	
	SubEditor.inherits(EventDispatcher);
	
	SubEditor.prototype.CURRENT_LINE_CLASS = 'currentLine';
	
	SubEditor.prototype.getRow = function (index) {
		return this.g.getElementsByTagName('tr').item(index);
	}
	
	SubEditor.prototype.getCurrentLine = function () {
		return currentLine;
	}
	
	SubEditor.prototype.setCurrentLine = function (index) {
		var row = this.getRow(index);
		
		if (typeof(row) != 'undefined') {
			utils.removeClass(this.getRow(currentLine), this.CURRENT_LINE_CLASS);
			utils.addClass(row, this.CURRENT_LINE_CLASS);
			currentLine = index;
		}
	}
	
	SubEditor.prototype.render = function (subData) {
		var that = this;
		
		that.subData = subData;
		
		var markup = '';
		var tbody = that.g.getElementsByTagName('tbody').item(0);
		
		for (var s in that.subData) {
			markup += '<tr data-index="' + s + '">';
				markup += '<td class="text" contenteditable="true">' + that.subData[s].text + '</td>';
				markup += '<td class="start" contenteditable="true">' + utils.formatTime(that.subData[s].start) + '</td>';
				markup += '<td class="end" contenteditable="true">' + utils.formatTime(that.subData[s].end) + '</td>';
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
				var subRipParser = new SubRipParser();
				
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
	
	com.magadanski.SubEditor = SubEditor;
});

define('com.magadanski.Subogen', function () {
	function Subogen() {
		this.player = null;
		
		this.subData = new SubData();
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
	
	Subogen.inherits(WebApp);
	
	Subogen.prototype.loadSubs = function (file) {
		var that = this;
		
		if (file instanceof File) {
			utils.loadFileContent(file, function (e, fileContent) {
				var customEvent = {};
				customEvent.originalEvent = e;
				customEvent.currentTarget = that;
				customEvent.fileContent = fileContent;
				
				that.dispatchEvent('subsloaded', customEvent);
			});
		} else {
			throw new TypeException('Subogen.loadSubs requires first argument to be File, ' + file.prototype + ' passed.');
		}
	}
	
	com.magadanski.Subogen = Subogen;
});

subogen = new com.magadanski.Subogen();
subogen.addEventListener('init', function () {
	subogen.addEventListener('subsloaded', function (e) {
		subogen.subData.loadSubs(e.fileContent);
		subogen.subEditor.render(subogen.subData.data);
	});
	
	window.addEventListener('dragenter', function (e) {
		utils.addClass(document.body, 'dropTarget');
	});

	window.addEventListener('dragleave', function (e) {
		if (!e.pageX) utils.removeClass(document.body, 'dropTarget');
	});

	window.addEventListener('dragover', function (e) {
		e.preventDefault();
	});

	window.addEventListener('drop', function (e) {
		e.preventDefault();
		utils.removeClass(document.body, 'dropTarget');
	}, true);
	
	subogen.player = new Player(document.getElementById('player'));
	subogen.player.addEventListener('videoLoaded', function (e) {
		// clear old listeners
		subogen.player.p.removeEventListener('timeupdate');
		
		subogen.player.p.addEventListener('timeupdate', function (e) {
			var time = e.srcElement.currentTime;
			var subDataItem = subogen.subData.getByTime(time);
			var text = '';
			
			if (subDataItem && typeof(subDataItem.start) != 'undefined' && subDataItem.start < subDataItem.end) {
				text = subDataItem.text.replace(/\n/, '<br />');
			}
			
			subogen.player.text(text);
		});
	});
	
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