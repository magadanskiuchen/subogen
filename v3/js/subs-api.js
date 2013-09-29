define('com.magadanski.Player', function () {
	// TODO: custom controls and fullscreen
	var utils = inc('com.magadanski.utils', true);
	var TypeException = inc('com.magadanski.exceptions.TypeException', true);
	
	var text = '';
	var subtitleClass = 'subtitles';
	
	function Player(p) {
		var that = this;
		
		if (typeof(p) == 'undefined') p = null;
		that.p = p;
	}
	
	Player.prototype.load = function (file) {
		if (file instanceof File) {
			if (this.p.canPlayType(file.type)) {
				this.p.src = utils.createObjectURL(file);
			} // TODO: add "else" statement to let users know video type is not supported
		} else {
			throw new TypeException('Player.load requires first argument to be File, ' + file.prototype + ' passed.');
		}
	}
	
	Player.prototype.text = function (subtitle) {
		that = this;
		
		if (typeof(subtitle) != 'undefined') {
			if (text != '') {
				that.p.parentNode.removeChild(that.querySelector('p.' + subtitleClass));
			}
			
			text = subtitle;
			
			if (text == '') {
				that.p.parentNode.removeChild(that.querySelector('p.' + subtitleClass));
			} else {
				var t = document.createElement('p');
				t.innerText = text;
				utils.addClass(t, subtitleClass);
				
				utils.insertAfter(t, that.p);
			}
		} else {
			return text;
		}
	}
	
	com.magadanski.Player = Player;
});

define('com.magadanski.parsers.SubParser', function () {
	function SubParser() {
		var that = this;
		
		that.syntax = '';
		that.priority = 0;
	}
	
	SubParser.prototype.test = function (text) {
		return false;
	}
	
	SubParser.prototype.parse = function (text) {
		return false;
	}
	
	com.magadanski.parsers.SubParser = SubParser;
});

define('com.magadanski.parsers.SubTextParser', function () {
	function SubTextParser() {
		var that = this;
		
		that.priority = -1;
	}
	
	SubTextParser.inherits(com.magadanski.parsers.SubParser);
	
	SubTextParser.prototype.test = function (text) {
		return true;
	}
	
	SubTextParser.prototype.parse = function (text) {
		var data = [];
		var lines = text.split(/\n/);
		
		for (var line in lines) {
			data.push({ text: lines[line], start: 0, stop: 0 });
		}
		
		return data;
	}
	
	com.magadanski.parsers.SubTextParser = SubTextParser;
});

define('com.magadanski.parsers.SubRipParser', function () {
	// private variables
	var syntax, itemSyntax;
	
	function SubRipParser() {
		var that = this;
		
		syntax = /(\d+)[^\n]*\n(\d\d:\d\d:\d\d,\d\d\d)\s-->\s(\d\d:\d\d:\d\d,\d\d\d)[^\n]*\n(.*)/g;
		itemSyntax = /(\d+)[^\n]*\n(\d\d:\d\d:\d\d,\d\d\d)\s-->\s(\d\d:\d\d:\d\d,\d\d\d)[^\n]*\n(.*)/;
	}
	
	SubRipParser.inherits(com.magadanski.parsers.SubParser);
	
	SubRipParser.prototype.test = function (text) {
		return syntax.test(text);
	}
	
	SubRipParser.prototype.parseTime = function (timeString) {
		return (3600*timeString.substr(0, 2)) + (60*timeString.substr(3, 2)) + (1*timeString.substr(6, 2)) + (0.001*timeString.substr(9, 3));
	}
	
	SubRipParser.prototype.parse = function (text) {
		var data = [];
		
		var lines = text.match(syntax);
		if (lines && lines.length) {
			for (var line in lines) {
				var lineData = lines[line].match(itemSyntax);
				if (lineData && lineData.length) {
					var item = {};
					item.start = this.parseTime(lineData[2]);
					item.end = this.parseTime(lineData[3]);
					item.text = lineData[4];
					
					data.push(item);
				}
			}
		}
		
		return data;
	}
	
	com.magadanski.parsers.SubRipParser = SubRipParser;
});

define('com.magadanski.parsers.SubAutoParser', function () {
	function SubAutoParser(text) {
		var that = this;
		
		if (typeof(text) != 'string') return false;
		
		var parsers = [];
		
		for (var parser in com.magadanski.parsers) {
			if (parser != 'SubAutoParser') parsers.push(new com.magadanski.parsers[parser]);
		}
		
		parsers.sort(function (a, b) {
			return b.priority - a.priority;
		});
		
		var parser = null;
		
		for (var p in parsers) {
			parser = parsers[p];
			if (parser.test(text)) {
				break;
			}
		}
		
		return parser;
	}
	
	SubAutoParser.inherits(com.magadanski.parsers.SubParser);
	
	com.magadanski.parsers.SubAutoParser = SubAutoParser;
});

define('com.magadanski.SubData', function () {
	var SubAutoParser = inc('com.magadanski.parsers.SubAutoParser', true);
	
	function SubData(text) {
		var that = this;
		
		that.data = [];
		
		that.append = function (text, start, stop) {
			data.push({ text: text, start: start, stop: stop });
		}
		
		that.prepend = function (text, start, stop) {
			data.unshift({ text: text, start: start, stop: stop });
		}
		
		that.getItem = function (index) {
			return data[index];
		}
		
		that.getByTime = function (time) {
			var delta = -1;
			var lowIndex = 0;
			var midIndex = parseInt(data.length / 2);
			var highIndex = data.length;
			var item = null;
			
			for (var i = 0; i < data.length; ++i) {
				item = data[midIndex];
				
				if (item && item.start && item.stop) {
					if (item.start > time || item.stop == 0) {
						delta = -1;
						item = null;
					} else {
						if (item.stop < time) {
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
		
		that.loadSubs = function (text) {
			var parser = new SubAutoParser(text);
			that.data = parser.parse(text);
		}
		
		if (typeof(text) != 'undefined') that.loadSubs(text);
	}
	
	com.magadanski.SubData = SubData;
});