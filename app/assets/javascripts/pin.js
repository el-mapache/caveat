angular.module("Pin",['InfoWindow']).factory("Pin", function(InfoWindow) {
  function Pin(opts, message, index) {
    google.maps.Marker.apply(this, arguments);
    this.active = false;
    this.infoWindow = null;
    this.message = message || "";
    this.index = index;
  }
  
  Pin.prototype = new google.maps.Marker();
  
  Pin.prototype.toggleInfoWindow = function() {
    if (this.active) { 
      this.infoWindow.remove();
      this.active = false;
      this.infoWindow = null;
    } else {
      var infoWindow = new InfoWindow({latlng: this.getPosition(), map: this.map, content: this.message});
      this.infoWindow = infoWindow;
      this.active = true;
    }
  };

  Pin.prototype.removeWindow = function() {
    if (!this.infoWindow) return;

    this.infoWindow.remove();
    this.infoWindow = null;
  };
  return Pin;
});
