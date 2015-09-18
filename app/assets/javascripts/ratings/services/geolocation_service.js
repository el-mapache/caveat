angular.module("GeolocationService", []).service("GeolocationService", function() {
  // Test for html5 geolocation compatibility
  var supported = "geolocation" in navigator;

  return {
    // Current lat/lng coordinates the main viewport is showing
    currentPosition: null,

    isSupported: function() {
      return supported;
    },

    getCurrentPosition: function(onSuccess, onError) {
      var self = this;

      navigator.geolocation.getCurrentPosition(function(position) {
        // On successful geolocation, update the map's current position and execute
        // the success callback
        self.updateCurrentPosition(position.coords);
        onSuccess(self.currentPosition);
      }, function(error) {
          onError(error);
      });
    },

    updateCurrentPosition: function(coords) {
      this.currentPosition = coords;
    }
  };
});

