jQuery(function($) {
	window.srt = '';
	
	var subtitleList = $('#subtitleList');
	var subtitleListOptions = subtitleList.find('option');
	
	var loadButton = $('#loadButton');
	var videoContainer = $('#videoContainer');
	
	var loadSubtitlesButton = $('#loadSubtitlesButton');
	var subtitlesContainer = $('#subtitlesContainer');
	
	var srtButton = $('#srt');
	
	var player = $('#player');
	
	var progressBar = $('#progressBar');
	var progressComplete = $('#progressComplete');
	
	var subtitleOutput = $('#subtitleOutput');
	var subtitleFileName = $('#subtitleFileName');
	
	player.bind('play', function() {
		subtitleList.focus();
	});
	
	positionFileContainers();
	$(window).resize(positionFileContainers);
	
	videoContainer.change(function(e) {
		var video = e.currentTarget.files[0];
		subtitleFileName.val(video.fileName);
		
		var reader = new FileReader(video);
		progressComplete.width(0);
		progressBar.show();
		
		reader.onprogress = function(e) {
			var percentage = parseInt((e.loaded / e.total)*100);
			progressComplete.text(percentage);
			progressComplete.css({ width: percentage + '%' });
		}
		
		reader.onloadend = function(e) {
			if (player[0].canPlayType(video.type) != '') {
				player[0].src = e.currentTarget.result;
				player[0].play();
				
				progressBar.hide();
			} else {
				alert('The current video format is not supported');
			}
		}
		
		reader.readAsDataURL(video);
	});
	
	subtitlesContainer.change(function(e) {
		var subtitlesFile = e.currentTarget.files[0];
		var subtitles = '';
		
		var reader = new FileReader(subtitlesFile);
		
		reader.onloadend = function(e) {
			subtitles = e.currentTarget.result;
			
			var lines = subtitles.match(/^[^\n]+/mg);
			
			for (var line in lines) {
				if (lines[line] != '') subtitleList.append('<option>' + lines[line] + '</option>');
			}
			
			subtitleList.focus();
			subtitleListOptions = subtitleList.find('option');
			subtitleListOptions.removeAttr('selected').first().attr('selected', 'selected');
		}
		
		reader.readAsText(subtitlesFile);
	});
	
	subtitleList.keydown(function(e) {
		if (e.which == 90) { // z
			// set start time
			subtitleListOptions.filter('[selected]').data('startTime', player[0].currentTime);
		} else if (e.which == 88) { // x
			// set end time and navigate to next line
			var currentItem = subtitleListOptions.filter('[selected]').data('endTime', player[0].currentTime).removeAttr('selected')
				.next('option').attr('selected', 'selected');
			
			try {
				subtitleList[0].scrollTop = currentItem.index() * 17;
			} catch (err) {
				
			}
		} else if (e.which == 67) { // c
			var currentItem = subtitleListOptions.filter('[selected]').data('endTime', player[0].currentTime).removeAttr('selected')
				.next('option').attr('selected', 'selected').data('startTime', player[0].currentTime + 0.01);
			
			try {
				subtitleList[0].scrollTop = currentItem.index() * 17;
			} catch (err) {
				
			}
		}
		
		e.preventDefault();
	});
	
	srtButton.click(function() {
		window.srt = '';
		var i = 0;
		
		subtitleListOptions.each(function() {
			window.srt += ++i + "\n" + formatTime($(this).data('startTime')) + ' --> ' + formatTime($(this).data('endTime')) + "\n" + $(this).text() + "\n";
		});
		
		subtitleOutput.val(window.srt).parent().submit();
	});
	
	function positionFileContainers() {
		$('.fileContainer').each(function() {
			var itemFor = $('#' + $(this).attr('data-for'));
			$(this)
				.width(itemFor.outerWidth(true))
				.height(itemFor.outerHeight(true))
				.css({ left: itemFor.position().left, top: itemFor.position().top });
		});
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
});