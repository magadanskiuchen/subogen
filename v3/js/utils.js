pack('com.magadanski.utils');

com.magadanski.utils.addClass = function (element, className) {
	if (element && typeof(element.className) != 'undefined') {
		if (!element.className.match(className)) element.className += ' ' + className;
	}
}

com.magadanski.utils.removeClass = function (element, className) {
	if (typeof(element.className) != 'undefined') {
		element.className = element.className.replace(className, '');
	}
}

// shim for window.URL.createObjectURL
com.magadanski.utils.createObjectURL = function(file) {
	var TypeException = inc('com.magadanski.exceptions.TypeException', true);
	
	if (!file instanceof File) {
		throw new TypeException('com.magadanski.utils.createObjectURL requires argument to be File, ' + file.prototype + ' passed.');
	}
	
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

com.magadanski.utils.loadFileContent = function (file, callback) {
	var TypeException = inc('com.magadanski.exceptions.TypeException', true);
	
	if (!file instanceof File) {
		throw new TypeException('com.magadanski.utils.loadFileContent requires argument to be File, ' + file.prototype + ' passed.');
	}
	
	if (window.FileReader) {
		var chunkSize = 2097152; // 2MB
		var startByte = 0;
		var endByte = 0;
		var reader = new FileReader(file);
		var fileContent = null;
		var fileSlice = file.slice || file.webkitSlice || file.mozSlice;
		
		function readChunk() {
			endByte = Math.min(startByte + chunkSize, file.size);
			reader.readAsText( fileSlice.call(file, startByte, endByte) );
		}
		
		reader.onloadend = function(e) {
			if (e.target.readyState == FileReader.DONE) {
				fileContent = new Blob([fileContent, e.target.result], { type: 'text/plain; charset=UTF-8', endings: 'native' });
				
				if (endByte < file.size) {
					startByte += chunkSize;
					readChunk();
				} else {
					if (typeof(callback) == 'function') {
						callback(e, this.result);
					}
				}
			}
		}
		
		readChunk();
	} else {
		alert('Your browser does not support HTML5 File API access');
	}
}

com.magadanski.utils.leadingZero = function (number) {
	return (number < 10) ? ('0' + number) : number;
}

com.magadanski.utils.formatTime = function (seconds) {
	var leadingZero = inc('com.magadanski.utils.leadingZero', true);
	
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