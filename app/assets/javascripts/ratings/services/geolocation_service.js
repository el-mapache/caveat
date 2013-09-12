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
    isSupported: function() {
      return supported;
    },
    
    currentPostion: null,

    getPosition: function(onSuccess, onError) {
      var self = this;
      navigator.geolocation.getCurrentPosition(function(position) {
        self.currentPosition = position.coords;
        onSuccess(position);
      }, function(error) {
          if (typeof onError === "function") onError(error);
      });
    },
    
    reverseGeocode: function(callback) {
      var geocoder = new google.maps.Geocoder();
      
      this.getPosition(function(position) {
        var latlng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);

        geocoder.geocode({'latLng': latlng}, function(results, status) {
          if (status === google.maps.GeocoderStatus.OK) {
            if (results[1]) {
              callback(parseGeocodeResults(results[1]));
            }
          }
        });
      });
    }
  };
});
