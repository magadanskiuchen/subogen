define('com.magadanski.exceptions.Exception', function () {
	function Exception(message) {
		this.message = message;
	}

	Exception.prototype.getType = function () {
		return this.constructor.toString().match(/function\s?(\w+)/)[1];
	}
	
	com.magadanski.exceptions.Exception = Exception;
});

define('com.magadanski.exceptions.TypeException', function () {
	function TypeException(message) {
		var that = this;
	}
	
	TypeException.inherits(com.magadanski.exceptions.Exception);
	
	com.magadanski.exceptions.TypeException = TypeException;
});