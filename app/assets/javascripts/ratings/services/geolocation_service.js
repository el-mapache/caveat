angular.module("geolocationService", []).service("geolocationService", function() {
  var supported = "geolocation" in navigator;

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
              console.log(results)
              var position = {coords: {latitude: "", longitude: ""}};
              position.coords.latitude = results[1].geometry.location.lat();
              position.coords.longitude = results[1].geometry.location.lng();
              console.log(position)
              callback({address: results[1].formatted_address, position: position})
            }
          }
        });
      });
    }
    
  };
});
