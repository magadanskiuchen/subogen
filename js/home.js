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
	
	player.click(function (e) {
		if (player.data('dblclick') === true) {
			e.preventDefault();
			toggleFullscreen();
		} else {
			player.data('dblclick', true);
			setTimeout(function () {
				player.data('dblclick', false);
			}, 200);
		}
	});
	
	gridText
		.find('tr').live('click', function(e) {
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
		})
		.find('td').live('blur', function(e) {
			updateSubData($(e.currentTarget));
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
		$(this).find('#subData').val(generateSRT(subData)).val();
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
		
		if (subDataItem && typeof(subDataItem.start) != 'undefined' && subDataItem.start < subDataItem.end) {
			preview.html(subDataItem.text.replace(/\n/, '<br />'));
		} else {
			preview.html('');
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
		preview.css({ bottom: grid.height() + controls.height() + VIDEO_CONTROLS_HEIGHT + 'px' });
	}
	
	function loadVideo(file) {
		controls.find('#fileName').val(file.name);
		player[0].src = createObjectURL(file);
	}
	
	function loadSubs(file) {
		var reader = new FileReader(file);
		
		reader.onloadend = function(e) {
			var text = this.result;
			if (file.name.match(/\.srt$/i)) {
				subData = parseSubsAsSRT(text);
			} else {
				subData = parseSubsAsPlain(text);
			}
			
			var append = '';
			
			for (var i in subData) {
				var sub = subData[i];
				append += '<tr><td class="text" contenteditable="true">' + sub.text + '</td><td class="start" contenteditable="true">' + formatTime(sub.start) + '</td><td class="end" contenteditable="true">' + formatTime(sub.end) + '</td></tr>'
			}
			
			gridText.html('').append(append);
			setCurrentLine(0);
		}
		
		reader.readAsText(file);
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
		var delta = -1;
		var lowIndex = 0;
		var highIndex = subData.length;
		var midIndex = parseInt(subData.length / 2);
		var item = null;
		
		for (var i = 0; i < subData.length; ++i) {
			item = subData[midIndex];
			
			if (item && item.start && item.end) {
				if (item.start > time || item.end == 0) {
					delta = -1;
					item = null;
				} else {
					if (item.end < time) {
						delta = 1;
						item = null;
					} else {
						break;
					}
				}
			}
			
			if (delta < 0) {
				highIndex = midIndex;
				midIndex = parseInt( (midIndex + lowIndex) / 2 );
			} else {
				lowIndex = midIndex;
				midIndex = parseInt( (midIndex + highIndex) / 2 );
			}
		}
		
		return item;
	}
	
	function updateSubData(item) {
		var index = item.closest('tr').index();
		var currentSub = subData[index];
		
		var prop = item.attr('class');
		var val = item.html().replace(/<br\s?\/?>/, '\n');
		
		switch (prop) {
			case 'start':
			case 'end':
				val = parseTime(val);
				break;
		}
		
		if (typeof(currentSub[prop]) != 'undefined') currentSub[prop] = val;
	}
	
	function toggleFullscreen() {
		if (!player.data('fullScreen')) {
			// enter fullscreen
			
			player.data('fullScreen', true);
			// requestFullScreen(player[0]);
		} else {
			// exit fullscreen
			
			player.data('fullScreen', false);
			// exitFullScreen();
		}
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

function requestFullScreen(element) {
	// Supports most browsers and their versions.
	var requestMethod = element.requestFullScreen || element.webkitRequestFullScreen || element.mozRequestFullScreen || element.msRequestFullScreen;
	
	if (requestMethod) { // Native full screen.
		requestMethod.call(element);
	}
}

function exitFullScreen() {
	if (document.exitFullscreen) {
		document.exitFullscreen();
	} else if (document.webkitExitFullscreen) {
		document.webkitExitFullscreen();
	} else if (document.mozExitFullscreen) {
		document.mozExitFullscreen();
	} else if (document.msExitFullscreen) {
		document.msExitFullscreen();
	}
}

function formatTime(seconds) {
	if (typeof(seconds) == 'undefined') seconds = 0;
	
	var time = new Date(seconds * 1000);
	var localTime = new Date(0);
	
	seconds = seconds.toString() + '000';
	var miliseconds = seconds.match(/\.([\d]{3})/);
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

function parseSubsAsPlain(text) {
	var data = [];
	var lines = text.split(/\n/);
	
	for (var line in lines) {
		data.push({ start: 0, end: 0, text: lines[line] });
	}
	
	return data;
}

function parseSubsAsSRT(text) {
	var data = [];
	
	var lines = text.match(/(\d+)[^\n]*\n(\d\d:\d\d:\d\d,\d\d\d)\s-->\s(\d\d:\d\d:\d\d,\d\d\d)[^\n]*\n(.*)/g);
	if (lines && lines.length) {
		for (var line in lines) {
			var lineData = lines[line].match(/(\d+)[^\n]*\n(\d\d:\d\d:\d\d,\d\d\d)\s-->\s(\d\d:\d\d:\d\d,\d\d\d)[^\n]*\n(.*)/);
			if (lineData && lineData.length) {
				var item = {};
				item.start = parseTime(lineData[2]);
				item.end = parseTime(lineData[3]);
				item.text = lineData[4];
				
				data.push(item);
			}
		}
	}
	
	return data;
}

function parseTime(timeString) {
	return (3600*timeString.substr(0, 2)) + (60*timeString.substr(3, 2)) + (1*timeString.substr(6, 2)) + (0.001*timeString.substr(9, 3));
}

function generateSRT(subData) {
	var srt = '';
	var i = 0;
	
	for (var j in subData) {
		var item = subData[j];
		srt += ++i + '\n' + formatTime(item.start) + ' --> ' + formatTime(item.end) + '\n' + item.text + '\n\n';
	}
	
	return srt;
}