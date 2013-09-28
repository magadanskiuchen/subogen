function pack(struct) {
	var elements = struct.split('.');
	var lastElement = window;
	
	for (var i = 0; i < elements.length; ++i) {
		var e = elements[i];
		
		lastElement[e] = (typeof(lastElement[e]) != 'undefined') ? lastElement[e] : {};
		lastElement = lastElement[e];
	}
}

function inc(struct, local) {
	if (typeof(local) == 'undefined') local = false;
	
	var elements = struct.split('.');
	var full = window;
	
	for (var i = 0; i < elements.length; ++i) {
		var e = elements[i];
		var full = full[e];
		
		if (i+1 == elements.length) {
			if (local) {
				return full;
			} else {
				window[e] = full;
			}
		}
	}
}