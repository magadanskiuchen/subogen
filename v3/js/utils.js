com = (typeof(com) != 'undefined') ? com : {};
com.magadanski = (typeof(com.magadanski) != 'undefined') ? com.magadanski : {};
com.magadanski.utils = (typeof(com.magadanski.utils) != 'undefined') ? com.magadanski.utils : {};

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

com.magadanski.utils.loadFileContent = function (file, callback) {
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