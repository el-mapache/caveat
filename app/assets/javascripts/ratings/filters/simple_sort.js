angular.module("simple-sort", []).filter("simpleSort", function() {
	return function(obj) {
		if (!obj || typeof obj !== "object") return false;
		
		var array = [];
		
    Object.keys(obj).forEach(function(key) {
      array.push(obj[key]);
    });
		
		return array.sort();
	};
});