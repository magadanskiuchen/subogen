com = (typeof(com) != 'undefined') ? com : {};
com.magadanski = (typeof(com.magadanski) != 'undefined') ? com.magadanski : {};

com.magadanski.EventDispatcher = null;
(function () {
	var events = {};
	
	function EventDispatcher() {};
	
	EventDispatcher.prototype.addEventListener = function (eventType, callback) {
		if (typeof(events[eventType]) == 'undefined') events[eventType] = [];
		
		events[eventType].push(callback);
	}
	
	EventDispatcher.prototype.dispatchEvent = function (eventType, eventObj) {
		if (typeof(events[eventType]) == 'object') {
			for (var callback in events[eventType]) {
				eventObj.type = eventType;
				if (typeof(events[eventType][callback]) == 'function') events[eventType][callback](eventObj);
			}
		}
	}
	
	com.magadanski.EventDispatcher = EventDispatcher;
})();

com.magadanski.WebApp = null;
(function () {
	function WebApp() {
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
	
	WebApp.prototype = new com.magadanski.EventDispatcher();
	WebApp.prototype.constructor = WebApp;
	WebApp.prototype.parent = com.magadanski.EventDispatcher.prototype;
	
	com.magadanski.WebApp = WebApp;
})();