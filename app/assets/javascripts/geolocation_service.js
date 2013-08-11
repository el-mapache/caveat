angular.module("geolocationService", []).service("geolocationService", function() {
  var supported = "geolocation" in navigator;

  return {
    isSupported: function() {
      return supported;
    },

    getPosition: function(callback) {
      navigator.geolocation.getCurrentPosition(function(position) {
        callback(position);
      }, function(error) {
          callback(error);
      });
    }
  };
});
