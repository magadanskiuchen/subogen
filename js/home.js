jQuery(function($) {
	var app = $(document.body);
	
	var player = $('#videoPlayer');
	var preview = $('p.sub-preview');
	
	var grid = $('#grid');
	var gridText = grid.find('tbody');
	
	var controls = $('#controls');
	
	var subtitlesFile = $('#subtitlesFile');
	var videoFile = $('#videoFile');
	
	var currentLine = null;
	var subData = [];
	
	render();
	
	$(window).on({
		resize: render,
		drop: function(e) {
			e.preventDefault();
			$('.droptarget').removeClass('droptarget');
			
			var target = $(e.target);
			
			if (target.is('video')) {
				loadVideo(e.originalEvent.dataTransfer.files[0]);
			} else if (target.is('#grid, #grid *')) {
				loadSubs(e.originalEvent.dataTransfer.files[0]);
			}
			
			return false;
		},
		dragenter: function(e) {
			$('.droptarget').removeClass('droptarget');
			$(e.target).addClass('droptarget');
		}
	});
	
	subtitlesFile.change(function(e) {
		loadSubs(e.currentTarget.files[0]);
	});
	
	videoFile.change(function(e) {
		loadVideo(e.currentTarget.files[0]);
	});
	
	gridText.find('tr').live('click', function(e) {
		var tr = $(this);
		
		if (tr.data('dblclick')) {
			e.preventDefault();
			setCurrentLine(tr.index());
			window.getSelection().removeAllRanges();
			player[0].focus();
		} else {
			tr.data('dblclick', true);
			setTimeout(function() {
				tr.data('dblclick', false);
			}, 200);
		}
	});
	
	$(document).keydown(function(e) {
		if (!$(e.target).is('[contenteditable]')) {
			if (isPlaying) {
				if (e.which == 90) { // z
					e.preventDefault();
					
					setStart();
				} else if (e.which == 88) { // x
					e.preventDefault();
					
					setStop();
				} else if (e.which == 67) { // c
					e.preventDefault();
					
					setStop(true);
				}
			}
		}
	});
	
	controls.submit(function() {
		return false;
	});
	
	controls.find('.start').click(function(e) {
		e.preventDefault();
		
		setStart();
	});
	
	controls.find('.stop').click(function(e) {
		e.preventDefault();
		
		setStop();
	});
	
	controls.find('.stop-start').click(function(e) {
		e.preventDefault();
		
		setStop(true);
	});
	
	player[0].addEventListener('timeupdate', function(e) {
		var time = e.srcElement.currentTime;
		var subDataItem = getSubDataByTime(time);
		
		if (typeof(subDataItem) != 'undefined' && subDataItem.start < subDataItem.end) {
			preview.text(subDataItem.text);
		} else {
			preview.text('');
		}
	}, false);
	
	function render() {
		player.width(app.width());
		player.height( (app.height() - controls.outerHeight(true)) * 0.67 );
		
		grid.width(app.width());
		grid.height( (app.height() - controls.outerHeight(true)) * 0.33 );
		
		renderPreview();
		
		$('input[type="file"]').each(function() {
			var input = $(this);
			var mask = $(this).next('a.' + input.attr('class'));
			
			if (!mask.length) {
				input.css({ opacity: 0 });
				input.after('<a href="#" class="' + input.attr('class') + '" />');
				mask = $(this).next('a.' + input.attr('class'));
			}
			
			mask.css({ position: 'absolute', left: input.position().left, top: input.position().top });
		});
	}
	
	function renderPreview() {
		var VIDEO_CONTROLS_HEIGHT = 35;
		preview.css({ top: player.height() - preview.outerHeight() - VIDEO_CONTROLS_HEIGHT + 'px' });
	}
	
	function loadVideo(file) {
		player[0].src = createObjectURL(file);
	}
	
	function loadSubs(file) {
		var reader = new FileReader(file);
		
		reader.onloadend = function(e) {
			var text = this.result;
			subData = parseSubs(text);
			
			for (var i in subData) {
				var sub = subData[i];
				gridText.append('<tr><td class="text">' + sub.text + '</td><td class="start">' + formatTime(sub.start) + '</td><td class="end">' + formatTime(sub.end) + '</td></tr>');
				setCurrentLine(0);
			}
		}
		
		reader.readAsText(file);
	}
	
	function parseSubs(text) {
		var data = [];
		var lines = text.split(/\n/);
		
		for (var line in lines) {
			data.push({ start: 0, end: 0, text: lines[line] });
		}
		
		return data;
	}
	
	function isPlaying() {
		return !player[0].paused;
	}
	
	function setCurrentLine(index) {
		index = parseInt(index);
		if (index < 0 || index > gridText.find('tr').length) {
			throw { name: 'Invalid line number', message: 'Trying to set currentLine to non-existing item index' };
		}
		
		currentLine = index;
		gridText.find('tr.currentLine').removeClass('currentLine');
		gridText.find('tr:eq(' + currentLine + ')').addClass('currentLine');
		
		try {
			grid[0].scrollTop = currentLine * gridText.find('td:first').outerHeight(true);
		} catch (err) {
			console.log(err);
		}
	}
	
	function setStart() {
		var time = player[0].currentTime;
		var formattedTime = formatTime(time);
		
		subData[currentLine].start = time
		gridText.find('tr.currentLine .start').attr('data-time', time).text(formattedTime);
	}
	
	function setStop(start) {
		if (typeof(start) == 'undefined') start = false;
		
		var time = player[0].currentTime;
		var formattedTime = formatTime(time);
		
		subData[currentLine].end = time
		gridText.find('tr.currentLine .end').attr('data-time', time).text(formattedTime);
		
		if (currentLine+1 < gridText.find('tr').length) {
			setCurrentLine(currentLine+1);
			if (start) setTimeout(setStart, 20);
		}
	}
	
	function getSubDataByTime(time) {
		var delta = 1;
		var midIndex = 0;
		var item = null;
		
		for (var i = 0; i < subData.length; ++1) {
			if (delta < 0) {
				midIndex = parseInt( (midIndex + 0) / 2 );
			} else {
				midIndex = parseInt( (midIndex + subData.length) / 2 );
			}
			
			item = subData[midIndex];
			// if (item.start < time && item.end > time) break;
			
			if (item.start > time) {
				delta = -1;
			} else {
				if (item.end < time && item.end != 0) {
					delta = 1;
				} else {
					break;
				}
			}
		}
		
		return item;
	}
});

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

function formatTime(seconds) {
	if (typeof(seconds) == 'undefined') seconds = 0;
	
	var time = new Date(seconds * 1000);
	var localTime = new Date(0);
	var miliseconds = seconds.toString().match(/\.([\d]{3})/);
	if (typeof(miliseconds) != 'object' || !miliseconds || typeof(miliseconds[1]) == 'undefined') {
		miliseconds = '000';
	} else {
		miliseconds = miliseconds[1];
	}
	
	return leadingZero(time.getHours() - localTime.getHours()) + ':' + leadingZero(time.getMinutes()) + ':' + leadingZero(time.getSeconds()) + ',' + miliseconds;
}

function leadingZero(integer) {
	return (integer < 10) ? ('0' + integer) : integer;
}