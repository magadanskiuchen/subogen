com = (typeof(com) != 'undefined') ? com : {};
com.magadanski = (typeof(com.magadanski) != 'undefined') ? com.magadanski : {};

com.magadanski.EventDispatcher = null;

(function () {
	var events = {};
	
	com.magadanski.EventDispatcher = function () {};
	
	com.magadanski.EventDispatcher.prototype.addEventListener = function (eventType, callback) {
		if (typeof(events[eventType]) == 'undefined') events[eventType] = [];
		
		events[eventType].push(callback);
	}
	
	com.magadanski.EventDispatcher.prototype.dispatchEvent = function (eventType, eventObj) {
		if (typeof(events[eventType]) == 'object') {
			for (var callback in events[eventType]) {
				if (typeof(events[eventType][callback]) == 'function') events[eventType][callback](eventObj);
			}
		}
	}
})();

com.magadanski.WebApp = null;

(function () {
	var events = {};
	
	com.magadanski.WebApp = function () {};
	
	com.magadanski.WebApp.prototype = new com.magadanski.EventDispatcher();
	com.magadanski.WebApp.prototype.constructor = com.magadanski.WebApp;
	com.magadanski.WebApp.prototype.parent = com.magadanski.EventDispatcher.prototype;
	
	com.magadanski.WebApp.prototype.init = function (callback) {
		if (typeof(callback) == 'function')  document.addEventListener('DOMContentLoaded', callback);
	}
	
	com.magadanski.WebApp.prototype.loaded = function (callback) {
		window.addEventListener('load', callback);
	}
})();