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
				eventObj.type = eventType;
				if (typeof(events[eventType][callback]) == 'function') events[eventType][callback](eventObj);
			}
		}
	}
})();

com.magadanski.WebApp = null;

(function () {
	com.magadanski.WebApp = function () {
		var that = this;
		
		document.addEventListener('DOMContentLoaded', function (e) {
			var customEvent = {};
			customEvent.originalEvent = e;
			customEvent.currentTarget = that;
			
			that.dispatchEvent('init', customEvent);
		});
		
		window.addEventListener('load', function (e) {
			var customEvent = {};
			customEvent.originalEvent = e;
			customEvent.currentTarget = that;
			
			that.dispatchEvent('load', customEvent);
		});
	};
	
	com.magadanski.WebApp.prototype = new com.magadanski.EventDispatcher();
	com.magadanski.WebApp.prototype.constructor = com.magadanski.WebApp;
	com.magadanski.WebApp.prototype.parent = com.magadanski.EventDispatcher.prototype;
})();