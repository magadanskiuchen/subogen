com = (typeof(com) != 'undefined') ? com : {};
com.magadanski = (typeof(com.magadanski) != 'undefined') ? com.magadanski : {};
com.magadanski.parsers = (typeof(com.magadanski.parsers) != 'undefined') ? com.magadanski.parsers : {};
com.magadanski.utils = (typeof(com.magadanski.utils) != 'undefined') ? com.magadanski.utils : {};

com.magadanski.Player = function (p) {
	var that = this;
	
	this.p = p;
	
	this.load = function (file) {
		if (p.canPlayType(file.type)) {
			p.src = com.magadanski.utils.createObjectURL(file);
		}
	}
}

com.magadanski.parsers.SubParser = function () {
	var that = this;
	
	this.syntax = '';
	this.priority = 0;
}

com.magadanski.parsers.SubParser.prototype.test = function (text) {
	return false;
}

com.magadanski.parsers.SubParser.prototype.parse = function (text) {
	return false;
}

com.magadanski.parsers.SubTextParser = function () {
	var that = this;
	
	this.priority = -1;
}

com.magadanski.parsers.SubTextParser.prototype = new com.magadanski.parsers.SubParser();
com.magadanski.parsers.SubTextParser.prototype.constructor = com.magadanski.parsers.SubTextParser;
com.magadanski.parsers.SubTextParser.prototype.parent = com.magadanski.parsers.SubParser.prototype;

com.magadanski.parsers.SubTextParser.prototype.test = function (text) {
	return true;
}

com.magadanski.parsers.SubTextParser.prototype.parse = function (text) {
	var data = [];
	var lines = text.split(/\n/);
	
	for (var line in lines) {
		data.push({ text: lines[line], start: 0, stop: 0 });
	}
	
	return data;
}

com.magadanski.parsers.SubRipParser = function () {
	var that = this;
	
	this.syntax = /(\d+)[^\n]*\n(\d\d:\d\d:\d\d,\d\d\d)\s-->\s(\d\d:\d\d:\d\d,\d\d\d)[^\n]*\n(.*)/g;
	this.itemSyntax = /(\d+)[^\n]*\n(\d\d:\d\d:\d\d,\d\d\d)\s-->\s(\d\d:\d\d:\d\d,\d\d\d)[^\n]*\n(.*)/;
}

com.magadanski.parsers.SubRipParser.prototype = new com.magadanski.parsers.SubParser();
com.magadanski.parsers.SubRipParser.prototype.constructor = com.magadanski.parsers.SubRipParser;
com.magadanski.parsers.SubRipParser.prototype.parent = com.magadanski.parsers.SubParser.prototype;

com.magadanski.parsers.SubRipParser.prototype.test = function (text) {
	return this.syntax.test(text);
}

com.magadanski.parsers.SubRipParser.prototype.parseTime = function (timeString) {
	return (3600*timeString.substr(0, 2)) + (60*timeString.substr(3, 2)) + (1*timeString.substr(6, 2)) + (0.001*timeString.substr(9, 3));
}

com.magadanski.parsers.SubRipParser.prototype.parse = function (text) {
	var data = [];
	
	var lines = text.match(this.syntax);
	if (lines && lines.length) {
		for (var line in lines) {
			var lineData = lines[line].match(this.itemSyntax);
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

com.magadanski.parsers.SubAutoParser = function (text) {
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

com.magadanski.parsers.SubAutoParser.prototype = new com.magadanski.parsers.SubParser();
com.magadanski.parsers.SubAutoParser.prototype.constructor = com.magadanski.parsers.SubAutoParser;
com.magadanski.parsers.SubAutoParser.prototype.parent = com.magadanski.parsers.SubParser.prototype;

com.magadanski.SubData = function (text) {
	var that = this;
	
	this.data = [];
	
	this.append = function (text, start, stop) {
		data.push({ text: text, start: start, stop: stop });
	}
	
	this.prepend = function (text, start, stop) {
		data.unshift({ text: text, start: start, stop: stop });
	}
	
	this.getItem = function (index) {
		return data[index];
	}
	
	this.getByTime = function (time) {
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
	
	this.loadSubs = function (text) {
		var parser = new com.magadanski.parsers.SubAutoParser(text);
		this.data = parser.parse(text);
	}
	
	if (typeof(text) != 'undefined') this.loadSubs(text);
}

// shim for window.URL.createObjectURL
com.magadanski.utils.createObjectURL = function(file) {
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

com.magadanski.utils.addClass = function (element, className) {
	if (typeof(element.className) != 'undefined') {
		if (!element.className.match(className)) element.className += ' ' + className;
	}
}

com.magadanski.utils.removeClass = function (element, className) {
	if (typeof(element.className) != 'undefined') {
		element.className = element.className.replace(className, '');
	}
}