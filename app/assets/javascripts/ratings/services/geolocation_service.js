angular.module("geolocationService", []).service("geolocationService", function() {
  var supported = "geolocation" in navigator;
  
  function parseGeocodeResults(address) {
    var position = {
      coords: {
        latitude: "", 
        longitude: "" 
      }
    };
    
    position.coords.latitude = address.geometry.location.lat();
    position.coords.longitude = address.geometry.location.lng();
    return {
      address: address.formatted_address,
      position: position
    }
  }
  
  return {
    // Current lat/lng coordinates the main viewport is showing
    currentPosition: null,
    
    isSupported: function() {
      return supported;
    },
    
    updateCurrentPosition: function(coords) {
      this.currentPosition = coords;
    }, 

    geocode: function(onSuccess, onError) { 
      var self = this;
           
      navigator.geolocation.getCurrentPosition(function(position) {
        self.updateCurrentPosition(position.coords);
        onSuccess();
      }, function(error) {
          if (typeof onError === "function") onError(error);
      });
    },
    
    reverseGeocode: function(callback) {
      var geocoder = new google.maps.Geocoder(),
          self = this;
      
      this.geocode(function() {
        var latlng = new google.maps.LatLng(self.currentPosition.latitude, self.currentPosition.longitude);

        geocoder.geocode({'latLng': latlng}, function(results, status) {
          if (status === google.maps.GeocoderStatus.OK) {
            if (results[0]) {
              callback(parseGeocodeResults(results[0]));
            }
          }
        }, function(error) {
          callback(error);
        });
      });
    }
  };
});
