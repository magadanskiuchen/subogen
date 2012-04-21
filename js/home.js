jQuery(function($) {
	var app = $(document.body);
	
	var player = $('#videoPlayer');
	var grid = $('#grid');
	var controls = $('#controls');
	
	var subtitlesFile = $('#subtitlesFile');
	var videoFile = $('#videoFile');
	
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
	
	$(document).keydown(function(e) {
		if (!$(e.target).is('[contenteditable]')) {
			console.log(e.which);
		}
	});
	
	function render() {
		player.width(app.width());
		player.height( (app.height() - controls.outerHeight(true)) * 0.67 );
		
		grid.width(app.width());
		grid.height( (app.height() - controls.outerHeight(true)) * 0.33 );
	}
	
	function loadVideo(file) {
		player[0].src = createObjectURL(file);
	}
	
	function loadSubs(file) {
		var reader = new FileReader(file);
		
		reader.onloadend = function(e) {
			var text = this.result;
			var subData = parseSubs(text);
			var gridText = grid.find('tbody');
			
			for (var i in subData) {
				var sub = subData[i];
				gridText.append('<tr><td>' + sub.text + '</td><td>' + sub.start + '</td><td>' + sub.end + '</td></tr>');
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