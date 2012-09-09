com = (typeof(com) != 'undefined') ? com : {};
com.magadanski = (typeof(com.magadanski) != 'undefined') ? com.magadanski : {};
com.magadanski.exceptions = (typeof(com.magadanski.exceptions) != 'undefined') ? com.magadanski.exceptions : {};

com.magadanski.exceptions.TypeException = function (message) {
	this.name = 'TypeException';
	this.message = message;
}