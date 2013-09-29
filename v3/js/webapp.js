define('com.magadanski.EventDispatcher', function () {
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
});

define('com.magadanski.WebApp', function () {
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
	
	WebApp.inherits(com.magadanski.EventDispatcher);
	
	com.magadanski.WebApp = WebApp;
});