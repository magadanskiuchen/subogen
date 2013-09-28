com = (typeof(com) != 'undefined') ? com : {};
com.magadanski = (typeof(com.magadanski) != 'undefined') ? com.magadanski : {};
com.magadanski.exceptions = (typeof(com.magadanski.exceptions) != 'undefined') ? com.magadanski.exceptions : {};

com.magadanski.exceptions.Exception = null;
(function () {
	com.magadanski.exceptions.Exception = function (message) {
		this.message = message;
	}

	com.magadanski.exceptions.Exception.prototype.getType = function () {
		var type = '';
		
		for (var i in com.magadanski.exceptions) {
			type = com.magadanski.exceptions[i];
			
			if (this instanceof type) {
				break;
			}
		}
		
		return type;
	}
})();

com.magadanski.exceptions.TypeException = null;
(function () {
	com.magadanski.exceptions.TypeException = function (message) {
		var that = this;
	}

	com.magadanski.exceptions.TypeException.prototype = new com.magadanski.exceptions.Exception();
	com.magadanski.exceptions.TypeException.prototype.constructor = com.magadanski.exceptions.TypeException;
	com.magadanski.exceptions.TypeException.prototype.parent = com.magadanski.exceptions.Exception.prototype;
})();