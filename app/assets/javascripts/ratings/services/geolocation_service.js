angular.module("geolocationService", []).service("geolocationService", function() {
  var supported = "geolocation" in navigator;

  return {
    isSupported: function() {
      return supported;
    },
    
    currentPostion: null,
      
    getPosition: function(callback) {
      var self = this;
      navigator.geolocation.getCurrentPosition(function(position) {
        self.currentPosition = position.coords;
        callback(position);
      }, function(error) {
          callback(error);
      });
    }
  };
});
