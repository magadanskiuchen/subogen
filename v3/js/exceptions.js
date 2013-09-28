pack('com.magadanski.exceptions');

com.magadanski.exceptions.Exception = null;
(function () {
	function Exception(message) {
		this.message = message;
	}

	Exception.prototype.getType = function () {
		return this.constructor.toString().match(/function\s?(\w+)/)[1];
	}
	
	com.magadanski.exceptions.Exception = Exception;
})();

com.magadanski.exceptions.TypeException = null;
(function () {
	function TypeException(message) {
		var that = this;
	}

	TypeException.prototype = new com.magadanski.exceptions.Exception();
	TypeException.prototype.constructor = TypeException;
	TypeException.prototype.parent = com.magadanski.exceptions.Exception.prototype;
	
	com.magadanski.exceptions.TypeException = TypeException;
})();