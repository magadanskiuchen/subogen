com = (typeof(com) != 'undefined') ? com : {};
com.magadanski = (typeof(com.magadanski) != 'undefined') ? com.magadanski : {};
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

com.magadanski.SubParser = function () {
	var that = this;
	
	this.srtSyntax = /(\d+)[^\n]*\n(\d\d:\d\d:\d\d,\d\d\d)\s-->\s(\d\d:\d\d:\d\d,\d\d\d)[^\n]*\n(.*)/g;
	this.srtItemSyntax = /(\d+)[^\n]*\n(\d\d:\d\d:\d\d,\d\d\d)\s-->\s(\d\d:\d\d:\d\d,\d\d\d)[^\n]*\n(.*)/;
}

com.magadanski.SubParser.prototype.parseText = function (text) {
	var data = [];
	var lines = text.split(/\n/);
	
	for (var line in lines) {
		data.push({ text: lines[line], start: 0, stop: 0 });
	}
	
	return data;
}

com.magadanski.SubParser.prototype.parseSRT = function(text) {
	var data = [];
	
	var lines = text.match(this.srtSyntax);
	if (lines && lines.length) {
		for (var line in lines) {
			var lineData = lines[line].match(this.srtItemSyntax);
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

com.magadanski.SubParser.prototype.parseAuto = function(text) {
	var data = [];
	
	if (this.srtItemSyntax.test(text)) {
		data = this.parseSRT(text);
	} else {
		data = this.parseText(text);
	}
	
	return data;
}

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
		this.data = com.magadanski.SubParser.parseAuto(text);
	}
	
	if (typeof(text) != 'undefined') this.loadSubs(text);
}

// shiv for window.URL.createObjectURL
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